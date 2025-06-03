'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createCommunityThread } from '@/lib/placeholder-data';

export function NewCommunityThreadForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // In a real app, this would be the authenticated user's ID
  const placeholderUserId = 'user1'; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Title and content cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newThread = createCommunityThread(title, content, placeholderUserId);

      if (newThread) {
        toast({
          title: "Success!",
          description: "New community thread created.",
        });
        setTitle('');
        setContent('');
        router.refresh(); // Refresh server component data
        router.push(`/community/threads/${newThread.id}`);
      } else {
        throw new Error("Failed to create thread.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Could not create thread. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-2xl">
          <PlusCircle className="w-6 h-6 text-primary" />
          Start a New Discussion
        </CardTitle>
        <CardDescription>Share your thoughts or ask a question to the community.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="threadTitle" className="font-semibold">Discussion Title</Label>
            <Input
              id="threadTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., What are your favorite coding tools?"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="threadContent" className="font-semibold">Your Message</Label>
            <Textarea
              id="threadContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your question or comment here..."
              required
              rows={5}
              className="mt-1"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
            {isSubmitting ? 'Submitting...' : 'Create Discussion'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
