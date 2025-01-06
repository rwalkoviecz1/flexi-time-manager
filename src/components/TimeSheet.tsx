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
import { useState } from "react"
import { toast } from "sonner"
import * as XLSX from 'xlsx'

interface TimeEntry {
  date: string
  weekDay: string
  firstEntry: string
  firstExit: string
  secondEntry: string
  secondExit: string
  totalHours: string
  overtime50: string
  overtime100: string
}

interface WorkdayConfig {
  startTime: string
  endTime: string
  breakStart: string
  breakEnd: string
  workDays: string[]
}

const calculateWorkHours = (entry: TimeEntry, config: WorkdayConfig): { total: string, overtime50: string, overtime100: string } => {
  // Função para converter horário em minutos
  const timeToMinutes = (time: string): number => {
    if (!time) return 0
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  // Função para converter minutos em formato de horário
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

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
    // Se for dia útil, considera hora extra 50%
    if (config.workDays.includes(new Date(entry.date).getDay().toString())) {
      overtime50Minutes = totalMinutes - regularWorkday
    } else {
      // Se for fim de semana ou feriado, considera hora extra 100%
      overtime100Minutes = totalMinutes - regularWorkday
    }
  }

  return {
    total: minutesToTime(totalMinutes),
    overtime50: minutesToTime(overtime50Minutes),
    overtime100: minutesToTime(overtime100Minutes)
  }
}

export function TimeSheet() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [workdayConfig] = useState<WorkdayConfig>({
    startTime: "08:00",
    endTime: "17:00",
    breakStart: "12:00",
    breakEnd: "13:00",
    workDays: ["1", "2", "3", "4", "5"]
  })

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
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

          // Processa os dados da planilha
          const processedEntries: TimeEntry[] = jsonData.slice(1).map((row: any) => {
            const entry: TimeEntry = {
              date: row[0],
              weekDay: row[1],
              firstEntry: row[2],
              firstExit: row[3],
              secondEntry: row[4],
              secondExit: row[5],
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

          setTimeEntries(processedEntries)
          toast.success("Arquivo importado com sucesso!")
        } catch (error) {
          console.error("Erro ao processar arquivo:", error)
          toast.error("Erro ao processar o arquivo. Verifique o formato.")
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Registros de Ponto</CardTitle>
        <div>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            id="timesheet-upload"
          />
          <Button asChild variant="outline">
            <label htmlFor="timesheet-upload" className="cursor-pointer">
              Importar Planilha
            </label>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground h-32">
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