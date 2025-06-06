"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CommunitySidebar } from "@/components/community-sidebar";
import { PostCard } from "@/components/post-card";
import { PostComposer } from "@/components/post-composer";
import { useCommunity } from "@/context/community-context";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  pinned: boolean;
  created_at: string;
  user_id: string;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const { community, loading } = useCommunity();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, profiles(*)")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data);
    }
  };

  const handleSubmit = async (values: any) => {
    console.log("values", values);
    const { data: userData } = await supabase.auth.getUser();
    if (!values.newTitle.trim() || !values.newPost.trim() || !userData.user)
      return;

    const { error } = await supabase.from("posts").insert({
      title: values.newTitle.trim(),
      content: values.newPost.trim(),
      category: "General",
      pinned: false,
      user_id: userData.user.id,
    });

    if (error) {
      console.error("Error publicando:", error.message);
    } else {
      setNewPost("");
      fetchPosts();
    }
  };

  return (
    <>
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 py-6 gap-6">
        <div className="space-y-6 flex-1">
          <PostComposer
            submit={(values: any) => handleSubmit(values)}
          ></PostComposer>

          {/* Lista de publicaciones */}
          {posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <aside className="w-[280px] hidden lg:block">
          <CommunitySidebar />
        </aside>
      </div>
    </>
  );
}
