const SibApiV3Sdk = require("sib-api-v3-sdk");
const apiInstance = require("../config/brevo");

/**
 * Send the post-purchase welcome email.
 * @param {string} studentEmail
 * @param {string} firstName       - Student's first name for personalised greeting
 * @param {string} courseName
 * @param {string} reference       - Paystack payment reference
 * @param {string} telegramLink    - Secure one-time Telegram deep link
 */
async function sendWelcomeEmail(studentEmail, firstName, courseName, reference, telegramLink) {

  const greeting = firstName ? firstName.trim() : "Student";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Welcome to SkillForge Digital Academy</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

<!-- Outer wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f4f8;padding:32px 16px;">
  <tr>
    <td align="center">

      <!-- Email card — max 600px -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

        <!-- ── HEADER ──────────────────────────────── -->
        <tr>
          <td style="background:linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%);border-radius:16px 16px 0 0;padding:36px 40px 32px;text-align:center;">

            <!-- Brand mark -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="padding-bottom:20px;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="background-color:#b8860b;border-radius:12px;padding:10px 16px;display:inline-block;">
                        <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">⚡ SkillForge</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <!-- Gold divider line -->
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="background-color:#b8860b;height:2px;width:48px;border-radius:2px;display:block;">&nbsp;</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-top:18px;">
                  <div style="width:72px;height:72px;background:rgba(184,134,11,0.15);border:2px solid #b8860b;border-radius:50%;display:inline-block;line-height:72px;text-align:center;font-size:34px;">✓</div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-top:16px;">
                  <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.3px;line-height:1.3;">Payment Confirmed!</h1>
                  <p style="margin:8px 0 0;color:#93c5fd;font-size:15px;font-weight:400;">SkillForge Digital Academy</p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- ── BODY ───────────────────────────────── -->
        <tr>
          <td style="background-color:#ffffff;padding:40px 40px 32px;">

            <!-- Greeting -->
            <p style="margin:0 0 8px;color:#0f172a;font-size:22px;font-weight:700;line-height:1.4;">
              Hello, ${greeting}! 🎉
            </p>
            <p style="margin:0 0 28px;color:#475569;font-size:15px;line-height:1.7;">
              Your payment was successful and your course access is ready. We're excited to have you join the SkillForge community.
            </p>

            <!-- Course + reference info box -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:28px;">
              <tr>
                <td style="padding:24px 24px 8px;">
                  <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Enrolled Course</p>
                  <p style="margin:0;color:#0f172a;font-size:17px;font-weight:700;">${courseName}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 24px 4px;">
                  <!-- Hairline divider -->
                  <div style="border-top:1px solid #e2e8f0;margin:16px 0;"></div>
                </td>
              </tr>
              <tr>
                <td style="padding:0 24px 24px;">
                  <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Payment Reference</p>
                  <p style="margin:0;color:#0f172a;font-size:14px;font-weight:600;font-family:'Courier New',monospace;background:#f1f5f9;padding:8px 12px;border-radius:6px;display:inline-block;">${reference}</p>
                </td>
              </tr>
            </table>

            <!-- What's included -->
            <p style="margin:0 0 16px;color:#0f172a;font-size:15px;font-weight:700;">What's included in your course:</p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
              <tr>
                <td style="padding:6px 0;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="width:28px;vertical-align:top;padding-top:1px;"><span style="color:#16a34a;font-size:16px;">✅</span></td>
                      <td style="color:#334155;font-size:14px;line-height:1.6;">HD Video Lessons</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="width:28px;vertical-align:top;padding-top:1px;"><span style="color:#16a34a;font-size:16px;">✅</span></td>
                      <td style="color:#334155;font-size:14px;line-height:1.6;">Downloadable PDFs &amp; Resources</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="width:28px;vertical-align:top;padding-top:1px;"><span style="color:#16a34a;font-size:16px;">✅</span></td>
                      <td style="color:#334155;font-size:14px;line-height:1.6;">Private Student Community</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="width:28px;vertical-align:top;padding-top:1px;"><span style="color:#16a34a;font-size:16px;">✅</span></td>
                      <td style="color:#334155;font-size:14px;line-height:1.6;">Official Announcement Channel</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="width:28px;vertical-align:top;padding-top:1px;"><span style="color:#16a34a;font-size:16px;">✅</span></td>
                      <td style="color:#334155;font-size:14px;line-height:1.6;">Lifetime Access &amp; Future Updates</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- CTA label -->
            <p style="margin:0 0 14px;color:#475569;font-size:14px;text-align:center;line-height:1.6;">
              Your course is ready. Tap the button below to unlock your access on Telegram.
            </p>

            <!-- PRIMARY CTA BUTTON -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;">
              <tr>
                <td align="center">
                  <a href="${telegramLink}"
                     target="_blank"
                     rel="noopener"
                     style="display:inline-block;width:100%;max-width:480px;padding:18px 24px;background-color:#0f172a;color:#ffffff;text-decoration:none;font-size:17px;font-weight:800;text-align:center;border-radius:14px;letter-spacing:0.2px;box-sizing:border-box;">
                    📲&nbsp; Open My Course
                  </a>
                </td>
              </tr>
            </table>

            <!-- Fallback link -->
            <p style="margin:0 0 28px;text-align:center;color:#94a3b8;font-size:12px;">
              Button not working?
              <a href="${telegramLink}" style="color:#1d4ed8;text-decoration:underline;">Click here</a>
            </p>

            <!-- Notice -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fffbeb;border:1px solid #fcd34d;border-radius:10px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0;color:#92400e;font-size:13px;line-height:1.6;">
                    <strong>⚠️ Important:</strong> This access link is unique to you and can only be used once. Do not share it with others.
                  </p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- ── SUPPORT BAND ────────────────────────── -->
        <tr>
          <td style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;text-align:center;">
            <p style="margin:0;color:#64748b;font-size:13px;line-height:1.8;">
              Need help? We're always here.<br>
              <a href="mailto:skillforgeacademy5@gmail.com" style="color:#1d4ed8;font-weight:600;text-decoration:none;">skillforgeacademy5@gmail.com</a>
            </p>
          </td>
        </tr>

        <!-- ── FOOTER ──────────────────────────────── -->
        <tr>
          <td style="background:linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%);border-radius:0 0 16px 16px;padding:28px 40px;text-align:center;">
            <p style="margin:0 0 6px;color:#ffffff;font-size:14px;font-weight:700;letter-spacing:0.3px;">⚡ SkillForge Digital Academy</p>
            <p style="margin:0 0 14px;color:#93c5fd;font-size:12px;line-height:1.6;">Learn Smarter. Earn Better. Build Your Future.</p>
            <div style="width:40px;height:1px;background-color:#b8860b;margin:0 auto 14px;"></div>
            <p style="margin:0;color:#64748b;font-size:11px;">
              © ${new Date().getFullYear()} SkillForge Digital Academy. All rights reserved.
            </p>
          </td>
        </tr>

      </table>
      <!-- /Email card -->

    </td>
  </tr>
</table>

</body>
</html>
  `.trim();

  const email = new SibApiV3Sdk.SendSmtpEmail();

  email.sender = {
    name: "SkillForge Digital Academy",
    email: "skillforgeacademy5@gmail.com",
  };

  email.to = [{ email: studentEmail }];

  email.subject = `🎉 Welcome to SkillForge Academy — ${courseName}`;

  email.htmlContent = html;

  await apiInstance.sendTransacEmail(email);
}

module.exports = sendWelcomeEmail;
