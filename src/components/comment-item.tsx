"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Pencil } from "lucide-react";

export function CommentItem({
  comment,
  userId,
  replies,
  refresh,
}: {
  comment: any;
  userId: string;
  replies: any[];
  refresh: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.content);
  const [replying, setReplying] = useState(false);
  const [reply, setReply] = useState("");

  const saveEdit = async () => {
    await supabase
      .from("post_comments")
      .update({ content: editedText })
      .eq("id", comment.id);
    setIsEditing(false);
    refresh();
  };

  const handleReply = async () => {
    await supabase.from("post_comments").insert({
      post_id: comment.post_id,
      user_id: userId,
      content: reply,
      parent_id: comment.id,
    });
    setReply("");
    setReplying(false);
    refresh();
  };

  return (
    <div className="border rounded-md p-3 text-sm space-y-2 bg-muted">
      <div className="flex gap-3 items-start">
        <Avatar className="w-6 h-6">
          <AvatarImage src={comment.profiles?.avatar_url || ""} />
          <AvatarFallback>{comment.profiles?.full_name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <p className="font-medium">{comment.profiles?.full_name}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.created_at), {
              addSuffix: true,
            })}
          </p>

          {isEditing ? (
            <>
              <Textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={saveEdit} size="sm">
                  Guardar
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  size="sm"
                  variant="ghost"
                >
                  Cancelar
                </Button>
              </div>
            </>
          ) : (
            <p>{comment.content}</p>
          )}

          {userId === comment.user_id && !isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              size="xs"
              variant="ghost"
              className="text-xs"
            >
              <Pencil className="w-3 h-3 mr-1" />
              Editar
            </Button>
          )}
        </div>
      </div>

      {/* Respuestas */}
      {replies.length > 0 && (
        <div className="ml-8 space-y-2">
          {replies.map((r) => (
            <CommentItem
              key={r.id}
              comment={r}
              userId={userId}
              replies={[]}
              refresh={refresh}
            />
          ))}
        </div>
      )}

      {replying ? (
        <div className="ml-8 space-y-2">
          <Textarea value={reply} onChange={(e) => setReply(e.target.value)} />
          <div className="flex gap-2">
            <Button onClick={handleReply} size="sm">
              Responder
            </Button>
            <Button
              variant="ghost"
              onClick={() => setReplying(false)}
              size="sm"
            >
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="link"
          size="sm"
          className="ml-8"
          onClick={() => setReplying(true)}
        >
          Responder
        </Button>
      )}
    </div>
  );
}
