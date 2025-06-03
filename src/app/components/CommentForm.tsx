'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

interface CommentFormProps {
  threadId: string;
  courseId: string;
  onPostSubmit: (content: string) => Promise<boolean>; // Returns true on success
}

export function CommentForm({ threadId, courseId, onPostSubmit }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onPostSubmit(content);
      if (success) {
        setContent('');
        toast({
          title: "Success!",
          description: "Your post has been added.",
        });
      } else {
        throw new Error("Failed to submit post.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Could not submit post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your reply..."
        rows={4}
        required
        className="bg-background"
      />
      <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
        <Send className="w-4 h-4 mr-2" />
        {isSubmitting ? 'Posting...' : 'Post Reply'}
      </Button>
    </form>
  );
}
