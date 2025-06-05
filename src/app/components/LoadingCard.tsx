import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingCard() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, idx) => (
        <Card key={idx} className="p-0">
          <div className="relative w-full h-36 rounded-t overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
          <CardContent className="space-y-2 p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-6 h-6 rounded" />
              <div className="font-semibold text-sm">
                <Skeleton className="w-32 h-4" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground line-clamdiv-2">
              <Skeleton className="w-full h-16" />
            </div>
            <div className="text-xs text-muted-foreground">
              <Skeleton className="w-24 h-4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
