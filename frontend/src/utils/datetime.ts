const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const formatDateToTimestamp = (date: Date): number =>
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
  const days = Math.round(
    (formatDateToTimestamp(new Date()) - formatDateToTimestamp(date)) / DAY,
  );

  if (days <= 0) return formatTime(iso, locale);
  if (days < 7)
    return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date);

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(date);
};

/** Key used to bucket messages by calendar day. */
export const formatTimestampToString = (iso: string): string =>
  String(formatDateToTimestamp(new Date(iso)));

/**
 * Divider label for a day bucket as `dd/MM/yyyy`. Returns `null` for today and
 * yesterday so the caller can substitute a translated string.
 */
export const formatDayDivider = (iso: string): string | null => {
  const date = new Date(iso);
  const days = Math.round(
    (formatDateToTimestamp(new Date()) - formatDateToTimestamp(date)) / DAY,
  );

  if (days <= 0 || days === 1) return null;

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${date.getFullYear()}`;
};

/** Days since `iso`: 0 today, 1 yesterday, and so on. */
export const daysAgo = (iso: string): number =>
  Math.round(
    (formatDateToTimestamp(new Date()) - formatDateToTimestamp(new Date(iso))) /
      DAY,
  );
