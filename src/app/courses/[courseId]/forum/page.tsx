import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCourseById, getThreadsByCourseId, courses } from '@/lib/placeholder-data';
import type { ForumThread } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, MessageSquare, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { NewThreadForm } from './components/NewThreadForm';

export async function generateStaticParams() {
  return courses.map((course) => ({
    courseId: course.id,
  }));
}

export default async function CourseForumPage({ params }: { params: { courseId: string } }) {
  const course = getCourseById(params.courseId);

  if (!course) {
    notFound();
  }

  const threads = getThreadsByCourseId(params.courseId);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-headline font-bold mb-2">
          Discussion Forum for <Link href={`/courses/${course.id}`} className="text-primary hover:underline">{course.title}</Link>
        </h1>
        <p className="text-muted-foreground">Ask questions, share insights, and connect with other learners.</p>
      </section>

      <NewThreadForm courseId={course.id} />

      <section className="space-y-6">
        <h2 className="text-2xl font-headline font-semibold">Active Threads</h2>
        {threads.length > 0 ? (
          threads.map((thread: ForumThread) => (
            <Card key={thread.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-headline">
                  <Link href={`/courses/${course.id}/forum/${thread.id}`} className="hover:text-primary">
                    {thread.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-xs flex flex-wrap gap-x-3 gap-y-1 items-center">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> By {thread.authorName}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Started {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {thread.postCount} posts</span>
                </CardDescription>
              </CardHeader>
              <CardFooter>
                 <Button variant="link" asChild className="p-0 h-auto text-primary">
                    <Link href={`/courses/${course.id}/forum/${thread.id}`}>
                      View Thread &rarr;
                    </Link>
                  </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No threads yet in this forum. Be the first to start a discussion!</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
