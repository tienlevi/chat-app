const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export const formatTime = (iso: string, locale: string): string =>
  new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

/**
 * Compact stamp for conversation rows: time for today, weekday this week,
 * short date beyond that.
 */
export const formatListStamp = (iso: string, locale: string): string => {
  const date = new Date(iso);
  const days = Math.round((startOfDay(new Date()) - startOfDay(date)) / DAY);

  if (days <= 0) return formatTime(iso, locale);
  if (days < 7)
    return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date);

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(date);
};

/** Key used to bucket messages by calendar day. */
export const dayKey = (iso: string): string => String(startOfDay(new Date(iso)));

/**
 * Divider label for a day bucket. Returns `null` for today and yesterday so
 * the caller can substitute a translated string.
 */
export const formatDayDivider = (iso: string, locale: string): string | null => {
  const date = new Date(iso);
  const days = Math.round((startOfDay(new Date()) - startOfDay(date)) / DAY);

  if (days <= 0 || days === 1) return null;

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: days > 300 ? "numeric" : undefined,
  }).format(date);
};

/** Days since `iso`: 0 today, 1 yesterday, and so on. */
export const daysAgo = (iso: string): number =>
  Math.round((startOfDay(new Date()) - startOfDay(new Date(iso))) / DAY);

export const minutesBetween = (a: string, b: string): number =>
  Math.abs(new Date(a).getTime() - new Date(b).getTime()) / MINUTE;
