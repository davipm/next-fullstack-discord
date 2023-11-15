import { ChannelType, MemberRole } from "@prisma/client";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { redirect } from "next/navigation";

import ServerChannel from "@/components/server/server-channel";
import ServerHeader from "@/components/server/server-header";
import ServerMember from "@/components/server/server-member";
import ServerSearch from "@/components/server/server-search";
import ServerSection from "@/components/server/server-section";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import currentProfile from "@/lib/current-profile";

interface Props {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

export default async function ServerSidebar({ serverId }: Props) {
  const profile = await currentProfile();

  if (!profile) return redirect("/");

  return (
    <div>
      <p>ServerSidebar</p>
    </div>
  );
}
