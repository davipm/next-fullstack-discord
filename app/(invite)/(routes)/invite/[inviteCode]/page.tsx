import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import currentProfile from "@/lib/current-profile";
import prisma from "@/lib/db";

interface Props {
  params: { inviteCode: string };
}

export default async function InviteCodePage({ params }: Props) {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  if (!params.inviteCode) return redirect("/");

  const existingServer = await prisma.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) return redirect(`/servers/${existingServer.id}`);

  const server = await prisma.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
  });

  if (server) return redirect(`/servers/${server.id}`);

  return null;
}
