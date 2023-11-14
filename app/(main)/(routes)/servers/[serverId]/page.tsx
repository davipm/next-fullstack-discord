import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import currentProfile from "@/lib/current-profile";
import prisma from "@/lib/db";

interface Props {
  params: { serverId: string };
}

export default async function Page({ params }: Props) {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const server = await prisma.server.findFirst({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== "general") return null;

  return redirect(`/servers/${params.serverId}/channels/${initialChannel.id}`);
}
