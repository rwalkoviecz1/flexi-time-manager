import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Horas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">176h</div>
          <p className="text-xs text-muted-foreground">
            Mês atual
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Horas Extras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8h</div>
          <p className="text-xs text-muted-foreground">
            +2h essa semana
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Banco de Horas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+12h</div>
          <p className="text-xs text-muted-foreground">
            Saldo atual
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Faltas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1</div>
          <p className="text-xs text-muted-foreground">
            Mês atual
          </p>
        </CardContent>
      </Card>
    </div>
  )
}