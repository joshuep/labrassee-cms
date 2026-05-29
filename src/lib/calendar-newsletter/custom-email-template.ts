import { escapeHTML } from './helpers'

const titleFontStack = 'DIN Condensed, Arial Narrow, Arial, Helvetica, sans-serif'
const bodyFontStack = 'Arial, Helvetica, sans-serif'

const UNSUBSCRIBE_URL = 'https://labrassee.cafe/desabonnement'

export type RenderCustomEmailInput = {
  businessName: string
  content: string
  siteURL: string
  tagline?: string | null
  title: string
}

const contentToParagraphsHTML = (content: string) =>
  content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(
      (block) =>
        `<p style="margin:0 0 16px 0; font-family:${bodyFontStack}; font-size:16px; line-height:24px; color:#2c2419;">${escapeHTML(
          block,
        ).replace(/\n/g, '<br />')}</p>`,
    )
    .join('')

export const renderCustomEmail = ({
  businessName,
  content,
  siteURL,
  tagline,
  title,
}: RenderCustomEmailInput) => {
  const safeTitle = escapeHTML(title)
  const safeTagline = tagline ? escapeHTML(tagline) : ''
  const safeBusinessName = escapeHTML(businessName)
  const bodyHTML = contentToParagraphsHTML(content)

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light only" />
        <title>${safeTitle}</title>
        <style>
          @media only screen and (max-width: 640px) {
            .email-shell {
              width: 100% !important;
            }
            .custom-title {
              font-size: 30px !important;
              line-height: 30px !important;
            }
          }
        </style>
      </head>
      <body style="margin:0; padding:0; background:#efe9dc; font-family:${bodyFontStack}; color:#101010;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; border-collapse:collapse; background:#efe9dc;">
          <tr>
            <td align="center" style="padding:22px 12px 28px 12px;">
              <table class="email-shell" role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; max-width:640px; border-collapse:separate; border-spacing:0; background:#f8f4ea;">
                <tr>
                  <td style="padding:0 12px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; border-collapse:separate; border-spacing:0; border:2px solid #16120c; border-radius:22px; overflow:hidden; background:linear-gradient(180deg, #1c160f 0%, #272015 100%); box-shadow:0 10px 30px rgba(22,18,12,0.16);">
                      <tr>
                        <td valign="top" style="padding:20px 24px 18px 24px;">
                          <div style="font-family:${bodyFontStack}; font-size:11px; line-height:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:#c9b97d; margin-bottom:10px;">
                            ${safeBusinessName}
                          </div>
                          <div class="custom-title" style="font-family:${titleFontStack}; font-size:34px; line-height:32px; font-weight:700; text-transform:uppercase; color:#f7d135;">
                            ${safeTitle}
                          </div>
                          ${
                            safeTagline
                              ? `<div style="font-family:${bodyFontStack}; font-size:13px; line-height:18px; color:#d7ccb3; margin-top:10px;">${safeTagline}</div>`
                              : ''
                          }
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 12px 0 12px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; border-collapse:separate; border-spacing:0; border:2px solid #f1e7cf; border-radius:22px; overflow:hidden; background:#fffdf8;">
                      <tr>
                        <td style="padding:30px 26px 26px 26px;">
                          ${bodyHTML}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 20px 26px 20px; text-align:center;">
                    <div style="font-family:${bodyFontStack}; font-size:14px; line-height:20px; color:#555555; margin-bottom:8px;">
                      <a href="${siteURL}" style="color:#7b705e; text-decoration:none;">${safeBusinessName}</a>
                    </div>
                    <a href="${UNSUBSCRIBE_URL}" style="font-family:${bodyFontStack}; font-size:11px; line-height:14px; color:#7b705e; text-decoration:underline;">
                      Se désabonner
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `

  const textLines = [
    title,
    ...(tagline ? [tagline] : []),
    '',
    content.trim(),
    '',
    businessName,
    `Se désabonner: ${UNSUBSCRIBE_URL}`,
  ]

  return {
    html,
    text: textLines.join('\n'),
  }
}
