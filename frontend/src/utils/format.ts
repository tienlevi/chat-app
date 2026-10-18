export const formatISODateToTimestamp = (time: string) => {
  return new Date(time).getTime();
};
