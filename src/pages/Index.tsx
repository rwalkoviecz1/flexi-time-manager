import { Dashboard } from "@/components/Dashboard"
import { TimeSheet } from "@/components/TimeSheet"
import { WorkdayConfig } from "@/components/WorkdayConfig"

const Index = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Sistema de Gestão de Jornada</h1>
      
      <Dashboard />
      
      <div className="grid gap-8 md:grid-cols-2">
        <WorkdayConfig />
        <TimeSheet />
      </div>
    </div>
  )
}

export default Index