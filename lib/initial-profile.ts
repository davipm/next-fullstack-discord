import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import prisma from "@/lib/db";

export async function initialProfile() {
  try {
    const user = await currentUser();

    if (!user) return redirectToSignIn();

    const profile = await prisma.profile.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (profile) return profile;

    return prisma.profile.create({
      data: {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });
  } catch (error) {
    throw new Error("Error initial Profile");
  }
}
