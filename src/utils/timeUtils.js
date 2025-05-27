export const timeStrToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

export const getCurrentMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

export const isInRange = (start, end, current) => {
  if (start <= end) return current >= start && current < end;
  return current >= start || current < end;
};

export const getCurrentState = (sleepStart, sleepEnd, workStart, workEnd) => {
  const sleepStartM = timeStrToMinutes(sleepStart);
  const sleepEndM = timeStrToMinutes(sleepEnd);
  const workStartM = timeStrToMinutes(workStart);
  const workEndM = timeStrToMinutes(workEnd);
  const now = getCurrentMinutes();

  if (isInRange(sleepStartM, sleepEndM, now)) return "sleep";
  if (isInRange(workStartM, workEndM, now)) return "work";
  return "rest";
};
