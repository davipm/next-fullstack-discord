import { NextRequest, NextResponse as res } from "next/server";

import currentProfile from "@/lib/current-profile";
import prisma from "@/lib/db";

const MESSAGES_BATCH = 10;

export async function GET(req: NextRequest) {
  const profile = await currentProfile();

  if (!profile) return res.json({ message: "Unauthorized" }, { status: 401 });

  const channelId = req.nextUrl.searchParams.get("channelId");
  const cursor = req.nextUrl.searchParams.get("cursor");

  if (!channelId || !cursor)
    return res.json({ message: "Invalid request" }, { status: 400 });

  const messages = await prisma.message.findMany({
    take: MESSAGES_BATCH,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    where: { channelId },
    include: { member: { include: { profile: true } } },
    orderBy: { createdAt: "desc" },
  });

  const nextCursor =
    messages.length === MESSAGES_BATCH ? messages.at(-1)!.id : null;

  return res.json({ items: messages, nextCursor }, { status: 200 });
}
