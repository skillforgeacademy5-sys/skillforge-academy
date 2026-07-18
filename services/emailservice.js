const SibApiV3Sdk = require("sib-api-v3-sdk");
const apiInstance = require("../config/brevo");

async function sendWelcomeEmail(studentEmail, courseName, telegramLink) {

    const email = new SibApiV3Sdk.SendSmtpEmail();

        email.sender = {
                name: "SkillForge Digital Academy",
                        email: "skillforgeacademy5@gmail.com"
                            };

                                email.to = [
                                        {
                                                    email: studentEmail
                                                            }
                                                                ];

                                                                    email.subject = `🎉 Welcome to SkillForge Academy - ${courseName}`;

                                                                        email.htmlContent = `
                                                                            <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:40px;">
                                                                                    <div style="max-width:650px;margin:auto;background:#fff;border-radius:16px;padding:40px;">

                                                                                                <h1>🎉 Welcome to SkillForge Digital Academy</h1>

                                                                                                            <p>Your payment has been confirmed successfully.</p>

                                                                                                                        <h2>${courseName}</h2>

                                                                                                                                    <p>
                                                                                                                                                    Click the button below to begin learning.
                                                                                                                                                                </p>

                                                                                                                                                                            <p style="text-align:center;margin:40px 0;">
                                                                                                                                                                                            <a href="${telegramLink}"
                                                                                                                                                                                                            style="background:#2563eb;color:white;text-decoration:none;padding:18px 35px;border-radius:10px;font-weight:bold;">
                                                                                                                                                                                                                            📲 Open My Course
                                                                                                                                                                                                                                            </a>
                                                                                                                                                                                                                                                        </p>

                                                                                                                                                                                                                                                                    <p>✅ Course Videos</p>
                                                                                                                                                                                                                                                                                <p>✅ Downloadable PDFs</p>
                                                                                                                                                                                                                                                                                            <p>✅ Student Community</p>
                                                                                                                                                                                                                                                                                                        <p>✅ Announcement Channel</p>

                                                                                                                                                                                                                                                                                                                    <br>

                                                                                                                                                                                                                                                                                                                                <strong>
                                                                                                                                                                                                                                                                                                                                            Learn Smarter. Earn Better. Build Your Future.
                                                                                                                                                                                                                                                                                                                                                        </strong>

                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                        `;

                                                                                                                                                                                                                                                                                                                                                                            await apiInstance.sendTransacEmail(email);

                                                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                                                            module.exports = sendWelcomeEmail;