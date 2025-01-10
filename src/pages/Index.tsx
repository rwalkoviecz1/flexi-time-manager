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
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <WorkdayConfig />
        </div>
        <div className="lg:col-span-3">
          <Dashboard />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TimeSheet />
        <div className="lg:col-span-2">
          <WorkHoursCharts />
        </div>
      </div>
    </div>
  )
}

export default Index