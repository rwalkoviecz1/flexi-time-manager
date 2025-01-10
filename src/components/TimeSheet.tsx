import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TimeSheetTable } from "./TimeSheetTable"
import { TimeSheetActions } from "./TimeSheetActions"

export function TimeSheet() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Registros de Ponto</CardTitle>
        <TimeSheetActions />
      </CardHeader>
      <CardContent className="h-[calc(100vh-32rem)] overflow-y-auto">
        <TimeSheetTable />
      </CardContent>
    </Card>
  )
}