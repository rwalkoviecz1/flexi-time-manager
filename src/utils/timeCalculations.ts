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

export interface WorkdayConfig {
  startTime: string
  endTime: string
  breakStart: string
  breakEnd: string
  workDays: string[]
  salary?: number
  workHoursPerDay?: number
}

export interface TimeEntry {
  date: string
  weekDay: string
  firstEntry: string
  firstExit: string
  secondEntry: string
  secondExit: string
  totalHours: string
  overtime50: string
  overtime100: string
  hourValue?: string
  totalValue?: string
  overtime50Value?: string
  overtime100Value?: string
}

export const calculateWorkHours = (entry: TimeEntry, config: WorkdayConfig): { total: string, overtime50: string, overtime100: string } => {
  // Calcula o total de minutos trabalhados no primeiro período
  const firstPeriodMinutes = timeToMinutes(entry.firstExit) - timeToMinutes(entry.firstEntry)
  
  // Calcula o total de minutos trabalhados no segundo período
  const secondPeriodMinutes = timeToMinutes(entry.secondExit) - timeToMinutes(entry.secondEntry)
  
  // Total de minutos trabalhados no dia
  const totalMinutes = firstPeriodMinutes + secondPeriodMinutes

  // Jornada regular em minutos (8 horas = 480 minutos)
  const regularWorkday = 480

  // Calcula horas extras
  let overtime50Minutes = 0
  let overtime100Minutes = 0

  if (totalMinutes > regularWorkday) {
    try {
      const date = new Date(entry.date)
      const dayOfWeek = date.getDay().toString()
      
      // Se for dia útil, considera hora extra 50%
      if (config.workDays.includes(dayOfWeek)) {
        overtime50Minutes = totalMinutes - regularWorkday
      } else {
        // Se for fim de semana ou feriado, considera hora extra 100%
        overtime100Minutes = totalMinutes - regularWorkday
      }
    } catch (error) {
      console.error("Erro ao processar data:", error)
    }
  }

  return {
    total: minutesToTime(totalMinutes),
    overtime50: minutesToTime(overtime50Minutes),
    overtime100: minutesToTime(overtime100Minutes)
  }
}
