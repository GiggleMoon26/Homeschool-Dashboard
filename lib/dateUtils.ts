// Timezone-safe "today" as YYYY-MM-DD, explicitly pinned to Australia/Sydney.
//
// Two separate bugs live here, and both matter:
//
// 1. `new Date().toISOString().slice(0, 10)` converts to UTC first, so any
//    local time before UTC "catches up" to the next day gets stamped with
//    the PREVIOUS day's date.
//
// 2. Even after fixing #1 by reading a Date object's local getFullYear()/
//    getMonth()/getDate()/getDay(), "local" means whatever timezone the
//    JAVASCRIPT RUNTIME is set to — and this app runs Server Components on
//    Vercel, where the server's runtime timezone is UTC by default, not
//    Sydney. So "local" on the server is NOT the same as "local" for an
//    Australian family, regardless of what device they're using.
//
// The fix for both: never rely on the runtime's own timezone at all.
// Explicitly ask for Australia/Sydney using Intl.DateTimeFormat, which also
// correctly handles the AEST/AEDT daylight saving switch automatically
// (a fixed "+10 hours" offset would NOT — it would be wrong for half the
// year). Use these functions everywhere instead of toISOString() or raw
// getFullYear()/getDay(), full stop.

const SYDNEY_TZ = 'Australia/Sydney';

export function fmtLocalISO(d: Date): string {
  // en-CA locale formats as YYYY-MM-DD, which is exactly what we want.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: SYDNEY_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

export function todayISO(): string {
  return fmtLocalISO(new Date());
}

export const DAY_CODES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function dayCodeFor(d: Date): string {
  // en-US short weekday gives exactly "Sun".."Sat", matching DAY_CODES.
  return new Intl.DateTimeFormat('en-US', {
    timeZone: SYDNEY_TZ,
    weekday: 'short',
  }).format(d);
}

export function todayDayCode(): string {
  return dayCodeFor(new Date());
}

// For display text like "Wednesday, 9 September" — same Sydney pinning,
// so the text always matches what todayISO()/todayDayCode() computed,
// regardless of the server's own clock/timezone.
export function formatLongDateSydney(d: Date): string {
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: SYDNEY_TZ,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(d);
}
