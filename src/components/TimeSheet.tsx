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

export function TimeSheet() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // TODO: Implement Excel file processing
      console.log("File selected:", file.name)
      toast.success("Arquivo importado com sucesso!")
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