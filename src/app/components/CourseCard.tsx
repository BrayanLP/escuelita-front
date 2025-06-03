import Image from 'next/image';
import Link from 'next/link';
import type { Course } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Users } from 'lucide-react';

interface CourseCardProps {
  course: Pick<Course, 'id' | 'title' | 'tagline' | 'imageUrl' | 'imageHint' | 'category' | 'price' | 'currency' | 'rating' | 'enrollmentCount'>;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0">
        <Link href={`/courses/${course.id}`} className="block relative aspect-[16/9]">
          <Image
            src={course.imageUrl}
            alt={course.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint={course.imageHint || "online course education"}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Badge variant="secondary" className="mb-2">{course.category}</Badge>
        <CardTitle className="text-lg font-headline mb-1 leading-tight">
          <Link href={`/courses/${course.id}`} className="hover:text-primary transition-colors">
            {course.title}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{course.tagline}</p>
      </CardContent>
      <CardFooter className="p-4 border-t flex flex-col items-start gap-3">
        <div className="flex justify-between w-full items-center text-sm">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span>{course.rating.toFixed(1)}</span>
            <span className="text-muted-foreground ml-1">({course.enrollmentCount})</span>
          </div>
          <p className="text-lg font-semibold text-primary">
            {course.price > 0 ? `${course.currency} ${course.price.toFixed(2)}` : 'Free'}
          </p>
        </div>
        <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href={`/courses/${course.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
