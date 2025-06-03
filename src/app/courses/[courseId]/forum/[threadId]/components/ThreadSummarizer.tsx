'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { summarizeForumThread, type SummarizeForumThreadInput } from '@/ai/flows/summarize-forum-thread';
import type { ForumPost } from '@/lib/types';
import { Loader2, Wand2, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ThreadSummarizerProps {
  threadTitle: string;
  posts: ForumPost[];
}

export function ThreadSummarizer({ threadTitle, posts }: ThreadSummarizerProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);

    if (posts.length === 0) {
      toast({
        title: "Cannot Summarize",
        description: "There are no posts in this thread to summarize.",
        variant: "default",
      });
      setIsLoading(false);
      return;
    }
    
    const input: SummarizeForumThreadInput = {
      threadTitle,
      posts: posts.map(p => `${p.userName}: ${p.content}`),
    };

    try {
      const result = await summarizeForumThread(input);
      setSummary(result.summary);
      toast({
        title: "Summary Generated!",
        description: "The thread summary is now available.",
      });
    } catch (err) {
      console.error("Error summarizing thread:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to generate summary: ${errorMessage}`);
      toast({
        title: "Summarization Error",
        description: `Could not generate summary: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-6 p-4 border rounded-lg bg-muted/50">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold">Thread Summary</h3>
        </div>
        <Button onClick={handleSummarize} disabled={isLoading} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Summarize Thread
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {summary && (
        <Alert className="mt-4 bg-background shadow-sm">
          <AlertTitle className="font-semibold text-primary">AI Generated Summary:</AlertTitle>
          <AlertDescription className="prose prose-sm max-w-none text-foreground/90 dark:prose-invert whitespace-pre-wrap">
            {summary}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
