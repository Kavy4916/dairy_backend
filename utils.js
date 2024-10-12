function getOffsetString(offsetMinutes) {
    // Determine if the offset is positive or negative
    const sign = offsetMinutes >= 0 ? '-' : '+';
    
    // Get the absolute value of the minutes to avoid negative values when formatting
    const absoluteOffset = Math.abs(offsetMinutes);
  
    // Calculate hours and minutes
    const hours = Math.floor(absoluteOffset / 60);
    const minutes = absoluteOffset % 60;
  
    // Format hours and minutes to ensure two digits
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
  
    // Return the formatted timezone string
    return `${sign}${formattedHours}:${formattedMinutes}`;
  }

function getLocaleDate(offsetMinutes) {
  const date = new Date();
  const localDate = new Date(date-offsetMinutes*60000).toISOString().split('T')[0];
  return localDate;
}
  
export {getOffsetString, getLocaleDate};