import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TimeEntry, ObservationType } from "@/utils/timeCalculations"
import { useTimesheet } from "@/contexts/TimesheetContext"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function TimeSheetTable() {
  const { timeEntries, setTimeEntries } = useTimesheet()

  const handleObservationChange = (value: ObservationType, index: number) => {
    const updatedEntries = [...timeEntries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      observation: value
    };
    setTimeEntries(updatedEntries);
  };

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
            <TableHead>Observações</TableHead>
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
              <TableCell colSpan={12} className="text-center text-muted-foreground h-32">
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
                <TableCell>
                  <Select
                    value={entry.observation || "NONE"}
                    onValueChange={(value: ObservationType) => handleObservationChange(value, index)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">Nenhuma</SelectItem>
                      <SelectItem value="PONTO_FACULTATIVO">Ponto Facultativo</SelectItem>
                      <SelectItem value="ATESTADO">Atestado</SelectItem>
                      <SelectItem value="COMPENSACAO">Compensação</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
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