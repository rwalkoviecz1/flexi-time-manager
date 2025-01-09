export const timeToMinutes = (time: string | null | undefined): number => {
  if (!time || typeof time !== 'string') return 0
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

export type ObservationType = "NONE" | "PONTO_FACULTATIVO" | "ATESTADO" | "COMPENSACAO";

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
  observation?: ObservationType;
}

export interface WorkdayConfig {
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
  workDays: string[];
  salary?: number;
  workHoursPerDay?: number;
}

export const calculateWorkHours = (entry: TimeEntry, config: WorkdayConfig): { total: string, overtime50: string, overtime100: string } => {
  const firstPeriodMinutes = timeToMinutes(entry.firstExit) - timeToMinutes(entry.firstEntry);
  const secondPeriodMinutes = timeToMinutes(entry.secondExit) - timeToMinutes(entry.secondEntry);
  const totalMinutes = firstPeriodMinutes + secondPeriodMinutes;
  const regularWorkday = (config.workHoursPerDay || 8) * 60;

  // Handle special cases based on observation
  switch (entry.observation) {
    case "PONTO_FACULTATIVO":
      // All hours count as bank hours
      return {
        total: minutesToTime(totalMinutes),
        overtime50: minutesToTime(totalMinutes),
        overtime100: "00:00"
      };
    case "ATESTADO":
      // Use configured workday hours
      return {
        total: minutesToTime(regularWorkday),
        overtime50: "00:00",
        overtime100: "00:00"
      };
    case "COMPENSACAO":
      // Regular hours but deduct from bank hours
      return {
        total: minutesToTime(totalMinutes),
        overtime50: "00:00",
        overtime100: "00:00"
      };
    default:
      // Regular calculation
      let overtime50Minutes = 0;
      let overtime100Minutes = 0;

      if (totalMinutes > regularWorkday) {
        try {
          const date = new Date(entry.date);
          const dayOfWeek = date.getDay().toString();
          
          if (config.workDays.includes(dayOfWeek)) {
            overtime50Minutes = totalMinutes - regularWorkday;
          } else {
            overtime100Minutes = totalMinutes - regularWorkday;
          }
        } catch (error) {
          console.error("Erro ao processar data:", error);
        }
      }

      return {
        total: minutesToTime(totalMinutes),
        overtime50: minutesToTime(overtime50Minutes),
        overtime100: minutesToTime(overtime100Minutes)
      };
  }
};
