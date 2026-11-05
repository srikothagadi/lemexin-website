// Cloudflare Pages Function: POST /api/contact
//
// 1. validates the message
// 2. saves it to Cloudflare KV (binding: LEADS), so nothing is lost
// 3. forwards it to the email relay and to Google Sheets, when configured
//
// Settings (Cloudflare Pages > Settings > Variables and Secrets):
//   LEADS              KV namespace binding (required)
//   EMAIL_RELAY_URL    URL of hostgator/lemexin-mail-relay.php   (optional)
//   EMAIL_RELAY_TOKEN  shared secret for the relay               (optional)
//   SHEETS_WEBHOOK_URL Google Apps Script web app URL            (optional)

const MAX = { name: 120, email: 200, company: 200, area: 120, message: 5000 };

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const clean = (value, max) => String(value ?? "").trim().slice(0, max);

export async function onRequestPost({ request, env }) {
  let input;
  try {
    input = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request" }, 400);
  }

  // Honeypot: real visitors leave this empty. Pretend success for bots.
  if (input.website) return json({ ok: true });

  const lead = {
    name: clean(input.name, MAX.name),
    email: clean(input.email, MAX.email),
    company: clean(input.company, MAX.company),
    area: clean(input.area, MAX.area),
    message: clean(input.message, MAX.message),
    received: new Date().toISOString(),
    country: request.cf?.country || "",
  };

  if (!lead.name || !lead.message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email)) {
    return json({ ok: false, error: "Missing or invalid fields" }, 400);
  }

  // 1. Store first. If this fails there is nothing to fall back on.
  if (!env.LEADS) return json({ ok: false, error: "Storage not configured" }, 500);
  const key = `lead:${lead.received}:${crypto.randomUUID().slice(0, 8)}`;
  await env.LEADS.put(key, JSON.stringify(lead));

  // 2. Forward. A failure here must not lose or reject the lead.
  const jobs = [];
  if (env.EMAIL_RELAY_URL) {
    jobs.push(
      fetch(env.EMAIL_RELAY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Relay-Token": env.EMAIL_RELAY_TOKEN || "" },
        body: JSON.stringify(lead),
      })
    );
  }
  if (env.SHEETS_WEBHOOK_URL) {
    jobs.push(
      fetch(env.SHEETS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(lead),
      })
    );
  }
  await Promise.allSettled(jobs);

  return json({ ok: true });
}

export const onRequest = () => json({ ok: false, error: "Method not allowed" }, 405);
