import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

const PAGE_SIZE = 10;

export function usePostComments(postId: string) {
  const [comments, setComments] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMoreComments = async () => {
    if (loading || !postId) return;
    setLoading(true);

    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("post_comments")
      .select("*, profiles(*), replies:post_comments!parent_id(*)")
      .eq("post_id", postId)
      .is("parent_id", null)
      .order("created_at", { ascending: true })
      .range(from, to);

    if (error) {
      console.error(error);
    } else {
      setComments((prev) => {
        const all = [...prev, ...data];
        const unique = Array.from(new Map(all.map((c) => [c.id, c])).values());
        return unique;
      });
      setPage((prev) => prev + 1);
      if (data.length < PAGE_SIZE) setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    // Load first page on mount
    loadMoreComments();
  }, [postId]);

  return { comments, hasMore, loadMoreComments, loading };
}
