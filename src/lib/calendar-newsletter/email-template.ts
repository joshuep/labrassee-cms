import { getMonthEnvelope, parseISODate, escapeHTML, formatRangeLabel, textToHTML } from './helpers'
import type {
  BuildEmailWeeksInput,
  CalendarWeekEvent,
  CalendarWeekSection,
  RenderCalendarEmailInput,
} from './types'

const titleFontStack = 'DIN Condensed, Arial Narrow, Arial, Helvetica, sans-serif'
const bodyFontStack = 'Arial, Helvetica, sans-serif'

const addDaysUTC = (value: Date, amount: number) => {
  const next = new Date(value)
  next.setUTCDate(next.getUTCDate() + amount)
  return next
}

const formatDateKey = (value: Date) => value.toISOString().slice(0, 10)

const formatMonthDay = (value: Date) =>
  new Intl.DateTimeFormat('fr-CA', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(value)

const formatWeekdayLabel = (isoDate: string) =>
  new Intl.DateTimeFormat('fr-CA', {
    day: 'numeric',
    timeZone: 'UTC',
    weekday: 'long',
  }).format(parseISODate(isoDate))

const getWeekdayParts = (isoDate: string) => {
  const parts = new Intl.DateTimeFormat('fr-CA', {
    day: 'numeric',
    timeZone: 'UTC',
    weekday: 'long',
  }).formatToParts(parseISODate(isoDate))

  return {
    weekdayDayNumber: parts.find((part) => part.type === 'day')?.value || '',
    weekdayName: parts.find((part) => part.type === 'weekday')?.value || '',
  }
}

const buildCalendarWeeks = ({
  displayMode,
  events,
  rangeEnd,
  rangeStart,
  selectedMonth,
}: BuildEmailWeeksInput): CalendarWeekSection[] => {
  const eventMap = new Map(events.map((event) => [event.dayKey, event]))
  const effectiveRange =
    displayMode === 'month' && selectedMonth ? getMonthEnvelope(selectedMonth) : { rangeEnd, rangeStart }

  const firstDate = parseISODate(effectiveRange.rangeStart)
  const lastDate = parseISODate(effectiveRange.rangeEnd)
  const sections: CalendarWeekSection[] = []
  let cursor = new Date(firstDate)

  while (cursor <= lastDate) {
    const weekStart = new Date(cursor)
    const weekEvents: CalendarWeekEvent[] = []

    for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
      const day = addDaysUTC(weekStart, dayOffset)
      if (day > lastDate) break

      const isoDate = formatDateKey(day)
      const event = eventMap.get(isoDate)

      if (!event) continue

      weekEvents.push({
        event,
        isoDate,
        ...getWeekdayParts(isoDate),
        weekdayLabel: formatWeekdayLabel(isoDate),
      })
    }

    if (weekEvents.length > 0) {
      const firstEventDate = parseISODate(weekEvents[0].isoDate)
      const lastEventDate = parseISODate(weekEvents[weekEvents.length - 1].isoDate)

      sections.push({
        events: weekEvents,
        label: `Semaine du ${formatMonthDay(firstEventDate)} au ${formatMonthDay(lastEventDate)}`,
      })
    }

    cursor = addDaysUTC(weekStart, 7)
  }

  return sections
}

const renderWeekSection = (week: CalendarWeekSection) => {
  const rows = week.events
    .map(
      ({ event, weekdayDayNumber, weekdayName }) => `
        <tr>
          <td class="event-day" valign="top" style="padding:0 12px 12px 0; white-space:nowrap;">
            <div style="font-family:${bodyFontStack}; font-size:13px; line-height:14px; color:#5a5147; font-weight:700; text-transform:lowercase; margin-bottom:3px;">
              ${escapeHTML(weekdayName)}
            </div>
            <div style="font-family:${titleFontStack}; font-size:38px; line-height:34px; color:#101010; font-weight:700;">
              ${escapeHTML(weekdayDayNumber)}
            </div>
          </td>
          <td class="event-title" valign="top" style="padding:16px 16px 12px 0; font-family:${titleFontStack}; font-size:22px; line-height:22px; color:#101010; font-weight:700;">
            ${escapeHTML(event.title)}
          </td>
          <td class="event-time" align="right" valign="top" style="padding:16px 0 12px 0; font-family:${bodyFontStack}; font-size:13px; line-height:16px; color:#101010; font-weight:700; white-space:nowrap;">
            ${escapeHTML(event.startDisplayTime.replace(/\s+/g, ''))}
          </td>
        </tr>
      `,
    )
    .join('')

  return `
    <tr>
      <td style="padding:0 20px 30px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="padding:0 0 14px 0; font-family:${titleFontStack}; font-size:32px; line-height:32px; color:#101010; font-weight:700;">
              ${escapeHTML(week.label)}
            </td>
          </tr>
          <tr>
            <td>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; border-collapse:collapse;">
                ${rows}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `
}

