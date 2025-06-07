import { DashboardStatsCards } from '@/components/admin/dashboard-stats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Users, TrendingUp, DollarSign } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bienvenido al panel de administración</p>
      </div>

      <DashboardStatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nueva comunidad creada</p>
                  <p className="text-xs text-gray-500">hace 2 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Usuario registrado</p>
                  <p className="text-xs text-gray-500">hace 4 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nuevo post publicado</p>
                  <p className="text-xs text-gray-500">hace 6 horas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Métricas de Crecimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Nuevos usuarios</span>
                <span className="text-sm font-medium text-green-600">+24%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Posts creados</span>
                <span className="text-sm font-medium text-green-600">+18%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Suscripciones</span>
                <span className="text-sm font-medium text-green-600">+32%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ingresos</span>
                <span className="text-sm font-medium text-green-600">+28%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}