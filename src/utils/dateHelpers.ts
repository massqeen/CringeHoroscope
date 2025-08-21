/**
 * Get current date in YYYY-MM-DD format
 */
export function getCurrentDateString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get yesterday's date in YYYY-MM-DD format
 */
export function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

/**
 * Get tomorrow's date in YYYY-MM-DD format
 */
export function getTomorrowDateString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

/**
 * Get date string for the specified day option
 */
export function getDateString(day: "yesterday" | "today" | "tomorrow"): string {
  switch (day) {
    case "yesterday":
      return getYesterdayDateString();
    case "tomorrow":
      return getTomorrowDateString();
    case "today":
    default:
      return getCurrentDateString();
  }
}
