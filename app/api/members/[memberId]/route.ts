import { NextRequest, NextResponse as res } from "next/server";

import currentProfile from "@/lib/current-profile";
import prisma from "@/lib/db";
import { memberSchema } from "@/schemas";
import { MembersParams as Params } from "@/types";

export async function DELETE(req: NextRequest, { params }: Params) {
  const profile = await currentProfile();
  const serverId = req.nextUrl.searchParams.get("serverId");
  const { memberId } = params;

  if (!profile) return res.json({ message: "Unauthorized" }, { status: 401 });

  if (!memberId || !serverId)
    return res.json({ message: "Invalid request" }, { status: 400 });

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

// const patchSchema = z.object({
//   role: z.string(),
// });

export async function PATCH(req: NextRequest, { params }: Params) {
  const profile = await currentProfile();
  const body = await req.json();
  const response = memberSchema.safeParse(body);
  const serverId = req.nextUrl.searchParams.get("serverId")!;
  const { memberId } = params;

  if (!profile) return res.json({ message: "Unauthorized" }, { status: 401 });

  if (!memberId || !serverId)
    return res.json({ message: "Invalid request" }, { status: 400 });

  if (!response.success) {
    const { errors } = response.error;
    return res.json({ message: "Invalid request", errors }, { status: 400 });
  }

  const { role } = response.data;

  const server = await prisma.server.update({
    where: {
      id: serverId,
      profileId: profile.id,
    },
    data: {
      members: {
        // @ts-ignore
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
