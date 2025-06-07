"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { DashboardStats } from "@/lib/types";
import {
  Users,
  Building2,
  FileText,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

export function DashboardStatsCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: totalCommunities },
          { count: totalUsers },
          { count: totalPosts },
          { count: totalCourses },
          { count: totalSubscriptions },
        ] = await Promise.all([
          supabase
            .from("communities")
            .select("*", { count: "exact", head: true }),
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("posts").select("*", { count: "exact", head: true }),
          supabase.from("courses").select("*", { count: "exact", head: true }),
          supabase
            .from("community_subscriptions")
            .select("*", { count: "exact", head: true }),
        ]);

        setStats({
          totalCommunities: totalCommunities || 0,
          totalUsers: totalUsers || 0,
          totalPosts: totalPosts || 0,
          totalCourses: totalCourses || 0,
          totalSubscriptions: totalSubscriptions || 0,
          recentGrowth: {
            communities: 12,
            users: 24,
            posts: 18,
          },
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-gray-200 rounded w-16 animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: "Total Comunidades",
      value: stats.totalCommunities,
      icon: Building2,
      change: `+${stats.recentGrowth.communities}%`,
      changeType: "positive" as const,
    },
    {
      title: "Total Usuarios",
      value: stats.totalUsers,
      icon: Users,
      change: `+${stats.recentGrowth.users}%`,
      changeType: "positive" as const,
    },
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: FileText,
      change: `+${stats.recentGrowth.posts}%`,
      changeType: "positive" as const,
    },
    {
      title: "Total Cursos",
      value: stats.totalCourses,
      icon: GraduationCap,
      change: "+8%",
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {card.value.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {card.change} del mes pasado
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
