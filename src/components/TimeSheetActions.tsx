import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "sonner"
import * as XLSX from 'xlsx'
import { calculateWorkHours, timeToMinutes } from "@/utils/timeCalculations"
import { useTimesheet } from "@/contexts/TimesheetContext"

export function TimeSheetActions() {
  const { timeEntries, setTimeEntries, workdayConfig, setDashboardData } = useTimesheet()

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
      const templateData = [
        ['Data', 'Dia da Semana', '1ª Entrada', '1ª Saída', '2ª Entrada', '2ª Saída'],
        ['8/1/24', 'SEG', '08:00', '12:00', '13:00', '17:00'],
        ['9/1/24', 'TER', '08:00', '12:00', '13:00', '17:00'],
        ['10/1/24', 'QUA', '08:00', '12:00', '13:00', '17:00'],
        ['11/1/24', 'QUI', '08:00', '12:00', '13:00', '17:00'],
        ['12/1/24', 'SEX', '08:00', '12:00', '13:00', '17:00']
      ]

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

  return (
    <div className="flex gap-2">
      <Button onClick={downloadTemplate} variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Baixar Modelo
      </Button>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => {/* ... keep existing code */}}
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