import { EVENT_INFO } from '../data/reunionData';

export function getReunionGoogleCalendarUrl(): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${EVENT_INFO.title} — PINHS Section Diamond Reunion`,
    dates: '20270123T090000Z/20270123T213000Z',
    details: [
      `${EVENT_INFO.subtitle}`,
      `${EVENT_INFO.schoolFull} • Adviser: ${EVENT_INFO.adviser}`,
      `Theme / Dress Code: ${EVENT_INFO.theme}`,
      `Attendance Form (Deadline ${EVENT_INFO.rsvpDeadlineDisplay}): ${EVENT_INFO.rsvpUrl}`,
    ].join('\n'),
    location: `${EVENT_INFO.venueName}, ${EVENT_INFO.venueLandmark}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getRsvpReminderGoogleCalendarUrl(): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'DEADLINE: PINHS Section Diamond Attendance Form',
    dates: '20261204T120000Z/20261204T155900Z',
    details: `Fill out the reunion attendance Google Form before Dec 4, 2026 (11:59 PM): ${EVENT_INFO.rsvpUrl}`,
    location: EVENT_INFO.rsvpUrl,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadReunionIcs(): void {
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//The Last Diamond//PINHS Reunion//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:last-diamond-pinhs-2027@reunion',
    'DTSTAMP:20261122T080000Z',
    'DTSTART:20270123T090000Z',
    'DTEND:20270123T213000Z',
    `SUMMARY:${EVENT_INFO.title} — PINHS Section Diamond`,
    `LOCATION:${EVENT_INFO.venueName}\\, ${EVENT_INFO.venueLandmark}`,
    `DESCRIPTION:4th Year High School Reunion of Section Diamond (${EVENT_INFO.schoolFull}). Adviser: ${EVENT_INFO.adviser}. Theme: ${EVENT_INFO.theme}. Attendance Form due Dec 4\\, 2026: ${EVENT_INFO.rsvpUrl}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsLines], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'the-last-diamond-reunion-2027.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
