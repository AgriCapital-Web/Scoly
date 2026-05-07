// Brevo email helper — replaces Resend
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

export const DEFAULT_FROM = { name: "Scoly", email: "noreply@scoly.ci" };

export interface BrevoEmail {
  to: string | string[];
  subject: string;
  html: string;
  from?: { name: string; email: string };
  replyTo?: string;
}

export async function sendBrevoEmail(opts: BrevoEmail) {
  if (!BREVO_API_KEY) {
    console.warn("BREVO_API_KEY not configured, skipping email send");
    return { ok: false, skipped: true };
  }
  const toArr = (Array.isArray(opts.to) ? opts.to : [opts.to]).map((email) => ({ email }));
  const body: Record<string, unknown> = {
    sender: opts.from || DEFAULT_FROM,
    to: toArr,
    subject: opts.subject,
    htmlContent: opts.html,
  };
  if (opts.replyTo) body.replyTo = { email: opts.replyTo };

  const resp = await fetch(BREVO_URL, {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    console.error("Brevo send failed:", resp.status, data);
    return { ok: false, status: resp.status, data };
  }
  return { ok: true, id: (data as any).messageId, data };
}
