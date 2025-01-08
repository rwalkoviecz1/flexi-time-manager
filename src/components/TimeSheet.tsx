import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import * as XLSX from 'xlsx'
import { calculateWorkHours, timeToMinutes, type TimeEntry, type WorkdayConfig } from "@/utils/timeCalculations"
import { Download } from "lucide-react"

export interface WorkdayConfigData {
  startTime: string
  endTime: string
  breakStart: string
  breakEnd: string
  workDays: string[]
  salary: number
  workHoursPerDay: number
}

export function TimeSheet() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [workdayConfig, setWorkdayConfig] = useState<WorkdayConfigData>(() => {
    const saved = localStorage.getItem('workdayConfig')
    return saved ? JSON.parse(saved) : {
      startTime: "08:00",
      endTime: "17:00",
      breakStart: "12:00",
      breakEnd: "13:00",
      workDays: ["SEG", "TER", "QUA", "QUI", "SEX"],
      salary: 0,
      workHoursPerDay: 8
    }
  })

  useEffect(() => {
    const handleConfigChange = () => {
      const saved = localStorage.getItem('workdayConfig')
      if (saved) {
        setWorkdayConfig(JSON.parse(saved))
      }
    }

    window.addEventListener('storage', handleConfigChange)
    return () => window.removeEventListener('storage', handleConfigChange)
  }, [])

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
    toast.success("Valores calculados com sucesso!")
  }

  const validateRow = (row: any[]): boolean => {
    if (!Array.isArray(row) || row.length < 6) return false
    return true
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[]

          // Verifica se jsonData é um array
          if (!Array.isArray(jsonData)) {
            throw new Error("Formato de dados inválido")
          }

          // Processa os dados da planilha
          const processedEntries: TimeEntry[] = jsonData.slice(1)
            .filter((row): row is any[] => Array.isArray(row) && validateRow(row))
            .map((row: any) => {
              const entry: TimeEntry = {
                date: row[0]?.toString() || '',
                weekDay: row[1]?.toString() || '',
                firstEntry: row[2]?.toString() || '',
                firstExit: row[3]?.toString() || '',
                secondEntry: row[4]?.toString() || '',
                secondExit: row[5]?.toString() || '',
                totalHours: "00:00",
                overtime50: "00:00",
                overtime100: "00:00"
              }

              // Calcula as horas trabalhadas
              const hours = calculateWorkHours(entry, workdayConfig)
              entry.totalHours = hours.total
              entry.overtime50 = hours.overtime50
              entry.overtime100 = hours.overtime100

              return entry
            })

          if (processedEntries.length === 0) {
            throw new Error("Nenhum registro válido encontrado na planilha")
          }

          setTimeEntries(processedEntries)
          toast.success("Arquivo importado com sucesso!")
        } catch (error) {
          console.error("Erro ao processar arquivo:", error)
          toast.error("Erro ao processar o arquivo. Verifique se o formato está correto e se há dados válidos.")
        }
      }
      reader.readAsArrayBuffer(file)
    }
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
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Registros de Ponto</CardTitle>
        <div className="flex gap-2">
          <Button onClick={downloadTemplate} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Baixar Modelo
          </Button>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
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
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Data</TableHead>
                <TableHead>Dia</TableHead>
                <TableHead>1ª Entrada</TableHead>
                <TableHead>1ª Saída</TableHead>
                <TableHead>2ª Entrada</TableHead>
                <TableHead>2ª Saída</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Extra 50%</TableHead>
                <TableHead>Extra 100%</TableHead>
                <TableHead>Valor/h</TableHead>
                <TableHead>Total R$</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center text-muted-foreground h-32">
                    Nenhum registro importado
                  </TableCell>
                </TableRow>
              ) : (
                timeEntries.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.weekDay}</TableCell>
                    <TableCell>{entry.firstEntry}</TableCell>
                    <TableCell>{entry.firstExit}</TableCell>
                    <TableCell>{entry.secondEntry}</TableCell>
                    <TableCell>{entry.secondExit}</TableCell>
                    <TableCell>{entry.totalHours}</TableCell>
                    <TableCell>{entry.overtime50}</TableCell>
                    <TableCell>{entry.overtime100}</TableCell>
                    <TableCell>R$ {entry.hourValue}</TableCell>
                    <TableCell>R$ {entry.totalValue}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
