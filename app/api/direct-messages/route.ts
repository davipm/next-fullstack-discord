import { DirectMessage } from "@prisma/client";
import { NextRequest, NextResponse as res } from "next/server";

import currentProfile from "@/lib/current-profile";
import prisma from "@/lib/db";

const MESSAGES_BATCH = 10;

export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const cursor = req.nextUrl.searchParams.get("cursor");
    const conversationId = req.nextUrl.searchParams.get("conversationId");

    if (!profile) return res.json({ message: "Unauthorized" }, { status: 401 });

    if (!conversationId)
      return res.json({ message: "Conversation ID missing" }, { status: 400 });

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await prisma.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
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
    } else {
      messages = await prisma.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId,
        },
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
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return res.json({ items: messages, nextCursor }, { status: 200 });
  } catch (error) {
    console.log("[GET DIRECT MESSAGE ERROR]", error);
    return res.error();
  }
}
