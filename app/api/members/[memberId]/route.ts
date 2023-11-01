import { NextRequest, NextResponse as res } from "next/server";

import currentProfile from "@/lib/current-profile";
import prisma from "@/lib/db";

type Params = {
  params: {
    memberId: string;
  };
};

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const profile = await currentProfile();
    const serverId = req.nextUrl.searchParams.get("serverId");
    const { memberId } = params;

    if (!profile) {
      return res.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!serverId) {
      return res.json({ message: "Server ID missing" }, { status: 400 });
    }

    if (!memberId) {
      return res.json({ message: "Member ID missing" }, { status: 400 });
    }

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
  } catch (error) {
    console.log("[MEMBERS_ID_DELETE]", error);
    return res.error();
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const profile = await currentProfile();
    const serverId = req.nextUrl.searchParams.get("serverId");
    const { role } = await req.json();
    const { memberId } = params;

    if (!profile) {
      return res.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!serverId) {
      return res.json({ message: "Server ID missing" }, { status: 400 });
    }

    if (!memberId) {
      return res.json({ message: "Member ID missing" }, { status: 400 });
    }

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
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH]", error);
    return res.error();
  }
}
