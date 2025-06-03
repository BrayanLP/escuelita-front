'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getThreadById, addPostToThread as addPostToThreadData } from '@/lib/placeholder-data';
import type { ForumPost, ForumThread } from '@/lib/types';
import { ForumPostCard } from '@/app/components/ForumPostCard';
import { CommentForm } from '@/app/components/CommentForm';
import { ThreadSummarizer } from '@/app/components/ThreadSummarizer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// generateStaticParams was removed as it cannot be used with 'use client'

export default function CommunityThreadPage({ params }: { params: { threadId: string } }) {
  const [thread, setThread] = useState<ForumThread | undefined>(undefined);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // In a real app, this would be the authenticated user's ID
  const placeholderUserId = 'user1'; 

  useEffect(() => {
    const fetchedThread = getThreadById(params.threadId);

    if (fetchedThread && !fetchedThread.courseId) { // Ensure it's a community thread
      setThread(fetchedThread);
      setPosts([...fetchedThread.posts]); 
    } else {
      // Handle not found or if it's a course thread accessed via community path
    }
    setIsLoading(false);
  }, [params.threadId]);


  const handlePostSubmit = async (content: string): Promise<boolean> => {
    if (!thread) return false;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPost = addPostToThreadData(thread.id, content, placeholderUserId);
    if (newPost) {
      setPosts(prevPosts => [...prevPosts, newPost]);
      setThread(prevThread => prevThread ? ({...prevThread, postCount: prevThread.postCount + 1, lastActivityAt: new Date().toISOString() }) : undefined);
      return true;
    }
    return false;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-xl text-muted-foreground">Loading discussion...</p>
      </div>
    );
  }

  if (!thread) {
    return (
        <div className="text-center py-10">
            <h1 className="text-2xl font-bold">Discussion Not Found</h1>
            <p className="text-muted-foreground">The requested discussion thread could not be located in the community forum.</p>
            <Button asChild variant="link" className="mt-4">
                <Link href="/community">Back to Community Forum</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" asChild className="mb-4">
        <Link href="/community">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Community Forum
        </Link>
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">{thread.title}</CardTitle>
          <CardDescription>
            A discussion in the community forum. Started by {thread.authorName}.
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
              <p className="text-muted-foreground text-center py-4">No posts in this discussion yet. Be the first to reply!</p>
            )}
          </div>

          <div className="mt-8 pt-6 border-t">
            <h3 className="text-xl font-headline font-semibold mb-3">Join the Discussion</h3>
            {/* Passing an empty courseId as it's not relevant for community threads form submission context */}
            <CommentForm threadId={thread.id} courseId="" onPostSubmit={handlePostSubmit} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
