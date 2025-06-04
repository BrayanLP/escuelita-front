"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Paperclip, Youtube, BarChart3, Smile, ImageIcon } from "lucide-react";

export function PostComposer({ submit }: any) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <Card className="w-full max-w-2xl mx-auto rounded-xl shadow-sm">
      <CardContent className="flex items-start gap-3 py-4">
        <Avatar>
          <AvatarImage src="/avatar.png" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>

        {!expanded ? (
          <div
            onClick={() => setExpanded(true)}
            className="w-full bg-muted px-4 py-2 rounded-full cursor-text text-muted-foreground"
          >
            Escribe algo...
          </div>
        ) : (
          <div className="w-full space-y-2">
            <Input
              placeholder="Titulo"
              className="text-lg font-semibold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Escribe algo..."
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="flex items-center justify-between pt-2 text-muted-foreground text-sm">
              <div className="flex items-center gap-3">
                {/* <Paperclip className="w-4 h-4 cursor-pointer" />
                <Youtube className="w-4 h-4 cursor-pointer" />
                <BarChart3 className="w-4 h-4 cursor-pointer" />
                <Smile className="w-4 h-4 cursor-pointer" />
                <ImageIcon className="w-4 h-4 cursor-pointer" />
                <span className="ml-3">Select a category</span> */}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setExpanded(false);
                    setTitle("");
                    setContent("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={!title && !content}
                  onClick={() => {
                    submit({ newTitle: title, newPost: content });
                    setExpanded(false);
                    setTitle("");
                    setContent("");
                  }}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
