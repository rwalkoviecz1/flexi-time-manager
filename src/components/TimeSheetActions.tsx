import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "sonner"
import * as XLSX from 'xlsx'
import { calculateWorkHours, timeToMinutes, TimeEntry } from "@/utils/timeCalculations"
import { useTimesheet } from "@/contexts/TimesheetContext"
import { format, eachDayOfInterval, parse } from "date-fns"
import { ptBR } from "date-fns/locale"

export function TimeSheetActions() {
  const { timeEntries, setTimeEntries, workdayConfig, setDashboardData } = useTimesheet()

  const formatTimeValue = (value: any): string => {
    if (!value) return ''
    
    // Se já estiver no formato HH:mm:ss, retorna o valor
    if (typeof value === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(value)) {
      return value.substring(0, 5) // Retorna apenas HH:mm
    }
    
    // Se já estiver no formato HH:mm, retorna o valor
    if (typeof value === 'string' && /^\d{2}:\d{2}$/.test(value)) {
      return value
    }

    // Se for um número do Excel (valor decimal representando horas)
    if (typeof value === 'number') {
      const totalMinutes = value * 24 * 60
      const hours = Math.floor(totalMinutes / 60)
      const minutes = Math.floor(totalMinutes % 60)
      const seconds = Math.floor((totalMinutes * 60) % 60)
      // Retorna no formato HH:mm, ignorando os segundos para manter compatibilidade
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }

    // Tenta converter string para formato HH:mm:ss ou HH:mm
    try {
      const parts = value.toString().split(':').map(Number)
      const hours = parts[0]
      const minutes = parts[1]
      // Retorna no formato HH:mm, ignorando os segundos para manter compatibilidade
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    } catch {
      return ''
    }
  }

  const calculateHourValue = () => {
    if (!workdayConfig.salary || !workdayConfig.workHoursPerDay) {
      toast.error("Configure o salário e as horas de trabalho primeiro!")
      return
    }

    const daysInMonth = 22 // média de dias úteis no mês
    const hoursPerMonth = workdayConfig.workHoursPerDay * daysInMonth
    const hourValue = workdayConfig.salary / hoursPerMonth

    const updatedEntries = timeEntries.map(entry => {
      const hours = calculateWorkHours(entry, workdayConfig)
      return {
        ...entry,
        totalHours: hours.total,
        overtime50: hours.overtime50,
        overtime100: hours.overtime100,
        hourValue: hourValue.toFixed(2),
        totalValue: (hourValue * timeToMinutes(hours.total) / 60).toFixed(2),
        overtime50Value: (hourValue * 1.5 * timeToMinutes(hours.overtime50) / 60).toFixed(2),
        overtime100Value: (hourValue * 2 * timeToMinutes(hours.overtime100) / 60).toFixed(2)
      }
    })

    setTimeEntries(updatedEntries)

    // Update dashboard data
    const totalHours = updatedEntries.reduce((acc, entry) => acc + timeToMinutes(entry.totalHours), 0)
    const overtime = updatedEntries.reduce((acc, entry) => 
      acc + timeToMinutes(entry.overtime50) + timeToMinutes(entry.overtime100), 0)
    const overtimeThisWeek = updatedEntries
      .filter(entry => {
        const entryDate = new Date(entry.date)
        const today = new Date()
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
        return entryDate >= weekStart
      })
      .reduce((acc, entry) => 
        acc + timeToMinutes(entry.overtime50) + timeToMinutes(entry.overtime100), 0)
    
    setDashboardData({
      totalHours: Math.floor(totalHours / 60) + "h",
      overtimeHours: Math.floor(overtime / 60) + "h",
      overtimeThisWeek: "+" + Math.floor(overtimeThisWeek / 60) + "h",
      bankHours: "+" + Math.floor((totalHours - (workdayConfig.workHoursPerDay * 22 * 60)) / 60) + "h",
      absences: updatedEntries.filter(entry => 
        timeToMinutes(entry.totalHours) < workdayConfig.workHoursPerDay * 60).length
    })

    toast.success("Valores calculados com sucesso!")
  }

  const downloadTemplate = () => {
    try {
      if (!workdayConfig.periodStart || !workdayConfig.periodEnd) {
        toast.error("Configure as datas de início e fim do período primeiro!")
        return
      }

      const startDate = parse(workdayConfig.periodStart, 'yyyy-MM-dd', new Date())
      const endDate = parse(workdayConfig.periodEnd, 'yyyy-MM-dd', new Date())

      const datesInRange = eachDayOfInterval({ start: startDate, end: endDate })

      const templateData = [
        ['Data', 'Dia da Semana', '1ª Entrada', '1ª Saída', '2ª Entrada', '2ª Saída']
      ]

      datesInRange.forEach(date => {
        templateData.push([
          format(date, 'dd/MM/yyyy'),
          format(date, 'EEE', { locale: ptBR }).toUpperCase(),
          workdayConfig.startTime,
          workdayConfig.breakStart,
          workdayConfig.breakEnd,
          workdayConfig.endTime
        ])
      })

      const ws = XLSX.utils.aoa_to_sheet(templateData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Modelo")

      ws['!cols'] = [
        { wch: 12 },
        { wch: 15 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 }
      ]

      XLSX.writeFile(wb, "modelo_registro_ponto.xlsx")
      toast.success("Modelo baixado com sucesso!")
    } catch (error) {
      console.error("Erro ao gerar modelo:", error)
      toast.error("Erro ao gerar o modelo para download.")
    }
  }

  const handleFileImport = (file: File) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array', cellDates: true })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(worksheet)
        
        // Transform the imported data to match TimeEntry type
        const formattedEntries: TimeEntry[] = json.map((row: any) => ({
          date: row['Data'] || '',
          weekDay: row['Dia da Semana'] || '',
          firstEntry: formatTimeValue(row['1ª Entrada']),
          firstExit: formatTimeValue(row['1ª Saída']),
          secondEntry: formatTimeValue(row['2ª Entrada']),
          secondExit: formatTimeValue(row['2ª Saída']),
          totalHours: '00:00',
          overtime50: '00:00',
          overtime100: '00:00',
          observation: 'NONE'
        }))

        setTimeEntries(formattedEntries)
        toast.success("Planilha importada com sucesso!")
        
        // Calculate values immediately after import
        calculateHourValue()
      } catch (error) {
        console.error("Erro ao importar planilha:", error)
        toast.error("Erro ao importar a planilha. Verifique o formato do arquivo.")
      }
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="flex gap-2">
      <Button onClick={downloadTemplate} variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Baixar Modelo
      </Button>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            handleFileImport(file)
          }
        }}
        className="hidden"
        id="timesheet-upload"
      />
      <Button asChild variant="outline" size="sm">
        <label htmlFor="timesheet-upload" className="cursor-pointer">
          Importar Planilha
        </label>
      </Button>
      <Button onClick={calculateHourValue} size="sm">
        Calcular Valores
      </Button>
    </div>
  )
}