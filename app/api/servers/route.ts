import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse as res } from "next/server";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";

import currentProfile from "@/lib/current-profile";
import prisma from "@/lib/db";

export const serverSchema = z.object({
  name: z.string(),
  imageUrl: z.string().url(),
});

export async function POST(req: NextRequest) {
  const profile = await currentProfile();
  const body = await req.json();
  const response = serverSchema.safeParse(body);

  if (!profile) return res.json({ message: "Unauthorized" }, { status: 401 });

  if (!response.success) {
    const { errors } = response.error;
    return res.json({ message: "Invalid request", errors }, { status: 400 });
  }

  const { name, imageUrl } = response.data;

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
}
