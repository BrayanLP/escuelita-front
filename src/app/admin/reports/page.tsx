"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  FileText,
  CreditCard,
  Download,
  Calendar,
  DollarSign,
} from "lucide-react";

interface ReportData {
  totalUsers: number;
  totalCommunities: number;
  totalPosts: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  pendingSubscriptions: number;
  monthlyGrowth: {
    users: number;
    communities: number;
    posts: number;
    subscriptions: number;
  };
  topCommunities: Array<{
    name: string;
    members_count: number;
    subscription_count: number;
  }>;
  recentActivity: Array<{
    type: string;
    count: number;
    date: string;
  }>;
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30");

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Calcular fecha de inicio basada en el rango seleccionado
      const daysAgo = parseInt(dateRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const [
        { count: totalUsers },
        { count: totalCommunities },
        { count: totalPosts },
        { count: totalSubscriptions },
        { count: activeSubscriptions },
        { count: pendingSubscriptions },
        { data: communities },
        { count: recentUsers },
        { count: recentCommunities },
        { count: recentPosts },
        { count: recentSubscriptions },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase
          .from("communities")
          .select("*", { count: "exact", head: true }),
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase
          .from("community_subscriptions")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("community_subscriptions")
          .select("*", { count: "exact", head: true })
          .eq("status", "active"),
        supabase
          .from("community_subscriptions")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("communities")
          .select("name, members_count")
          .order("members_count", { ascending: false })
          .limit(5),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startDate.toISOString()),
        supabase
          .from("communities")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startDate.toISOString()),
        supabase
          .from("posts")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startDate.toISOString()),
        supabase
          .from("community_subscriptions")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startDate.toISOString()),
      ]);

      // Calcular crecimiento mensual (simulado para demo)
      const monthlyGrowth = {
        users: Math.round(
          ((recentUsers || 0) / Math.max(totalUsers || 1, 1)) * 100
        ),
        communities: Math.round(
          ((recentCommunities || 0) / Math.max(totalCommunities || 1, 1)) * 100
        ),
        posts: Math.round(
          ((recentPosts || 0) / Math.max(totalPosts || 1, 1)) * 100
        ),
        subscriptions: Math.round(
          ((recentSubscriptions || 0) / Math.max(totalSubscriptions || 1, 1)) *
            100
        ),
      };

      // Obtener conteo de suscripciones por comunidad
      const { data: subscriptionCounts } = await supabase
        .from("community_subscriptions")
        .select("community_id")
        .eq("status", "active");

      const subscriptionCountMap =
        subscriptionCounts?.reduce((acc, sub) => {
          acc[sub.community_id] = (acc[sub.community_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

      const topCommunities = (communities || []).map((community) => ({
        name: community.name || "Sin nombre",
        members_count: community.members_count || 0,
        subscription_count: subscriptionCountMap[community.id] || 0,
      }));

      setReportData({
        totalUsers: totalUsers || 0,
        totalCommunities: totalCommunities || 0,
        totalPosts: totalPosts || 0,
        totalSubscriptions: totalSubscriptions || 0,
        activeSubscriptions: activeSubscriptions || 0,
        pendingSubscriptions: pendingSubscriptions || 0,
        monthlyGrowth,
        topCommunities,
        recentActivity: [
          {
            type: "Nuevos usuarios",
            count: recentUsers || 0,
            date: `Últimos ${daysAgo} días`,
          },
          {
            type: "Nuevas comunidades",
            count: recentCommunities || 0,
            date: `Últimos ${daysAgo} días`,
          },
          {
            type: "Nuevos posts",
            count: recentPosts || 0,
            date: `Últimos ${daysAgo} días`,
          },
          {
            type: "Nuevas suscripciones",
            count: recentSubscriptions || 0,
            date: `Últimos ${daysAgo} días`,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast.error("Error al cargar los datos del reporte");
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!reportData) return;

    const csvContent = `
Reporte de Plataforma - ${new Date().toLocaleDateString("es-ES")}

Métricas Generales:
Total Usuarios,${reportData.totalUsers}
Total Comunidades,${reportData.totalCommunities}
Total Posts,${reportData.totalPosts}
Total Suscripciones,${reportData.totalSubscriptions}
Suscripciones Activas,${reportData.activeSubscriptions}
Suscripciones Pendientes,${reportData.pendingSubscriptions}

Crecimiento (${dateRange} días):
Usuarios,${reportData.monthlyGrowth.users}%
Comunidades,${reportData.monthlyGrowth.communities}%
Posts,${reportData.monthlyGrowth.posts}%
Suscripciones,${reportData.monthlyGrowth.subscriptions}%

Top Comunidades:
${reportData.topCommunities
  .map(
    (c) =>
      `${c.name},${c.members_count} miembros,${c.subscription_count} suscripciones`
  )
  .join("\n")}
    `.trim();

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-plataforma-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Reporte exportado exitosamente");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reportes</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </CardHeader>
              <CardContent className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!reportData) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Reportes
          </h1>
          <p className="text-gray-600">Análisis y métricas de la plataforma</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 días</SelectItem>
              <SelectItem value="30">Últimos 30 días</SelectItem>
              <SelectItem value="90">Últimos 90 días</SelectItem>
              <SelectItem value="365">Último año</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Usuarios
            </CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.totalUsers.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />+
              {reportData.monthlyGrowth.users}% este período
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Comunidades
            </CardTitle>
            <Building2 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.totalCommunities.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />+
              {reportData.monthlyGrowth.communities}% este período
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Posts
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.totalPosts.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />+
              {reportData.monthlyGrowth.posts}% este período
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Suscripciones Activas
            </CardTitle>
            <CreditCard className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.activeSubscriptions.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />+
              {reportData.monthlyGrowth.subscriptions}% este período
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado de Suscripciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Estado de Suscripciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Activas</span>
                <div className="flex items-center gap-2">
                  <Badge variant="default">
                    {reportData.activeSubscriptions}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {Math.round(
                      (reportData.activeSubscriptions /
                        Math.max(reportData.totalSubscriptions, 1)) *
                        100
                    )}
                    %
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pendientes</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {reportData.pendingSubscriptions}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {Math.round(
                      (reportData.pendingSubscriptions /
                        Math.max(reportData.totalSubscriptions, 1)) *
                        100
                    )}
                    %
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {reportData.totalSubscriptions}
                  </Badge>
                  <span className="text-sm text-gray-500">100%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Top Comunidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.topCommunities.map((community, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{community.name}</p>
                    <p className="text-xs text-gray-500">
                      {community.members_count} miembros
                    </p>
                  </div>
                  <Badge variant="outline">
                    {community.subscription_count} suscripciones
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Actividad Reciente ({dateRange} días)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportData.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <div className="text-2xl font-bold text-blue-600">
                  {activity.count}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {activity.type}
                </div>
                <div className="text-xs text-gray-500">{activity.date}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
