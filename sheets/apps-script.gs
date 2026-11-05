// Google Apps Script (template). In your lead sheet: Extensions > Apps Script,
// paste this, then Deploy > New deployment > Web app (execute as you, anyone
// can access). Put the web app URL in SHEETS_WEBHOOK_URL in Cloudflare.
function doPost(e) {
  var lead = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActiveSheet().appendRow([
    lead.received, lead.name, lead.email, lead.company, lead.area, lead.message, lead.country,
  ]);
  return ContentService.createTextOutput("ok");
}
