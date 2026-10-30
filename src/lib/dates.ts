// Whole days from one `yyyy-mm-dd` value to another; 0 when either is missing
// or the end comes first.
export const daysBetween = (start: string, end: string) => {
  if (!start || !end) return 0;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
};
