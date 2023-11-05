import { NextRequest, NextResponse as res } from "next/server";

import currentProfile from "@/lib/current-profile";
import prisma from "@/lib/db";

type Params = {
  params: {
    memberId: string;
  };
};

export async function DELETE(req: NextRequest, { params }: Params) {
  const profile = await currentProfile();
  const serverId = req.nextUrl.searchParams.get("serverId")!;
  const memberId = params.memberId!;

  if (!profile) return res.json({ message: "Unauthorized" }, { status: 401 });

  const server = await prisma.server.update({
    where: {
      id: serverId,
      profileId: profile.id,
    },
    data: {
      members: {
        deleteMany: {
          id: memberId,
          profileId: {
            not: profile.id,
          },
        },
      },
    },
    include: {
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  return res.json(server, { status: 200 });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const profile = await currentProfile();
  const serverId = req.nextUrl.searchParams.get("serverId")!;
  const memberId = params.memberId!;
  const role = (await req.json()).role;

  if (!profile) return res.json({ message: "Unauthorized" }, { status: 401 });

  const server = await prisma.server.update({
    where: {
      id: serverId,
      profileId: profile.id,
    },
    data: {
      members: {
        update: {
          where: {
            id: memberId,
            profileId: {
              not: profile.id,
            },
          },
          data: {
            role,
          },
        },
      },
    },
    include: {
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  return res.json(server, { status: 200 });
}
