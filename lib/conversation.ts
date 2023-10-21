import prisma from "@/lib/db";

export async function getOrCreateConversation(
  memberOneId: string,
  memberTwoId: string,
) {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));

  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId);
  }

  return conversation;
}

async function findConversation(memberOneId: string, memberTwoId: string) {
  try {
    return await prisma.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: { include: { profile: true } },
        memberTwo: { include: { profile: true } },
      },
    });
  } catch (error) {
    throw new Error("Error find conversation");
  }
}

async function createNewConversation(memberOneId: string, memberTwoId: string) {
  try {
    return await prisma.conversation.create({
      data: { memberOneId, memberTwoId },
      include: {
        memberOne: { include: { profile: true } },
        memberTwo: { include: { profile: true } },
      },
    });
  } catch (error) {
    throw new Error("Error creating conversation");
  }
}
