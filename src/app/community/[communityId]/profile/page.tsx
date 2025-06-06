// app/community/[communityId]/profile/page.tsx
import { redirect } from "next/navigation";

export default function ProfileRootPage({
  params,
}: {
  params: { communityId: string };
}) {
  redirect(`/community/${params.communityId}/profile/account`);
}
