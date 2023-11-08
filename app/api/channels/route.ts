import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse as res } from "next/server";
import * as z from "zod";

import currentProfile from "@/lib/current-profile";
import prisma from "@/lib/db";

type Params = {
  params: {
    channelId: string;
  };
};

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const profile = await currentProfile();
    const serverId = req.nextUrl.searchParams.get("serverId");
    const { channelId } = params;

    if (!profile) {
      return res.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!serverId) {
      return res.json({ message: "Server ID missing" }, { status: 400 });
    }

    if (!channelId) {
      return res.json({ message: "Channel ID missing" }, { status: 400 });
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return res.json(server, { status: 200 });
  } catch (error) {
    console.log("[CHANNEL_ID_DELETE]", error);
    return res.error();
  }
}

const patchSchema = z.object({
  name: z.string().refine((data) => data !== "general", {
    message: "Name cannot be 'general",
  }),
  type: z.string(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  const profile = await currentProfile();
  const body = await req.json();
  const response = patchSchema.safeParse(body);
  const { channelId } = params;

  const serverId = req.nextUrl.searchParams.get("serverId");

  if (!profile) return res.json({ message: "Unauthorized" }, { status: 401 });

  if (!serverId || !channelId)
    return res.json({ message: "Invalid request" }, { status: 400 });

  if (!response.success) {
    const { errors } = response.error;
    return res.json({ message: "Invalid request", errors }, { status: 400 });
  }

  const { name, type } = response.data;

  const server = await prisma.server.update({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
          role: {
            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
          },
        },
      },
    },
    data: {
      channels: {
        // @ts-ignore
        update: {
          where: {
            id: params.channelId,
            NOT: { name: "general" },
          },
          data: {
            name,
            type,
          },
        },
      },
    },
  });

  return res.json(server, { status: 200 });
}
