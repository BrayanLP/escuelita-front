
'use client';

import { courses } from '@/lib/placeholder-data';
import { CourseCard } from '@/app/components/CourseCard';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useRequireAuth();

  if (loading || !user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Loading courses...</p>
      </div>
    );
  }

  return (
    <div>
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-headline font-bold mb-3 text-primary">Welcome to Escuelita, {user.displayName || 'Learner'}!</h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          Discover a wide range of courses designed to help you grow your skills and knowledge.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-headline font-semibold mb-6">Our Courses</h2>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No courses available at the moment. Please check back later.</p>
        )}
      </section>
    </div>
  );
}
