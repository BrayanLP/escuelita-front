"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp, MessageCircle, Pin } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { NewCommentBox } from "./new-comment-box";
import { usePostComments } from "@/hooks/use-post-comments";
import { usePostStats } from "@/hooks/use-post-stats";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    user_name: string;
    user_avatar_url: string;
    created_at: string;
    pinned?: boolean;
    likes: number;
    comments: number;
    reactions?: string[];
  };
}

export function PostCard({ post }: PostCardProps) {
  const [open, setOpen] = useState(false);
  console.log("post ==>", post);
  const { comments, hasMore, loadMoreComments } = usePostComments(post.id);
  const { likes, comments: totalComments } = usePostStats(post.id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="p-4 hover:shadow-md transition cursor-pointer border border-yellow-100">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post?.profiles?.avatar_url} />
                <AvatarFallback>
                  {post?.profiles?.full_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-semibold leading-none">
                  {post?.profiles?.full_name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            {post.pinned && (
              <div className="text-yellow-500 flex items-center gap-1 text-xs">
                <Pin className="w-4 h-4" /> Pinned
              </div>
            )}
          </div>

          <div className="mt-2">
            <h3 className="font-semibold">{post.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {post.content}
            </p>
          </div>

          <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
            <div className="flex gap-4 items-center">
              <PostActions likes={likes} comments={totalComments} />
            </div>

            <div className="flex -space-x-2">
              {post.reactions?.slice(0, 5).map((url, idx) => (
                <Avatar key={idx} className="h-6 w-6 border-2 border-white">
                  <AvatarImage src={url} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-6 space-y-6">
        <PostHeader author={post?.profiles} date={post.created_at} />
        <PostBody title={post.title} content={post.content} />
        <PostActions likes={likes || 0} comments={totalComments || 0} />

        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentThread key={comment.id} comment={comment} />
          ))}

          {hasMore && (
            <button
              onClick={loadMoreComments}
              className="text-sm text-muted-foreground underline"
            >
              View more replies
            </button>
          )}
        </div>
        <NewCommentBox postId={post.id} />
      </DialogContent>
    </Dialog>
  );
}

function CommentThread({ comment }: { comment: Comment }) {
  console.log("comment", comment);
  return (
    <div className="space-y-2">
      <div className="flex gap-3 items-start">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment?.profiles?.avatar_url || ""} />
          <AvatarFallback> {comment?.profiles?.full_name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 rounded-md bg-muted/50 px-3 py-2">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">
              {comment?.profiles?.full_name}
            </span>
            <span className="text-muted-foreground"></span>
          </div>
          <p className="text-sm">{comment?.content}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
            <span>👍 {comment?.likes}</span>
            <button className="hover:underline">Reply</button>
          </div>
        </div>
      </div>

      <div className="pl-12 space-y-2">
        {comment.replies?.map((reply) => {
          if (reply.id === comment.id) return null;
          return (
            <CommentThread key={reply.id + reply.post_id} comment={reply} />
          );
        })}
      </div>
    </div>
  );
}

function PostHeader({ author, date }: { author: any; date: string }) {
  return (
    <div className="flex gap-3 items-start">
      <Avatar>
        <AvatarImage src={author?.avatar_url} />
        <AvatarFallback>{author?.full_name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="text-sm">
        <p className="font-semibold">{author?.full_name}</p>
        <p className="text-muted-foreground text-xs">
          {formatDistanceToNow(new Date(date), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}

function PostBody({ title, content }: { title: string; content: string }) {
  return (
    <div className="mt-4 space-y-2">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="whitespace-pre-wrap text-sm">{content}</p>
    </div>
  );
}

function PostActions({ likes, comments }: { likes: number; comments: number }) {
  return (
    <div className="flex items-center gap-6 text-sm text-muted-foreground mt-4">
      <div className="flex items-center gap-1">
        <ThumbsUp className="w-4 h-4" />
        {likes}
      </div>
      <div className="flex items-center gap-1">
        <MessageCircle className="w-4 h-4" />
        {comments} comments
      </div>
    </div>
  );
}
