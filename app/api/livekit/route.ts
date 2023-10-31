import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse as res } from "next/server";

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;
const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

export async function GET(req: NextRequest) {
  try {
    const room = req.nextUrl.searchParams.get("room");
    const username = req.nextUrl.searchParams.get("username");

    if (!room) {
      return res.json(
        { error: 'Missing "room" query parameter' },
        // @ts-ignore
        { status: 400 },
      );
    } else if (!username) {
      return res.json(
        { error: 'Missing "username" query parameter' },
        // @ts-ignore
        { status: 400 },
      );
    }

    if (!apiKey || !apiSecret || !wsUrl) {
      // @ts-ignore
      return res.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const at = new AccessToken(apiKey, apiSecret, { identity: username });

    at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

    return res.json({ token: at.toJwt() });
  } catch (error) {
    console.log("[GET LIVE-KIT MESSAGE ERROR]", error);
    return res.error();
  }
}
