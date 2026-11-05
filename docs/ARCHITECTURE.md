# Architecture

Browser -> Cloudflare Pages (static files from `public/`).

Contact form: `site.js` validates, then POSTs JSON to `/api/contact`.
`functions/api/contact.js` (Cloudflare Pages Function) then:

1. rejects bad input and bots (hidden `website` field)
2. saves the lead to Cloudflare KV (`LEADS`)
3. forwards it to the HostGator mail relay (PHP) and the Google Sheets web app

KV is written first, so a failure in email or Sheets never loses a lead.

Why static: fast, cheap, nothing to patch, nothing to hack. The trade-off is that
there is no admin dashboard; text changes mean editing HTML.

Security headers and caching are set in `public/_headers`. The content security
policy allows only same-origin scripts, styles, fonts and requests.
