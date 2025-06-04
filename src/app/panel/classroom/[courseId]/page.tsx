"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  description: string;
}

interface Lesson {
  id: string;
  title: string;
  order_number: number;
}

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (userId) {
      loadCourse();
      loadLessons();
      loadProgress();
    }
  }, [userId]);

  const loadUser = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (user?.user?.id) setUserId(user.user.id);
  };

  const loadCourse = async () => {
    const { data } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (data) setCourse(data);
  };

  const loadLessons = async () => {
    const { data } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .order("order_number");

    if (data) setLessons(data);
  };

  const loadProgress = async () => {
    const { data } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", userId);

    if (data) setCompleted(data.map((l) => l.lesson_id));
  };

  const total = lessons.length;
  const done = lessons.filter((l) => completed.includes(l.id)).length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  if (!course) return <p className="text-center">Cargando curso...</p>;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 space-y-2">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground">
            {done}/{total} completadas ({progress}%)
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {lessons.map((lesson) => (
          <Card key={lesson.id}>
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div>
                <h3 className="font-semibold text-base">{lesson.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {completed.includes(lesson.id)
                    ? "✅ Completada"
                    : "No completada"}
                </p>
              </div>
              <Link
                href={`/panel/classroom/${courseId}/lesson/${lesson.id}`}
                className="mt-3"
              >
                <Button size="sm" className="w-full" variant="outline">
                  Ver lección
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
