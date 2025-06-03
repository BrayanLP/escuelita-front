import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCourseById, courses } from '@/lib/placeholder-data'; // Using courses for related suggestions
import type { Instructor, Review as ReviewType, SyllabusModule } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ReviewCard } from '@/app/components/ReviewCard';
import { CourseCard } from '@/app/components/CourseCard';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, MessageSquare, Star, Tag, DollarSign, CheckCircle, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  return courses.map((course) => ({
    courseId: course.id,
  }));
}

export default async function CoursePage({ params }: { params: { courseId: string } }) {
  const course = getCourseById(params.courseId);

  if (!course) {
    notFound();
  }

  const relatedCourses = courses.filter(c => c.id !== course.id && c.category === course.category).slice(0, 2);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden shadow-xl">
            <CardHeader className="p-0 relative aspect-[16/9]">
              <Image
                src={course.imageUrl}
                alt={course.title}
                layout="fill"
                objectFit="cover"
                priority
                data-ai-hint={course.imageHint || "education learning"}
              />
            </CardHeader>
            <CardContent className="p-6">
              <Badge variant="outline" className="mb-2 text-primary border-primary">{course.category}</Badge>
              <h1 className="text-4xl font-headline font-bold mb-3 text-primary">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{course.tagline}</p>
              
              <div className="prose max-w-none text-foreground/90 dark:prose-invert">
                <p>{course.longDescription}</p>
              </div>
            </CardContent>
          </Card>

          {/* Syllabus Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <BookOpen className="w-6 h-6 text-primary" />
                Course Syllabus
              </CardTitle>
            </CardHeader>
            <CardContent>
              {course.syllabus.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {course.syllabus.map((module: SyllabusModule) => (
                    <AccordionItem value={module.id} key={module.id}>
                      <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                        {module.title}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pl-2">
                        <p className="text-muted-foreground text-sm">{module.description}</p>
                        <ul className="space-y-2">
                          {module.lessons.map(lesson => (
                            <li key={lesson.id} className="flex items-center gap-2 text-sm">
                              <PlayCircle className="w-4 h-4 text-accent"/>
                              <span>{lesson.title}</span>
                              <span className="ml-auto text-xs text-muted-foreground">{lesson.duration}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-muted-foreground">Syllabus details are not yet available.</p>
              )}
            </CardContent>
          </Card>

          {/* Instructors Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <Users className="w-6 h-6 text-primary" />
                Instructors
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              {course.instructors.map((instructor: Instructor) => (
                <div key={instructor.id} className="flex items-start gap-4 p-4 border rounded-lg bg-background">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={instructor.avatarUrl} alt={instructor.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{instructor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{instructor.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{instructor.bio}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <Star className="w-6 h-6 text-primary" />
                Student Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.reviews.length > 0 ? (
                course.reviews.map((review: ReviewType) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <p className="text-muted-foreground">No reviews yet for this course.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar / Call to action */}
        <div className="lg:col-span-1 space-y-6 sticky top-20 self-start">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary">
                {course.price > 0 ? `${course.currency} ${course.price.toFixed(2)}` : 'Free'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg">
                Enroll Now
              </Button>
              <Button variant="outline" size="lg" className="w-full text-lg" asChild>
                <Link href={`/courses/${course.id}/forum`}>
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Go to Forum
                </Link>
              </Button>
              <ul className="text-sm text-muted-foreground space-y-2 pt-3">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Full lifetime access</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Certificate of completion</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Access on mobile and TV</li>
              </ul>
            </CardContent>
          </Card>
          
          {relatedCourses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">Related Courses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedCourses.map(rc => (
                  <Link key={rc.id} href={`/courses/${rc.id}`} className="block group">
                    <div className="flex gap-3 items-start p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <Image src={rc.imageUrl} alt={rc.title} width={80} height={45} className="rounded aspect-[16/9] object-cover" data-ai-hint={rc.imageHint || "education"}/>
                      <div>
                        <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{rc.title}</h4>
                        <p className="text-xs text-muted-foreground">{rc.category}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
