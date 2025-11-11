export const convertToISOWithoutDateChange = (date: Date) => {
  const adjustedDate = new Date(date);
  adjustedDate.setHours(12, 0, 0, 0); // Set to noon
  return adjustedDate.toISOString();
};
