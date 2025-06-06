// components/payment-method-card.tsx
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Props = {
  method: {
    name: string;
    instructions: string;
    image_url?: string;
  };
};

export function PaymentMethodCard({ method }: Props) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{method.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {method.image_url && (
          <Image
            src={method.image_url}
            alt="QR o imagen del método"
            width={400}
            height={400}
            className="rounded-md border shadow-sm w-full"
          />
        )}
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {method.instructions}
        </p>
      </CardContent>
    </Card>
  );
}
