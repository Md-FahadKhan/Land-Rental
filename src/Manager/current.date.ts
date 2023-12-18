export class CurrentDate {
    getCurrentDate(): string {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1; 
      const day = currentDate.getDate();
      const year = currentDate.getFullYear();
  
      const formattedDate = `${month}/${day}/${year}`;
  
      return formattedDate;
    }
  }
  export class CurrentTime {
    getCurrentTime(): string {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    
    const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${meridiem}`;
    return formattedTime;
    }
    
  }

  