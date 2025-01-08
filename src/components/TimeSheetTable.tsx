import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TimeEntry } from "@/utils/timeCalculations"
import { useTimesheet } from "@/contexts/TimesheetContext"

export function TimeSheetTable() {
  const { timeEntries } = useTimesheet()

  return (
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
  )
}