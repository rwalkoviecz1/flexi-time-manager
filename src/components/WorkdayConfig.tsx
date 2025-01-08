import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { toast } from "sonner"
import { useTimesheet } from "@/contexts/TimesheetContext"

export function WorkdayConfig() {
  const { workdayConfig: savedConfig, setWorkdayConfig } = useTimesheet()
  const [workdayConfig, setLocalWorkdayConfig] = useState(savedConfig)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setWorkdayConfig(workdayConfig)
    localStorage.setItem('workdayConfig', JSON.stringify(workdayConfig))
    toast.success("Configuração salva com sucesso!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração da Jornada</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Horário de Entrada</Label>
              <Input
                id="startTime"
                type="time"
                value={workdayConfig.startTime}
                onChange={(e) => setLocalWorkdayConfig({...workdayConfig, startTime: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Horário de Saída</Label>
              <Input
                id="endTime"
                type="time"
                value={workdayConfig.endTime}
                onChange={(e) => setLocalWorkdayConfig({...workdayConfig, endTime: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="breakStart">Início do Intervalo</Label>
              <Input
                id="breakStart"
                type="time"
                value={workdayConfig.breakStart}
                onChange={(e) => setLocalWorkdayConfig({...workdayConfig, breakStart: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="breakEnd">Fim do Intervalo</Label>
              <Input
                id="breakEnd"
                type="time"
                value={workdayConfig.breakEnd}
                onChange={(e) => setLocalWorkdayConfig({...workdayConfig, breakEnd: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salário Base</Label>
              <Input
                id="salary"
                type="number"
                min="0"
                step="0.01"
                value={workdayConfig.salary}
                onChange={(e) => setLocalWorkdayConfig({...workdayConfig, salary: parseFloat(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workHoursPerDay">Horas por Dia</Label>
              <Input
                id="workHoursPerDay"
                type="number"
                min="1"
                max="24"
                value={workdayConfig.workHoursPerDay}
                onChange={(e) => setLocalWorkdayConfig({...workdayConfig, workHoursPerDay: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="periodStart">Início do Período</Label>
              <Input
                id="periodStart"
                type="date"
                value={workdayConfig.periodStart}
                onChange={(e) => setLocalWorkdayConfig({...workdayConfig, periodStart: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="periodEnd">Fim do Período</Label>
              <Input
                id="periodEnd"
                type="date"
                value={workdayConfig.periodEnd}
                onChange={(e) => setLocalWorkdayConfig({...workdayConfig, periodEnd: e.target.value})}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">Salvar Configuração</Button>
        </form>
      </CardContent>
    </Card>
  )
}