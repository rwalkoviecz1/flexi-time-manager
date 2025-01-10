import { Dashboard } from "@/components/Dashboard"
import { TimeSheet } from "@/components/TimeSheet"
import { WorkdayConfig } from "@/components/WorkdayConfig"
import { WorkHoursCharts } from "@/components/WorkHoursCharts"

const Index = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Sistema de Gestão de Jornada</h1>
        <p className="text-muted-foreground">
          Gerencie sua jornada de trabalho, horas extras e banco de horas
        </p>
      </div>
      
      <Dashboard />
      
      <div className="grid grid-cols-3 gap-8">
        <WorkdayConfig />
        <TimeSheet />
      </div>

      <WorkHoursCharts />
    </div>
  )
}

export default Index