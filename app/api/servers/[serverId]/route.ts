import { NextRequest, NextResponse as res } from "next/server";
import * as z from "zod";

import { serverSchema } from "@/app/api/servers/route";
import currentProfile from "@/lib/current-profile";
import prisma from "@/lib/db";

type Params = {
  params: { serverId: string };
};

export async function DELETE(req: NextRequest, { params }: Params) {
  const profile = await currentProfile();
  const { serverId } = params;

  if (!profile) return res.json({ message: "Unauthorized" }, { status: 401 });

  if (!serverId)
    return res.json({ message: "Invalid request" }, { status: 400 });

  await prisma.server.delete({
    where: {
      id: serverId,
      profileId: profile.id,
    },
  });

  return res.json({ message: "Server Deleted!" }, { status: 200 });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const profile = await currentProfile();
  const body = await req.json();
  const response = serverSchema.safeParse(body);

  const { serverId } = params;

  if (!profile) {
    return res.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!serverId)
    return res.json({ message: "Invalid request" }, { status: 400 });

  if (!response.success) {
    const { errors } = response.error;
    return res.json({ message: "Invalid request", errors }, { status: 400 });
  }

  const { name, imageUrl } = response.data;

  const server = await prisma.server.update({
    where: {
      id: serverId,
      profileId: profile.id,
    },
    data: { name, imageUrl },
  });

  return res.json(server, { status: 200 });
}
