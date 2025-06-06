"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Lesson {
  id: string;
  title: string;
  video_url: string;
  course_id: string;
  order_number: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  photo_url: string;
}

export default function ClassroomPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessonsByCourse, setLessonsByCourse] = useState<
    Record<string, Lesson[]>
  >({});
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    loadCourses();
    loadProgress();
  }, []);

  const loadCourses = async () => {
    const { data: coursesData } = await supabase.from("courses").select("*");

    console.log("coursesData", coursesData);
    if (coursesData) {
      setCourses(coursesData);

      for (const course of coursesData) {
        const { data: lessonsData } = await supabase
          .from("lessons")
          .select("*")
          .eq("course_id", course.id)
          .order("order_number");

        setLessonsByCourse((prev) => ({
          ...prev,
          [course.id]: lessonsData || [],
        }));
      }
    }
  };

  const loadProgress = async () => {
    const { data: user } = await supabase.auth.getUser();
    const { data: progressData } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user?.user?.id);

    setCompleted(progressData?.map((p) => p.lesson_id) || []);
  };

  return (
    <div className="space-y-6 grid grid-cols-3 py-3 px-3">
      {courses.map((course) => {
        const lessons = lessonsByCourse[course.id] || [];
        const total = lessons.length;
        const done = lessons.filter((l) => completed.includes(l.id)).length;
        const progress = total > 0 ? Math.round((done / total) * 100) : 0;

        return (
          <Card key={course.id}>
            <CardContent className="p-4 space-y-4">
              <img width={"100%"} height={300} src={course.photo_url} />
              <div className="flex justify-between items-center">
                <Link href={`classroom/${course.id}`} className="mt-3">
                  <h2 className="text-xl font-bold">{course.title}</h2>
                </Link>
                <span className="text-sm text-muted-foreground">
                  {done}/{total} completadas
                </span>
              </div>
              <p className="text-muted-foreground">{course.description}</p>
              <Progress value={progress} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
