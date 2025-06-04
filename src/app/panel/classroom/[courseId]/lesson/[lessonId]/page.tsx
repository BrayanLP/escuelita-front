"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  video_url: string;
  resource_url?: string;
  order_number: number;
}

interface Course {
  id: string;
  title: string;
}

export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCourse();
      fetchLessons();
      fetchProgress();
    }
  }, [userId]);

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user?.id) setUserId(data.user.id);
  };

  const fetchCourse = async () => {
    const { data } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();
    setCourse(data);
  };

  const fetchLessons = async () => {
    const { data } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .order("order_number");

    if (data) {
      setLessons(data);
      const found = data.find((l) => l.id === lessonId);
      if (found) setCurrentLesson(found);
    }
  };

  const fetchProgress = async () => {
    const { data } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", userId);

    setCompleted(data?.map((p) => p.lesson_id) || []);
  };

  const markAsDone = async () => {
    await supabase.from("lesson_progress").insert({
      lesson_id: lessonId,
      user_id: userId,
    });
    setCompleted((prev) => [...prev, lessonId as string]);
  };

  const total = lessons.length;
  const done = lessons.filter((l) => completed.includes(l.id)).length;
  const progress = total ? Math.round((done / total) * 100) : 0;
  function convertToEmbed(url) {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }

  if (!currentLesson) return <p className="text-center">Cargando lección...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
      {/* Sidebar izquierdo */}
      <aside className="space-y-4">
        <h2 className="text-lg font-semibold">{course?.title}</h2>
        <Progress value={progress} />
        <div className="space-y-1">
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/panel/classroom/${courseId}/lesson/${lesson.id}`}
              className={`block px-3 py-2 rounded-md text-sm transition ${
                lesson.id === lessonId
                  ? "bg-yellow-100 font-medium"
                  : "hover:bg-muted"
              }`}
            >
              {lesson.title}
            </Link>
          ))}
        </div>
      </aside>

      {/* Contenido derecho */}
      <main className="space-y-4">
        <h1 className="text-xl font-bold">{currentLesson.title}</h1>

        <div className="aspect-video w-full overflow-hidden rounded">
          <iframe
            src={convertToEmbed(currentLesson.video_url)}
            className="w-full h-full"
            allowFullScreen
          />
        </div>

        {currentLesson.resource_url && (
          <div className="text-sm mt-2">
            <p className="font-medium">Recursos</p>
            <a
              href={currentLesson.resource_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Descargar aquí
            </a>
          </div>
        )}

        {completed.includes(currentLesson.id) ? (
          <Button variant="outline" disabled>
            ✅ Lección completada
          </Button>
        ) : (
          <Button onClick={markAsDone}>Marcar como completada</Button>
        )}
      </main>
    </div>
  );
}
