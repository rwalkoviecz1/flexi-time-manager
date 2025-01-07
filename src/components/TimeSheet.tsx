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
import { calculateWorkHours, type TimeEntry, type WorkdayConfig } from "@/utils/timeCalculations"

export function TimeSheet() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [workdayConfig] = useState<WorkdayConfig>({
    startTime: "08:00",
    endTime: "17:00",
    breakStart: "12:00",
    breakEnd: "13:00",
    workDays: ["1", "2", "3", "4", "5"]
  })

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
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

          // Processa os dados da planilha
          const processedEntries: TimeEntry[] = jsonData.slice(1)
            .filter(row => validateRow(row))
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