import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WaitlistForm.css";

const NOTIFY_EMAIL =
  import.meta.env.VITE_NEWSLETTER_NOTIFY_EMAIL ?? "tadeosoto1993@gmail.com";
const ENDPOINT =
  import.meta.env.VITE_NEWSLETTER_ENDPOINT?.trim() || "/api/subscribe";

/**
 * Same subscribe pipeline as FooterNewsletterPanel (`/api/subscribe`).
 * Visual variants match the landing mock: light | dark | pill.
 */
export default function WaitlistForm({
  copy,
  locale,
  source,
  ctaLabel,
  variant = "light",
  idSuffix = "default",
  redirectTo,
}) {
  const reactId = useId();
  const inputId = `lp-email-${idSuffix}-${reactId}`;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === "success") return;

    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      setMessage(copy.errorEmpty);
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Accept-Language": locale,
        },
        body: JSON.stringify({
          email: trimmed,
          source,
          locale,
        }),
      });

      await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 400) throw new Error(copy.errorEmpty);
        throw new Error(copy.errorSend);
      }

      setStatus("success");
      setMessage(copy.success);
      setEmail("");
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      }
    } catch (error) {
      if (!import.meta.env.VITE_NEWSLETTER_ENDPOINT) {
        const subject = encodeURIComponent("Alignna — early access");
        const body = encodeURIComponent(
          `I'd like early-access updates.\n\nEmail: ${trimmed}\nSource: ${source}`,
        );
        window.location.href = `mailto:${NOTIFY_EMAIL}?subject=${subject}&body=${body}`;
        setStatus("success");
        setMessage(copy.successMailto);
        if (redirectTo) {
          navigate(redirectTo, { replace: true });
        }
        return;
      }
      setStatus("error");
      setMessage(error?.message || copy.errorSend);
    }
  };

  return (
    <div className={`lpForm lpForm--${variant}`}>
      <form className="lpForm__row" onSubmit={handleSubmit} noValidate>
        <label htmlFor={inputId} className="sr-only">
          {copy.emailLabel}
        </label>
        <input
          id={inputId}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={copy.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
          className="lpForm__input"
        />
        <button
          type="submit"
          className="lpForm__btn"
          disabled={status === "loading" || status === "success"}
        >
          {status === "loading"
            ? copy.submitting
            : status === "success"
              ? "✓"
              : ctaLabel}
        </button>
      </form>
      {copy.note ? <p className="lpForm__note">{copy.note}</p> : null}
      {message ? (
        <p
          className={
            status === "error" ? "lpForm__msg lpForm__msg--error" : "lpForm__msg"
          }
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
