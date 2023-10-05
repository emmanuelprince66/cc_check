export const convertTo12HourFormat = (timeString) => {

  if (timeString){
    const [hours, minutes] =  timeString.split(":");

    return `${hours}:${minutes} `;
  
  }
else{
  return 'Loading...'
}
};
