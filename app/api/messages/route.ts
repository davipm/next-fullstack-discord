import { Message } from "@prisma/client";
import { NextRequest, NextResponse as res } from "next/server";

import currentProfile from "@/lib/current-profile";
import prisma from "@/lib/db";

const MESSAGES_BATCH = 10;

export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const channelId = req.nextUrl.searchParams.get("channelId");
    const cursor = req.nextUrl.searchParams.get("cursor");

    // TODO: finish api
  } catch (error) {
    console.log("[MESSAGE_GET]", error);
    return res.error();
  }
}
