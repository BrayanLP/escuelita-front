import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function usePostStats(postId: string) {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);

  useEffect(() => {
    if (!postId) return;

    const fetchStats = async () => {
      const { count: likeCount } = await supabase
        .from("post_likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);

      const { count: commentCount } = await supabase
        .from("post_comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);

      setLikes(likeCount || 0);
      setComments(commentCount || 0);
    };

    fetchStats();
  }, [postId]);

  return { likes, comments };
}
