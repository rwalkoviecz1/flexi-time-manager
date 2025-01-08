import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useState } from "react"
import { Button } from "./ui/button"
import { Eye, EyeOff } from "lucide-react"

const data = [
  { name: '01/03', horasNormais: 8, horas50: 2, horas100: 1 },
  { name: '02/03', horasNormais: 8, horas50: 1, horas100: 0 },
  { name: '03/03', horasNormais: 8, horas50: 3, horas100: 2 },
  { name: '04/03', horasNormais: 8, horas50: 2, horas100: 1 },
  { name: '05/03', horasNormais: 8, horas50: 1, horas100: 0 },
]

interface LineConfig {
  key: 'horasNormais' | 'horas50' | 'horas100';
  name: string;
  color: string;
  visible: boolean;
}

export function WorkHoursCharts() {
  const [lines, setLines] = useState<LineConfig[]>([
    { key: 'horasNormais', name: 'Horas Normais', color: '#9b87f5', visible: true },
    { key: 'horas50', name: 'Horas 50%', color: '#8B5CF6', visible: true },
    { key: 'horas100', name: 'Horas 100%', color: '#1EAEDB', visible: true }
  ])

  const toggleLine = (index: number) => {
    setLines(prevLines => 
      prevLines.map((line, i) => 
        i === index ? { ...line, visible: !line.visible } : line
      )
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>A Receber</CardTitle>
          <div className="flex gap-2">
            {lines.map((line, index) => (
              <Button
                key={line.key}
                variant="outline"
                size="sm"
                onClick={() => toggleLine(index)}
                className="flex items-center gap-2"
              >
                {line.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {line.name}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {lines.map(line => 
                line.visible && (
                  <Line
                    key={line.key}
                    type="monotone"
                    dataKey={line.key}
                    name={line.name}
                    stroke={line.color}
                  />
                )
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>A Descontar</CardTitle>
          <div className="flex gap-2">
            {lines.map((line, index) => (
              <Button
                key={line.key}
                variant="outline"
                size="sm"
                onClick={() => toggleLine(index)}
                className="flex items-center gap-2"
              >
                {line.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {line.name}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {lines.map(line => 
                line.visible && (
                  <Line
                    key={line.key}
                    type="monotone"
                    dataKey={line.key}
                    name={line.name}
                    stroke={line.color}
                  />
                )
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Horas Trabalhadas</CardTitle>
          <div className="flex gap-2">
            {lines.map((line, index) => (
              <Button
                key={line.key}
                variant="outline"
                size="sm"
                onClick={() => toggleLine(index)}
                className="flex items-center gap-2"
              >
                {line.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {line.name}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {lines.map(line => 
                line.visible && (
                  <Line
                    key={line.key}
                    type="monotone"
                    dataKey={line.key}
                    name={line.name}
                    stroke={line.color}
                  />
                )
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}