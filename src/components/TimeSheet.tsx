import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TimeSheetTable } from "./TimeSheetTable"
import { TimeSheetActions } from "./TimeSheetActions"

export function TimeSheet() {
  return (
    <Card className="col-span-2 row-span-2 h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Registros de Ponto</CardTitle>
        <TimeSheetActions />
      </CardHeader>
      <CardContent className="h-[calc(100vh-16rem)] overflow-y-auto">
        <TimeSheetTable />
      </CardContent>
    </Card>
  )
}