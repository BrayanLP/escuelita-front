
'use client';

import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Course, Lesson } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Download, PlayCircle, ListVideo, ChevronLeft, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useSupabase } from '@/contexts/SupabaseContext';

// generateStaticParams was removed as it cannot be used with 'use client'

export default function CourseViewerPage() {
  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { courseId } = useParams();
  const supabase = useSupabase();

  useEffect(() => {
    async function fetchCourse() {
      if (!courseId || typeof courseId !== 'string') {
        setError("Invalid course ID");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('courses')
        .select('*, lessons(*)') // Assuming lessons are related and fetched with the course
        .eq('id', courseId)
        .single();

      if (error) {
        setError(error.message);
      } else if (data) {
        setCourse(data as Course); // Type assertion assuming Supabase data matches Course type
        if (data.lessons && data.lessons.length > 0) {
          setSelectedLesson(data.lessons[0] as Lesson); // Type assertion
        }
      } else {
        // No course found with that ID
        notFound();
      }
      setLoading(false);
    }

    if (supabase) {
 fetchCourse();
    }
  }, [courseId, supabase]);

  // Placeholder for progress - in a real app, this would come from user data
  const progressPercentage = (() => {
    if (!course || course.lessons.length === 0) return 0;
    // This is a mock progress. In a real app, track actual completed lessons.
    // For demo, let's assume progress is based on the index of the selected lesson.
    const currentIndex = selectedLesson ? course.lessons.findIndex(l => l.id === selectedLesson.id) : -1;
    if (currentIndex === -1 && course.lessons.length > 0) return (1 / course.lessons.length) * 100; // if no lesson selected, show progress for first
    if (currentIndex !== -1) return ((currentIndex +1) / course.lessons.length) * 100;
    return 0;

  })();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]">
        <p className="text-xl text-muted-foreground">Loading course...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]">
        <p className="text-xl text-destructive">Error loading course: {error}</p>
      </div>
    );
  }

  if (!course) {
    notFound();
    return null; // Satisfy TypeScript, notFound() will throw
  }

  return (
    <div className="flex flex-col md:flex-row gap-0 md:gap-6 lg:gap-8 min-h-[calc(100vh-10rem)]">
      {/* Left Sidebar - Lessons List */}
      <aside className="w-full md:w-80 lg:w-96 bg-card md:rounded-lg md:shadow-sm border-b md:border flex flex-col">
        <CardHeader className="p-4 border-b">
          <Button variant="ghost" size="sm" className="mb-2 self-start px-2 text-muted-foreground hover:text-primary" asChild>
            <Link href="/">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Courses
            </Link>
          </Button>
          <div className="flex items-center gap-2 mb-2">
            <ListVideo className="w-6 h-6 text-primary" />
            <CardTitle className="text-xl font-headline truncate" title={course.title}>
              {course.title}
            </CardTitle>
          </div>
          <Progress value={progressPercentage} className="w-full h-2" />
          <p className="text-xs text-muted-foreground mt-1">{Math.round(progressPercentage)}% complete</p>
        </CardHeader>
        <ScrollArea className="flex-grow">
          <nav className="p-2">
            <ul className="space-y-1">
              {course.lessons.map((lesson, index) => (
                <li key={lesson.id}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-auto py-2.5 px-3 text-sm text-left font-normal",
                      selectedLesson?.id === lesson.id 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "hover:bg-muted/80 text-card-foreground/80 hover:text-card-foreground"
                    )}
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    <PlayCircle className={cn("w-4 h-4 mr-2.5 shrink-0", selectedLesson?.id === lesson.id ? "text-primary" : "text-muted-foreground/70")} />
                    <span className="truncate flex-grow">{index + 1}. {lesson.title}</span>
                    <span className="text-xs text-muted-foreground/60 ml-2 shrink-0">{lesson.duration}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>
        <div className="p-4 border-t mt-auto">
           <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href={`/courses/${course.id}/forum`}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Go to Course Forum
              </Link>
          </Button>
        </div>
      </aside>

      {/* Right Content Area - Selected Lesson */}
      <main className="flex-1 py-6 md:py-0">
        {selectedLesson ? (
          <Card className="h-full flex flex-col shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="p-4 md:p-6 border-b">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <CardTitle className="text-2xl font-headline text-primary">
                  {selectedLesson.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-grow flex flex-col">
              <div className="aspect-video bg-slate-900 relative group">
                <Image
                  src={selectedLesson.videoPlaceholderImageUrl || "https://placehold.co/1280x720.png"}
                  alt={`Video placeholder for ${selectedLesson.title}`}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={selectedLesson.videoImageHint || "tutorial video screen"}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-20 h-20 text-white/80" />
                </div>
              </div>
              
              {selectedLesson.resources && selectedLesson.resources.length > 0 && (
                <div className="p-4 md:p-6 border-t">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Download className="w-5 h-5 text-accent" />
                    Resources
                  </h3>
                  <ul className="space-y-2">
                    {selectedLesson.resources.map(resource => (
                      <li key={resource.id}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary hover:underline hover:text-primary/80 transition-colors p-1 rounded-md hover:bg-primary/5"
                        >
                          <Download className="w-4 h-4" />
                          {resource.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex-grow p-4 md:p-6">
                {/* Placeholder for lesson text content or description if any */}
                <p className="text-muted-foreground text-sm">
                  {/* Example: selectedLesson.description || `Content for ${selectedLesson.title} will appear here.`*/}
                  Further details or transcript for "{selectedLesson.title}" would be displayed in this area.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Card className="p-10 text-center">
                <ListVideo className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-lg">Select a lesson to begin.</p>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
