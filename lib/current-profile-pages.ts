import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

import prisma from "@/lib/db";

export default async function currentProfilePages(req: NextApiRequest) {
  const { userId } = getAuth(req);

  if (!userId) return null;

  return prisma.profile.findUnique({
    where: {
      userId,
    },
  });
}
