export const formatDateToTimestamp = (date: string | Date) => {
  return new Date(date).getTime();
};
