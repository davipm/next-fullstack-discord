import { NextRequest, NextResponse as res } from "next/server";

import currentProfile from "@/lib/current-profile";
import prisma from "@/lib/db";

interface Params {
  params: { serverId: string };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const profile = await currentProfile();
  const { serverId } = params;

  if (!profile) return res.json({ message: "Unauthorized" }, { status: 401 });

  if (!serverId)
    return res.json({ message: "Invalid request" }, { status: 400 });

  const server = await prisma.server.update({
    where: {
      id: serverId,
      profileId: {
        not: profile.id,
      },
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    data: {
      members: {
        deleteMany: {
          profileId: profile.id,
        },
      },
    },
  });

  return res.json(server);
}
