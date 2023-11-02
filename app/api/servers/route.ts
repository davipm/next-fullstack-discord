import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse as res } from "next/server";
import { v4 as uuidv4 } from "uuid";

import currentProfile from "@/lib/current-profile";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();

    if (!profile) return res.json({ message: "Unauthorized" }, { status: 401 });

    const server = await prisma.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });

    return res.json(server, { status: 200 });
  } catch (error) {
    console.log("[CHANNEL_ID_PATCH]", error);
    return res.error();
  }
}
