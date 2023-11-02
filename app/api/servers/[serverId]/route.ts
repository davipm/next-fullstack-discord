import { NextRequest, NextResponse as res } from "next/server";

import currentProfile from "@/lib/current-profile";
import prisma from "@/lib/db";

type Params = {
  params: {
    serverId: string;
  };
};

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const profile = await currentProfile();
    const { serverId } = params;

    if (!profile) {
      return res.json({ message: "Unauthorized" }, { status: 401 });
    }

    await prisma.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    return res.json({ message: "Server Deleted!" }, { status: 200 });
  } catch (error) {
    console.log("[MEMBERS_ID_DELETE]", error);
    return res.error();
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();
    const { serverId } = params;

    if (!profile) {
      return res.json({ message: "Unauthorized" }, { status: 401 });
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return res.json(server, { status: 200 });
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH]", error);
    return res.error();
  }
}
