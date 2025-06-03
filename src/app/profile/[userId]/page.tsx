import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getUserProfileById, userProfiles, courses as allCourses, forumThreads } from '@/lib/placeholder-data';
import type { Course, ForumThread as UserForumThread } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Briefcase, CalendarDays, Mail, MapPin, Users, BookOpen, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export async function generateStaticParams() {
  return userProfiles.map((user) => ({
    userId: user.id,
  }));
}

export default async function UserProfilePage({ params }: { params: { userId: string } }) {
  const user = getUserProfileById(params.userId);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-muted/30 p-6 md:p-8 flex flex-col md:flex-row items-start gap-6">
          <Avatar className="h-32 w-32 border-4 border-background shadow-md">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
            <AvatarFallback className="text-4xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="pt-2">
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">{user.name}</h1>
            <p className="text-lg text-muted-foreground mt-1">{user.bio || 'No bio provided.'}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mt-3">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user.email}</span>
              <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> Joined {format(new Date(user.joinedDate), 'MMMM yyyy')}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="completed-courses" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 gap-2 md:max-w-lg mx-auto">
          <TabsTrigger value="completed-courses" className="text-base">
            <BookOpen className="w-4 h-4 mr-2" />Completed Courses
          </TabsTrigger>
          <TabsTrigger value="discussions" className="text-base">
            <MessageSquare className="w-4 h-4 mr-2" />Discussions
          </TabsTrigger>
          <TabsTrigger value="communities" className="text-base hidden md:flex"> {/* Hidden on small screens as per placeholder*/}
            <Users className="w-4 h-4 mr-2" />Communities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="completed-courses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Completed Courses</CardTitle>
              <CardDescription>Courses {user.name} has successfully completed.</CardDescription>
            </CardHeader>
            <CardContent>
              {user.completedCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.completedCourses.map((course: Pick<Course, 'id' | 'title' | 'imageUrl' | 'category'>) => (
                    <Link key={course.id} href={`/courses/${course.id}`} className="block group">
                      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative aspect-video">
                          <Image
                            src={course.imageUrl || 'https://placehold.co/300x160.png'}
                            alt={course.title}
                            layout="fill"
                            objectFit="cover"
                            data-ai-hint="course content"
                          />
                        </div>
                        <div className="p-4">
                          <Badge variant="secondary" className="mb-1 text-xs">{course.category}</Badge>
                          <h3 className="font-semibold group-hover:text-primary transition-colors">{course.title}</h3>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No completed courses yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Discussions</CardTitle>
              <CardDescription>Forum threads {user.name} has participated in.</CardDescription>
            </CardHeader>
            <CardContent>
              {user.discussionsParticipated.length > 0 ? (
                <ul className="space-y-3">
                  {user.discussionsParticipated.map((thread: Pick<UserForumThread, 'id' | 'title' | 'courseId'>) => {
                    const courseForThread = allCourses.find(c => c.id === thread.courseId);
                    return (
                      <li key={thread.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <Link href={`/courses/${thread.courseId}/forum/${thread.id}`} className="block">
                          <h3 className="font-semibold hover:text-primary transition-colors">{thread.title}</h3>
                          {courseForThread && (
                            <p className="text-sm text-muted-foreground">
                              In course: <span className="font-medium text-accent">{courseForThread.title}</span>
                            </p>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-muted-foreground">No discussions participated in yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communities" className="mt-6">
           <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Joined Communities</CardTitle>
              <CardDescription>Communities {user.name} is a part of.</CardDescription>
            </CardHeader>
            <CardContent>
              {user.joinedCommunities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.joinedCommunities.map(community => (
                     <Card key={community.id} className="flex items-center gap-3 p-3 hover:shadow-md transition-shadow">
                      {community.imageUrl && <Image src={community.imageUrl} alt={community.name} width={40} height={40} className="rounded-full" data-ai-hint="community logo"/>}
                      <span className="font-semibold">{community.name}</span>
                    </Card>
                  ))}
                </div>
              ) : (
                 <p className="text-muted-foreground">Not a member of any communities yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
