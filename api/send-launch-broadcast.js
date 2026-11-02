/* eslint-env node */
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed." });

  const adminToken = process.env.NEWSLETTER_ADMIN_TOKEN;
  const authHeader = req.headers.authorization || "";
  if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM_EMAIL;

  if (!supabaseUrl || !supabaseServiceRoleKey || !resendApiKey || !resendFrom) {
    return res.status(500).json({ message: "Broadcast service is not configured." });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const resend = new Resend(resendApiKey);

  const { data: subscribers, error } = await supabase
    .from("subscribers")
    .select("email")
    .eq("status", "active");

  if (error) return res.status(500).json({ message: "Could not load subscribers." });
  if (!subscribers?.length) return res.status(200).json({ message: "No active subscribers found.", sent: 0 });

  const to = subscribers.map((row) => row.email);
  const subject = "Alignna ya está lista";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Alignna ya está disponible</h2>
      <p>Gracias por esperar. Ya puedes conocer nuestros productos.</p>
      <p>Muy pronto compartiremos más novedades.</p>
    </div>
  `;

  const sendResult = await resend.emails.send({
    from: resendFrom,
    to,
    subject,
    html,
  });

  if (sendResult.error) {
    return res.status(500).json({ message: "Broadcast failed.", error: sendResult.error });
  }
  return res.status(200).json({ message: "Broadcast sent.", sent: to.length, id: sendResult.data?.id });
}
