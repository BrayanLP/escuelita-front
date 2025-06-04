"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSupabase } from "@/context/SupabaseContext";
import {
  getThreadById,
  addPostToThread as addPostToThreadData,
} from "@/lib/placeholder-data";
import type { ForumPost, ForumThread } from "@/lib/types";
import { ForumPostCard } from "@/app/components/ForumPostCard";
import { CommentForm } from "@/app/components/CommentForm";
import { ThreadSummarizer } from "@/app/components/ThreadSummarizer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// generateStaticParams was removed as it cannot be used with 'use client'

export default function CommunityThreadPage({
  params,
}: {
  params: { threadId: string };
}) {
  const [thread, setThread] = useState<ForumThread | undefined>(undefined);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { supabase } = useSupabase();

  useEffect(() => {
    async function fetchThreadAndPosts() {
      setIsLoading(true);
      /*
      setIsLoadingThread(true);
      setIsLoadingPosts(true);
      setError(null);

      const { data: threadData, error: threadError } = await supabase
        .from('community_threads')
        .select('*')
        .eq('id', params.threadId)
        .single();

      if (threadError) {
        setError('Error fetching thread: ' + threadError.message);
        setIsLoadingThread(false);
        setIsLoadingPosts(false);
        return;
        */

      // Fetch thread with author info
      const { data: threadData, error: threadError } = await supabase
        .from("community_threads")
        .select("*, author:users(name, avatar_url)") // Join with users table, alias users as author
        .eq("id", params.threadId)
        .single();

      if (threadError || !threadData) {
        setError(
          "Error fetching thread: " +
            (threadError?.message || "Thread not found")
        );
        setIsLoading(false);
        return;
      }

      // Fetch comments with author info
      const { data: postsData, error: postsError } = await supabase
        .from("community_comments") // Assuming community_comments for comments
        .select("*, author:users(name, avatar_url)") // Join with users table, alias users as author
        .eq("thread_id", params.threadId)
        .order("created_at", { ascending: true });

      if (postsError) {
        setError("Error fetching posts: " + postsError.message);
      } else {
        setPosts((postsData as any) || []); // Adjust type if needed
        // Map data to ForumPost structure
        const mappedPosts: ForumPost[] = (postsData || []).map((post: any) => ({
          id: post.id,
          threadId: post.thread_id,
          userId: post.author_id, // Assuming community_comments has author_id
          userName: post.author?.name || "Unknown User",
          userAvatarUrl: post.author?.avatar_url || "/placeholder-avatar.png", // Provide a default avatar
          createdAt: post.created_at,
          content: post.content,
        }));
        setPosts(mappedPosts);
      }

      // Map thread data to ForumThread structure
      const mappedThread: ForumThread = {
        id: threadData.id,
        title: threadData.title,
        authorId: threadData.author_id, // Assuming community_threads has author_id
        authorName: threadData.author?.name || "Unknown User",
        createdAt: threadData.created_at,
      };
      setThread(mappedThread);
      setIsLoading(false);
    }
    fetchThreadAndPosts();
  }, [params.threadId, supabase]);
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
        <p className="text-muted-foreground">
          The requested discussion thread could not be located in the community
          forum.
        </p>
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
          <CardTitle className="text-3xl font-headline text-primary">
            {thread.title}
          </CardTitle>
          <CardDescription>
            A discussion in the community forum. Started by{" "}
            {thread.authorName || "Unknown User"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {posts.length > 0 && (
            <ThreadSummarizer threadTitle={thread.title} posts={posts} />
          )}{" "}
          {/* Note: ThreadSummarizer might also need adjustment to work with new post structure */}
          <div className="mt-4 space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => <ForumPostCard key={post.id} post={post} />)
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No posts in this discussion yet. Be the first to reply!
              </p>
            )}
          </div>
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-xl font-headline font-semibold mb-3">
              Join the Discussion
            </h3>
            {/* Note: CommentForm submission logic needs to be updated to use Supabase */}
            <CommentForm
              threadId={thread.id}
              courseId=""
              onPostSubmit={handlePostSubmit}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
