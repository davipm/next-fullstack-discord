import { auth } from "@clerk/nextjs";

import prisma from "@/lib/db";

export default async function currentProfile() {
  const { userId } = auth();

  if (!userId) return null;

  return prisma.profile.findUnique({ where: { userId } });
}
