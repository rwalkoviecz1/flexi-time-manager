export interface TimeEntry {
  date: string;
  weekDay: string;
  firstEntry: string;
  firstExit: string;
  secondEntry: string;
  secondExit: string;
  totalHours: string;
  overtime50: string;
  overtime100: string;
  hourValue?: string;
  totalValue?: string;
  overtime50Value?: string;
  overtime100Value?: string;
}

export interface WorkdayConfigData {
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
  workDays: string[];
  salary: number;
  workHoursPerDay: number;
  periodStart: string;
  periodEnd: string;
}