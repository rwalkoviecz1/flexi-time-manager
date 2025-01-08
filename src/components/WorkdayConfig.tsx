import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { toast } from "sonner"

export interface WorkdayConfigData {
  startTime: string
  endTime: string
  breakStart: string
  breakEnd: string
  workDays: string[]
  salary: number
  workHoursPerDay: number
}

export function WorkdayConfig() {
  const [workdayConfig, setWorkdayConfig] = useState<WorkdayConfigData>({
    startTime: "08:00",
    endTime: "17:00",
    breakStart: "12:00",
    breakEnd: "13:00",
    workDays: ["SEG", "TER", "QUA", "QUI", "SEX"],
    salary: 0,
    workHoursPerDay: 8
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
                onChange={(e) => setWorkdayConfig({...workdayConfig, startTime: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Horário de Saída</Label>
              <Input
                id="endTime"
                type="time"
                value={workdayConfig.endTime}
                onChange={(e) => setWorkdayConfig({...workdayConfig, endTime: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="breakStart">Início do Intervalo</Label>
              <Input
                id="breakStart"
                type="time"
                value={workdayConfig.breakStart}
                onChange={(e) => setWorkdayConfig({...workdayConfig, breakStart: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="breakEnd">Fim do Intervalo</Label>
              <Input
                id="breakEnd"
                type="time"
                value={workdayConfig.breakEnd}
                onChange={(e) => setWorkdayConfig({...workdayConfig, breakEnd: e.target.value})}
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
                onChange={(e) => setWorkdayConfig({...workdayConfig, salary: parseFloat(e.target.value)})}
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
                onChange={(e) => setWorkdayConfig({...workdayConfig, workHoursPerDay: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">Salvar Configuração</Button>
        </form>
      </CardContent>
    </Card>
  )
}