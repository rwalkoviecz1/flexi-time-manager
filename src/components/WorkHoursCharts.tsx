import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { name: '01/03', horasNormais: 8, horas50: 2, horas100: 1 },
  { name: '02/03', horasNormais: 8, horas50: 1, horas100: 0 },
  { name: '03/03', horasNormais: 8, horas50: 3, horas100: 2 },
  { name: '04/03', horasNormais: 8, horas50: 2, horas100: 1 },
  { name: '05/03', horasNormais: 8, horas50: 1, horas100: 0 },
]

export function WorkHoursCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>A Receber</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="horas50" name="Horas 50%" stroke="#8B5CF6" />
              <Line type="monotone" dataKey="horas100" name="Horas 100%" stroke="#1EAEDB" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>A Descontar</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="horas50" name="Horas 50%" stroke="#F97316" />
              <Line type="monotone" dataKey="horas100" name="Horas 100%" stroke="#EF4444" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Horas Trabalhadas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="horasNormais" name="Horas Normais" stroke="#9b87f5" />
              <Line type="monotone" dataKey="horas50" name="Horas 50%" stroke="#7E69AB" />
              <Line type="monotone" dataKey="horas100" name="Horas 100%" stroke="#D6BCFA" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}