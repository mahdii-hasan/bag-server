export const forgotPasswordTemplate = (resetUrl, name = "User") => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:40px 0;">
      <tr>
        <td align="center">
          
          <!-- Main Container -->
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background:#111827; padding:30px;">
                <h1 style="color:#ffffff; margin:0; font-size:22px;">
                  Password Reset Request
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px 30px; color:#374151; font-size:15px; line-height:1.6;">
                
                <p>Hi <strong>${name}</strong>,</p>

                <p>
                  We received a request to reset your password. Click the button below to set a new password.
                </p>

                <!-- Button -->
                <p style="text-align:center; margin:30px 0;">
                  <a href="${resetUrl}" 
                     style="
                       background-color:#2563eb;
                       color:#ffffff;
                       padding:14px 28px;
                       text-decoration:none;
                       border-radius:6px;
                       font-weight:bold;
                       display:inline-block;
                     ">
                    Reset Password
                  </a>
                </p>

                <p>
                  This link will expire in <strong>10 minutes</strong> for security reasons.
                </p>

                <p>
                  If the button above doesn’t work, copy and paste the following link into your browser:
                </p>

                <p style="word-break:break-all; color:#2563eb;">
                  ${resetUrl}
                </p>

                <hr style="border:none; border-top:1px solid #e5e7eb; margin:30px 0;" />

                <p style="font-size:13px; color:#6b7280;">
                  If you did not request a password reset, you can safely ignore this email. 
                  Your password will remain unchanged.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background:#f9fafb; padding:20px; font-size:12px; color:#9ca3af;">
                © ${new Date().getFullYear()} Bag. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};