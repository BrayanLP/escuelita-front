"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { courses as allCourses, forumThreads } from "@/lib/placeholder-data"; // Keep if still needed for related data
import type { Course, ForumThread as UserForumThread } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Briefcase,
  CalendarDays,
  Mail,
  MapPin,
  Users,
  BookOpen,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useSupabase } from "@/context/SupabaseContext";
import { useRouter } from "next/navigation"; // Import useRouter for potential redirects or notFound

export default function UserProfilePage() {
  const { user: authUser, loading: authLoading } = useRequireAuth(); // Ensures user is logged in
  const params = useParams();
  const userId = params.userId as string;

  const supabase = useSupabase();
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<any | null>(null); // Use 'any' for now, define a type later
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("users") // Assuming your user profiles are in the 'users' table
        .select("*") // Select all columns
        .eq("id", userId) // Filter by the user ID from the URL
        .single(); // Expecting a single result

      if (error) {
        setError(error.message);
        setUserProfile(null);
      } else {
        setUserProfile(data);
      }
      setIsLoading(false);
    }
    fetchUserProfile();
  }, [userId, supabase]); // Depend on userId and supabase client

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] text-red-500">
        <p>Error loading profile: {error}</p>
      </div>
    );
  }

  if (!userProfile) {
    // User profile not found in Supabase
    // You could redirect to a 404 page or show a specific message
    router.push("/404"); // Redirect to a 404 page
    return null;
  }

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-muted/30 p-6 md:p-8 flex flex-col md:flex-row items-start gap-6">
          <Avatar className="h-32 w-32 border-4 border-background shadow-md">
            <AvatarImage
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              data-ai-hint="person portrait"
            />
            <AvatarFallback className="text-4xl">
              {userProfile.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="pt-2">
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
              {userProfile.name}
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              {userProfile.bio || "No bio provided."}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mt-3">
              {userProfile.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4" /> {userProfile.email}
                </span>
              )}
              {/* Assuming 'created_at' from Supabase is the join date */}
              {userProfile.created_at && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4" /> Joined{" "}
                  {format(new Date(userProfile.created_at), "MMMM yyyy")}
                </span>
              )}
            </div>
          </div>
          {/* Add Edit Profile button here if userId matches authUser.id */}
        </CardHeader>
      </Card>

      <Tabs defaultValue="completed-courses" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 gap-2 md:max-w-lg mx-auto">
          <TabsTrigger value="completed-courses" className="text-base">
            <BookOpen className="w-4 h-4 mr-2" />
            Completed Courses
          </TabsTrigger>
          <TabsTrigger value="discussions" className="text-base">
            <MessageSquare className="w-4 h-4 mr-2" />
            Discussions
          </TabsTrigger>
          <TabsTrigger value="communities" className="text-base hidden md:flex">
            {" "}
            {/* Hidden on small screens as per placeholder*/}
            <Users className="w-4 h-4 mr-2" />
            Communities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="completed-courses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Completed Courses
              </CardTitle>
              <CardDescription>
                Courses {userProfile.name} has successfully completed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder data for completedCourses - replace with Supabase data */}
              {userProfile.completed_courses &&
              userProfile.completed_courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userProfile.completedCourses.map(
                    (
                      course: Pick<
                        Course,
                        "id" | "title" | "imageUrl" | "category"
                      >
                    ) => (
                      <Link
                        key={course.id}
                        href={`/courses/${course.id}`}
                        className="block group"
                      >
                        <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                          <div className="relative aspect-video">
                            <Image
                              src={
                                course.imageUrl ||
                                "https://placehold.co/300x160.png"
                              }
                              alt={course.title}
                              layout="fill"
                              objectFit="cover"
                              data-ai-hint="course content"
                            />
                          </div>
                          <div className="p-4">
                            <Badge variant="secondary" className="mb-1 text-xs">
                              {course.category}
                            </Badge>
                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                              {course.title}
                            </h3>
                          </div>
                        </Card>
                      </Link>
                    )
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No completed courses found.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Discussions
              </CardTitle>
              <CardDescription>
                Forum threads {userProfile.name} has participated in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder data for discussionsParticipated - replace with Supabase data */}
              {userProfile.discussions && userProfile.discussions.length > 0 ? (
                <ul className="space-y-3">
                  {userProfile.discussionsParticipated.map(
                    (
                      thread: Pick<UserForumThread, "id" | "title" | "courseId">
                    ) => {
                      const fullThreadDetails = forumThreads.find(
                        (ft) => ft.id === thread.id
                      );
                      const courseForThread = fullThreadDetails?.courseId
                        ? allCourses.find(
                            (c) => c.id === fullThreadDetails.courseId
                          )
                        : undefined;
                      const linkHref = fullThreadDetails?.courseId
                        ? `/courses/${fullThreadDetails.courseId}/forum/${thread.id}`
                        : `/community/threads/${thread.id}`;

                      return (
                        <li
                          key={thread.id}
                          className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <Link href={linkHref} className="block">
                            <h3 className="font-semibold hover:text-primary transition-colors">
                              {thread.title}
                            </h3>
                            {courseForThread && (
                              <p className="text-sm text-muted-foreground">
                                In course:{" "}
                                <span className="font-medium text-accent">
                                  {courseForThread.title}
                                </span>
                              </p>
                            )}
                            {!fullThreadDetails?.courseId && (
                              <p className="text-sm text-muted-foreground">
                                In:{" "}
                                <span className="font-medium text-accent">
                                  Community Forum
                                </span>
                              </p>
                            )}
                          </Link>
                        </li>
                      );
                    }
                  )}
                </ul>
              ) : (
                <p className="text-muted-foreground">No discussions found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communities" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Joined Communities
              </CardTitle>
              <CardDescription>
                Communities {userProfile.name} is a part of.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder data for joinedCommunities - replace with Supabase data */}
              {userProfile.joined_communities &&
              userProfile.joined_communities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userProfile.joinedCommunities.map((community) => (
                    <Card
                      key={community.id}
                      className="flex items-center gap-3 p-3 hover:shadow-md transition-shadow"
                    >
                      {community.imageUrl && (
                        <Image
                          src={community.imageUrl}
                          alt={community.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                          data-ai-hint="community logo"
                        />
                      )}
                      <span className="font-semibold">{community.name}</span>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No joined communities found.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
