export const isDateWithinRule = (dateStr, rule) => {
  const d = new Date(dateStr);
  const start = new Date(rule.startDate);
  const end = rule.until ? new Date(rule.until) : null;

  return (!end || d <= end) && d >= start;
};

export const matchesRepeatRule = (dateStr, rule) => {
  if (!rule.repeat) return false;

  const d = new Date(dateStr);
  const dayOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][d.getDay()];

  if (rule.repeatType === "daily") return true;
  if (rule.repeatType === "weekly") return rule.repeatDays.includes(dayOfWeek);

  return false;
};
