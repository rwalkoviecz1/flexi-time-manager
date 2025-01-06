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

interface TimeEntry {
  date: string
  weekDay: string
  firstEntry: string
  firstExit: string
  secondEntry: string
  secondExit: string
  totalHours: string
}

export function TimeSheet() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // TODO: Implement Excel file processing
      console.log("File selected:", file.name)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registros de Ponto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            id="timesheet-upload"
          />
          <Button asChild>
            <label htmlFor="timesheet-upload" className="cursor-pointer">
              Importar Planilha
            </label>
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Dia</TableHead>
                <TableHead>1ª Entrada</TableHead>
                <TableHead>1ª Saída</TableHead>
                <TableHead>2ª Entrada</TableHead>
                <TableHead>2ª Saída</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
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