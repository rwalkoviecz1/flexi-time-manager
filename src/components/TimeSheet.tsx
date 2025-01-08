import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TimeSheetTable } from "./TimeSheetTable"
import { TimeSheetActions } from "./TimeSheetActions"

export function TimeSheet() {
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Registros de Ponto</CardTitle>
        <TimeSheetActions />
      </CardHeader>
      <CardContent>
        <TimeSheetTable />
      </CardContent>
    </Card>
  )
}