export const renderCalendarNewsletterEmail = ({
  addressLine1,
  addressLine2,
  businessName,
  introMessage,
  periodLabel,
  rangeEnd,
  rangeStart,
  subject,
  weeks,
}: RenderCalendarEmailInput) => {
  const safeSubject = escapeHTML(subject)
  const safePeriodLabel = escapeHTML(periodLabel || formatRangeLabel(rangeStart, rangeEnd))
  const safeIntro = textToHTML(
    introMessage?.trim() ||
      `Salut! On t’envoie ce courriel car tu t’es inscrit au calendrier mensuel de ${businessName}.`,
  )
  const safeAddress = escapeHTML(
    [addressLine1, addressLine2]
      .filter(Boolean)
      .join(', ')
      .trim() || '2522 rue Beaubien E, Rosepatrie',
  )
  const unsubscribeURL = 'https://labrassee.cafe/desabonnement'

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light only" />
        <title>${safeSubject}</title>
        <style>
          @media only screen and (max-width: 640px) {
            .email-shell {
              width: 100% !important;
            }
            .panel-cell {
              display: block !important;
              width: 100% !important;
              border-right: 0 !important;
              border-bottom: 1px solid #111111 !important;
              padding-top: 12px !important;
              padding-bottom: 10px !important;
            }
            .panel-cell:last-child {
              border-bottom: 0 !important;
              padding-top: 10px !important;
            }
            .panel-title {
              font-size: 24px !important;
              line-height: 24px !important;
            }
            .panel-period {
              font-size: 22px !important;
              line-height: 22px !important;
            }
            .intro-copy {
              font-size: 17px !important;
              line-height: 19px !important;
            }
            .week-title {
              font-size: 24px !important;
              line-height: 24px !important;
            }
            .event-time {
              font-size: 10px !important;
              line-height: 12px !important;
              padding-bottom: 10px !important;
            }
          }
        </style>
      </head>
      <body style="margin:0; padding:0; background:#efe9dc; font-family:${bodyFontStack}; color:#101010;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; border-collapse:collapse; background:#efe9dc;">
          <tr>
            <td align="center" style="padding:22px 12px 28px 12px;">
              <table class="email-shell" role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; max-width:760px; border-collapse:separate; border-spacing:0; background:#f8f4ea;">
                <tr>
                  <td style="padding:0 12px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; border-collapse:separate; border-spacing:0; border:2px solid #16120c; border-radius:22px; overflow:hidden; background:#16120c; box-shadow:0 10px 30px rgba(22,18,12,0.16);">
                      <tr>
                        <td class="panel-cell" valign="top" width="66%" style="width:66%; padding:18px 22px 16px 22px; border-right:2px solid rgba(247,209,53,0.5); background:linear-gradient(180deg, #1c160f 0%, #272015 100%);">
                          <div style="font-family:${bodyFontStack}; font-size:11px; line-height:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:#c9b97d; margin-bottom:10px;">
                            Notre programmation
                          </div>
                          <div class="panel-title" style="font-family:${titleFontStack}; font-size:31px; line-height:29px; font-weight:700; text-transform:uppercase; color:#f6f0df;">
                            Agenda mensuel de La Brassée
                          </div>
                          <div style="font-family:${bodyFontStack}; font-size:13px; line-height:18px; color:#d7ccb3; margin-top:10px;">
                            ${safeAddress}
                          </div>
                        </td>
                        <td class="panel-cell" valign="top" width="34%" style="width:34%; padding:18px 22px 16px 22px; background:#201910;">
                          <div style="font-family:${bodyFontStack}; font-size:11px; line-height:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:#c9b97d; margin-bottom:10px;">
                            PÉRIODE
                          </div>
                          <div class="panel-period" style="font-family:${titleFontStack}; font-size:29px; line-height:27px; font-weight:700; text-transform:uppercase; color:#f7d135;">
                            ${safePeriodLabel}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 12px 0 12px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; border-collapse:separate; border-spacing:0; border:2px solid #f1e7cf; border-radius:22px; overflow:hidden; background:#2a2419;">
                      <tr>
                        <td style="padding:28px 24px 26px 24px; text-align:center;">
                          <div class="intro-copy" style="font-family:${titleFontStack}; font-size:26px; line-height:28px; font-weight:700; color:#f7f0df;">
                            ${safeIntro}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="height:26px; font-size:0; line-height:0;">&nbsp;</td>
                </tr>
                ${weeks.map((week) => renderWeekSection(week)).join('')}
                <tr>
                  <td style="padding:4px 20px 26px 20px; text-align:center;">
                    <div style="font-family:${bodyFontStack}; font-size:14px; line-height:20px; color:#555555; margin-bottom:8px;">
                      ${escapeHTML(businessName)}
                    </div>
                    <a href="${unsubscribeURL}" style="font-family:${bodyFontStack}; font-size:11px; line-height:14px; color:#7b705e; text-decoration:underline;">
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
    'Programmation de La Brassée',
    periodLabel || formatRangeLabel(rangeStart, rangeEnd),
    safeAddress,
    '',
    introMessage?.trim() || `Salut! On t’envoie ce courriel car tu t’es inscrit au calendrier mensuel de ${businessName}.`,
    '',
    ...weeks.flatMap((week) => {
      const lines = [week.label]
      for (const { event, weekdayLabel } of week.events) {
        lines.push(`${weekdayLabel} ${event.title} - ${event.startDisplayTime}`)
      }
      lines.push('')
      return lines
    }),
    'Se désabonner: https://labrassee.cafe/desabonnement',
  ]

  return {
    html,
    text: textLines.filter(Boolean).join('\n'),
  }
}

export const buildEmailWeeks = (input: BuildEmailWeeksInput) => buildCalendarWeeks(input)
