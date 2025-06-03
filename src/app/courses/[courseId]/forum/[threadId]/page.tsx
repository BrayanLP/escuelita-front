'use client'; // This page needs to be a client component to handle form submissions and state for new posts

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCourseById, getThreadById, addPostToThread as addPostToThreadData, courses as allCourses, forumThreads as allThreads } from '@/lib/placeholder-data';
import type { ForumPost, ForumThread } from '@/lib/types';
import { ForumPostCard } from '@/app/components/ForumPostCard';
import { CommentForm } from '@/app/components/CommentForm';
import { ThreadSummarizer } from './components/ThreadSummarizer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// This is a workaround because generateStaticParams cannot be used in client components.
// For a real app with a database, you'd fetch data in a server component and pass to client, or use client-side fetching.
// For this mock data setup, we'll fetch initial data within useEffect.

export default function ForumThreadPage({ params }: { params: { courseId: string; threadId: string } }) {
  const [course, setCourse] = useState<ReturnType<typeof getCourseById>>(undefined);
  const [thread, setThread] = useState<ForumThread | undefined>(undefined);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // In a real app, this would be the authenticated user's ID
  const placeholderUserId = 'user1'; 

  useEffect(() => {
    const fetchedCourse = getCourseById(params.courseId);
    const fetchedThread = getThreadById(params.threadId);

    if (fetchedCourse && fetchedThread && fetchedThread.courseId === fetchedCourse.id) {
      setCourse(fetchedCourse);
      setThread(fetchedThread);
      setPosts([...fetchedThread.posts]); // Create a mutable copy for updates
    } else {
      // Handle not found case after attempting to fetch
      // This will only work if router is available, otherwise notFound() must be called server-side
      // For simplicity in this mock, we rely on the initial check before rendering.
    }
    setIsLoading(false);
  }, [params.courseId, params.threadId]);


  const handlePostSubmit = async (content: string): Promise<boolean> => {
    if (!thread) return false;
    // Simulate API call for adding a post
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPost = addPostToThreadData(thread.id, content, placeholderUserId);
    if (newPost) {
      setPosts(prevPosts => [...prevPosts, newPost]);
      // Update thread's last activity and post count if needed (mock data function handles this)
      // In a real app, you might re-fetch the thread or update locally more robustly
      setThread(prevThread => prevThread ? ({...prevThread, postCount: prevThread.postCount + 1, lastActivityAt: new Date().toISOString() }) : undefined);
      return true;
    }
    return false;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-xl text-muted-foreground">Loading thread...</p>
      </div>
    );
  }

  if (!course || !thread) {
    // This notFound() call might not work as expected in a client component after initial render.
    // Ideally, routing to a 404 page or showing an inline "not found" message would be better.
    // For this example, we'll assume data is fetched correctly or not at all.
    // router.push('/404'); // Or a custom 404 page
    return (
        <div className="text-center py-10">
            <h1 className="text-2xl font-bold">Thread Not Found</h1>
            <p className="text-muted-foreground">The requested discussion thread could not be located.</p>
            <Button asChild variant="link" className="mt-4">
                <Link href={`/courses/${params.courseId}/forum`}>Back to Forum</Link>
            </Button>
        </div>
    );
  }


  return (
    <div className="space-y-6">
      <Button variant="outline" asChild className="mb-4">
        <Link href={`/courses/${course.id}/forum`}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forum: {course.title}
        </Link>
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">{thread.title}</CardTitle>
          <CardDescription>
            A discussion in the <Link href={`/courses/${course.id}`} className="text-accent hover:underline">{course.title}</Link> course.
            Started by {thread.authorName}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {posts.length > 0 && (
            <ThreadSummarizer threadTitle={thread.title} posts={posts} />
          )}
          
          <div className="mt-4 space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <ForumPostCard key={post.id} post={post} />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No posts in this thread yet. Be the first to reply!</p>
            )}
          </div>

          <div className="mt-8 pt-6 border-t">
            <h3 className="text-xl font-headline font-semibold mb-3">Join the Discussion</h3>
            <CommentForm threadId={thread.id} courseId={course.id} onPostSubmit={handlePostSubmit} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper to ensure generateStaticParams works. This would typically be for server components.
// For a client component, this part is more illustrative of how paths would be generated.
export async function generateStaticParams() {
  const paths: { courseId: string; threadId: string }[] = [];
  allCourses.forEach(course => {
    const courseThreads = allThreads.filter(t => t.courseId === course.id);
    courseThreads.forEach(thread => {
      paths.push({ courseId: course.id, threadId: thread.id });
    });
  });
  return paths;
}
