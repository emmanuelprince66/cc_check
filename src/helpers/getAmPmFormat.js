export const convertTo12HourFormat = (timeString) => {
  const [hours, minutes] =  timeString.split(":");

  return `${hours}:${minutes} `;
};
