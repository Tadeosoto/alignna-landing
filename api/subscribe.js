/* eslint-env node */
/* global Buffer, process */
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
};

const MESSAGES = {
  "en-AU": {
    methodNotAllowed: "Method not allowed.",
    serviceNotConfigured: "Newsletter service is not configured.",
    invalidRequestBody: "Invalid request body.",
    invalidEmail: "Please enter a valid email address.",
    saveFailed: "Could not save your email. Please try again.",
    success: "Done. We will notify you when launch is ready.",
  },
  "es-MX": {
    methodNotAllowed: "Método no permitido.",
    serviceNotConfigured: "El servicio de newsletter no está configurado.",
    invalidRequestBody: "El cuerpo de la solicitud no es válido.",
    invalidEmail: "Escribe un correo válido.",
    saveFailed: "No se pudo guardar tu correo. Intenta nuevamente.",
    success: "Listo. Te avisamos en cuanto sea el lanzamiento.",
  },
};

function normalizeLocale(locale) {
  const value = String(locale ?? "")
    .trim()
    .toLowerCase();
  if (value === "es-mx" || value.startsWith("es")) return "es-MX";
  return "en-AU";
}

const OWNER_NOTIFY_SUBJECT = "Newsletter — Alignna";

const OWNER_NOTIFY_COPY = {
  "es-MX": {
    intro: "Quiero recibir novedades.",
    label: "Correo:",
  },
  "en-AU": {
    intro: "I would like to receive updates.",
    label: "Email:",
  },
};

/** Destinatarios internos para avisar cada alta (solo servidor; separar por coma o punto y coma). */
function parseOwnerNotifyList(raw) {
  if (!raw || typeof raw !== "string") return [];
  return raw
    .split(/[,;]/)
    .map((s) => s.trim().toLowerCase())
    .filter((addr) => addr && EMAIL_RE.test(addr));
}

/**
 * Aviso al equipo cuando hay un nuevo suscriptor. No bloquea la respuesta al usuario si falla.
 */
async function sendOwnerSignupNotification({ subscriberEmail, locale }) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM_EMAIL;
  const notifyRaw = process.env.SUBSCRIBE_NOTIFY_EMAIL;
  const to = parseOwnerNotifyList(notifyRaw);

  if (!resendApiKey || !resendFrom || to.length === 0) return;

  const resend = new Resend(resendApiKey);
  const copy = OWNER_NOTIFY_COPY[locale] ?? OWNER_NOTIFY_COPY["en-AU"];
  const mailtoHref = `mailto:${subscriberEmail}`;
  const subject = OWNER_NOTIFY_SUBJECT;
  const text = `${copy.intro}\n\n${copy.label} ${subscriberEmail}`;
  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5; color: #000;">
      <p style="margin: 0 0 1em 0;">${escapeHtml(copy.intro)}</p>
      <p style="margin: 0;">
        ${escapeHtml(copy.label)}
        <a href="${mailtoHref}" style="color: #1a0dab; text-decoration: underline;">${escapeHtml(subscriberEmail)}</a>
      </p>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: resendFrom,
      to,
      subject,
      text,
      html,
    });
    if (result.error) {
      console.error("[subscribe] Resend notify error:", result.error);
    }
  } catch (err) {
    console.error("[subscribe] Resend notify failed:", err);
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object" && !("pipe" in req.body)) {
    return req.body;
  }

  if (typeof req.body === "string") {
    return req.body ? JSON.parse(req.body) : {};
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Max-Age", "86400");
    Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(204).end();
  }

  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  const requestLocale = normalizeLocale(
    req.headers["x-locale"] ?? req.query?.locale,
  );
  let i18n = MESSAGES[requestLocale];

  if (req.method !== "POST") {
    return res.status(405).json({ message: i18n.methodNotAllowed });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return res.status(500).json({ message: i18n.serviceNotConfigured });
  }

  let payload = {};
  try {
    payload = await readJsonBody(req);
  } catch {
    return res.status(400).json({ message: i18n.invalidRequestBody });
  }

  i18n = MESSAGES[normalizeLocale(payload.locale)] ?? i18n;

  const email = String(payload.email ?? "")
    .trim()
    .toLowerCase();
  const source = String(payload.source ?? "site-footer")
    .trim()
    .slice(0, 64);

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ message: i18n.invalidEmail });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: existingRow } = await supabase
    .from("subscribers")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  const { error } = await supabase.from("subscribers").upsert(
    {
      email,
      source,
      status: "active",
      subscribed_at: new Date().toISOString(),
    },
    { onConflict: "email", ignoreDuplicates: false },
  );

  if (error) {
    return res.status(500).json({ message: i18n.saveFailed });
  }

  const localeLabel = normalizeLocale(payload.locale);
  const isNewSubscriber = !existingRow;
  if (isNewSubscriber) {
    await sendOwnerSignupNotification({
      subscriberEmail: email,
      locale: localeLabel,
    });
  }

  return res.status(200).json({ message: i18n.success });
}
