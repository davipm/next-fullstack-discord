import { DirectMessage } from "@prisma/client";
import { NextRequest, NextResponse as res } from "next/server";

import currentProfile from "@/lib/current-profile";
import prisma from "@/lib/db";

const MESSAGES_BATCH = 10;

export async function GET(req: NextRequest) {
  const profile = await currentProfile();
  const cursor = req.nextUrl.searchParams.get("cursor");
  const conversationId = req.nextUrl.searchParams.get("conversationId");

  if (!profile) return res.json({ message: "Unauthorized" }, { status: 401 });

  if (!conversationId)
    return res.json({ message: "Conversation ID missing" }, { status: 400 });

  let messages: DirectMessage[] = [];

  try {
    messages = await prisma.directMessage.findMany({
      take: MESSAGES_BATCH,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: { conversationId },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("[GET DIRECT MESSAGE ERROR]", error);
    return res.json(
      { message: "Error fetching direct messages" },
      { status: 500 },
    );
  }

  let nextCursor = null;

  if (messages.length === MESSAGES_BATCH) {
    nextCursor = messages[MESSAGES_BATCH - 1].id;
  }

  return res.json({ items: messages, nextCursor }, { status: 200 });
}
