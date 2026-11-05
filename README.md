# Lemexin website

A static HTML website with one small backend function. No framework, no database
server and no build step.

| Part | What it is |
|---|---|
| Pages | Hand-written HTML, one folder per page (`/about/`, `/services/`, `/contact/` ...) |
| Styling | One CSS file: `public/assets/css/site.css` |
| Scripts | One small file, `public/assets/js/site.js`: mobile menu, form checks, footer year |
| Fonts | Self-hosted Manrope (no Google Fonts calls) |
| Form backend | Cloudflare Pages Function `functions/api/contact.js`. Saves the lead to Cloudflare KV, then forwards it to the email relay and to Google Sheets |
| Hosting | Cloudflare Pages |
| Email | `hostgator/lemexin-mail-relay.php` (template) |
| Lead sheet | `sheets/apps-script.gs` (template) |

## Layout

    public/                  the website itself
      index.html             home page
      about/ services/ industries/ solutions/ work/
      insights/ (+ one folder per article)
      careers/ contact/ privacy/
      assets/css  js  fonts  images
      _headers  _redirects   security and cache rules, redirects
      sitemap.xml  robots.txt  404.html
    functions/api/contact.js the form backend
    hostgator/  sheets/      templates for the email relay and the Google Sheet
    publish.sh               publish to the live site (or: sh publish.sh test)
    setup-cloudflare.sh      one-time project and KV setup
    view-leads.sh            print saved leads
    docs/ARCHITECTURE.md     notes

## Preview locally

    npx wrangler pages dev public

## Publish

    sh publish.sh test     # preview first
    sh publish.sh          # live

## Before launch

- Replace the placeholder team, case studies, metrics and open roles with real ones.
- The contact address is info@lemexin.com (set in the HTML and in `hostgator/`).
- Run `sh setup-cloudflare.sh`, bind the KV namespace as `LEADS`, and set
  `EMAIL_RELAY_URL`, `EMAIL_RELAY_TOKEN` and `SHEETS_WEBHOOK_URL` if you use them.
- If your domain is not `lemexin.com`, search and replace it in the HTML and `sitemap.xml`.

## Changing text

Edit the HTML file for that page and run `sh publish.sh`. The header and footer
are repeated in every page, so change them in each file (search for `site-header`
and `site-footer`).
