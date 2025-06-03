import type { ForumPost } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface ForumPostCardProps {
  post: ForumPost;
}

export function ForumPostCard({ post }: ForumPostCardProps) {
  return (
    <Card className="mb-4 shadow-sm bg-card">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.userAvatarUrl} alt={post.userName} data-ai-hint="person avatar"/>
            <AvatarFallback>{post.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-primary">{post.userName}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="prose prose-sm max-w-none text-foreground/90 dark:prose-invert">
          {/* Replace newline characters with <br /> tags for simple formatting */}
          {post.content.split('\n').map((line, index, arr) => (
            <span key={index}>
              {line}
              {index < arr.length - 1 && <br />}
            </span>
          ))}
        </div>
      </CardContent>
      {/* Add reply button or actions here if needed in the future */}
      {/* <CardFooter className="p-3 border-t">
        <Button variant="ghost" size="sm">Reply</Button>
      </CardFooter> */}
    </Card>
  );
}
