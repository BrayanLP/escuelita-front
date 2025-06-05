"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CommunitySidebar } from "@/components/community-sidebar";
import Image from "next/image";
import { useParams } from "next/navigation";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  pinned: boolean;
  created_at: string;
  user_id: string;
}
interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  banner_url: string;
  logo_url: string;
  is_private: boolean;
  members_count: number;
  price: string;
  created_by: string;
}
export default function AboutPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const { communityId } = useParams();
  const [community, setCommunity] = useState<Community | null>(null);

  useEffect(() => {
    fetchCommunity();
  }, []);

  const fetchCommunity = async () => {
    const { data } = await supabase
      .from("communities")
      .select("*")
      .eq("id", "c74f37d5-5e3e-442c-a273-c46d1db1f37a")
      .single();

    if (data) setCommunity(data);
  };

  if (!community) return <p className="text-center">Cargando comunidad...</p>;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data);
    }
  };

  const handleSubmit = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!newPost.trim() || !userData.user) return;

    const { error } = await supabase.from("posts").insert({
      title: "Nueva publicación",
      content: newPost.trim(),
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
          <Card>
            <CardContent className="p-4">
              <div className="relative h-56 w-full rounded-t-lg overflow-hidden">
                <Image
                  src={community.banner_url}
                  alt={community.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex items-center gap-4 px-6 py-4">
                <Image
                  src={community.logo_url}
                  alt="Logo"
                  width={56}
                  height={56}
                  className="rounded-md object-cover"
                />
                <div>
                  <h1 className="text-2xl font-bold">{community.name}</h1>
                  <div className="flex gap-2 mt-1 text-sm text-muted-foreground">
                    <span>
                      {community.is_private ? "🔒 Private" : "🌍 Public"}
                    </span>
                    <span>👥 {community.members_count} members</span>
                    <span>💰 {community.price}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="w-[280px] hidden lg:block">
          <CommunitySidebar />
        </aside>
      </div>
    </>
  );
}
