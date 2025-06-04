"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function NewCommentBox({
  postId,
  parentId,
}: {
  postId: string;
  parentId?: string;
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Debes iniciar sesión para comentar");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("post_comments").insert([
      {
        post_id: postId,
        user_id: user.id,
        content: content.trim(),
        parent_id: parentId || null,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error al comentar");
    } else {
      setContent("");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-start gap-3 mt-6">
      <Avatar>
        <AvatarImage src="/avatar.png" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <Textarea
          rows={2}
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
            size="sm"
          >
            {loading ? "Posting..." : "Post comment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
