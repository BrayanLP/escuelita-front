import Image from 'next/image';
import type { Review } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center gap-3 pb-3">
        <Avatar>
          <AvatarImage src={review.userAvatarUrl} alt={review.userName} data-ai-hint="person portrait" />
          <AvatarFallback>{review.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-base font-semibold">{review.userName}</CardTitle>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`}
            />
          ))}
        </div>
        <p className="text-sm text-foreground/90">{review.comment}</p>
      </CardContent>
    </Card>
  );
}
