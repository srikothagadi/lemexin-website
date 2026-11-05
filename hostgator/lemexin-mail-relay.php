<?php
/**
 * Lemexin mail relay (template).
 *
 * Upload to the HostGator site as /wp-content/mu-plugins/lemexin-mail-relay.php
 * or run it as a standalone script. It accepts the lead JSON posted by
 * functions/api/contact.js and sends it to your inbox with PHP mail().
 *
 * Set RELAY_TOKEN to the same value as EMAIL_RELAY_TOKEN in Cloudflare.
 */
const RELAY_TOKEN = 'change-me';
const TO_ADDRESS  = 'info@lemexin.com';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
if (!hash_equals(RELAY_TOKEN, $_SERVER['HTTP_X_RELAY_TOKEN'] ?? '')) { http_response_code(403); exit; }

$lead = json_decode(file_get_contents('php://input'), true);
if (!is_array($lead)) { http_response_code(400); exit; }

$clean = fn($v) => trim(str_replace(["\r", "\n"], ' ', (string)($v ?? '')));
$subject = 'Website enquiry from ' . $clean($lead['name'] ?? '');
$body = implode("\n", [
  'Name: '    . $clean($lead['name'] ?? ''),
  'Email: '   . $clean($lead['email'] ?? ''),
  'Company: ' . $clean($lead['company'] ?? ''),
  'Area: '    . $clean($lead['area'] ?? ''),
  '',
  (string)($lead['message'] ?? ''),
]);

$headers = 'Reply-To: ' . $clean($lead['email'] ?? '') . "\r\nContent-Type: text/plain; charset=UTF-8";
echo mail(TO_ADDRESS, $subject, $body, $headers) ? 'ok' : 'fail';
