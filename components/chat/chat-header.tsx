import { Hash } from "lucide-react";

import ChatVideoButton from "@/components/chat/chat-video-button";
import MobileToggle from "@/components/mobile-toggle";
import SocketIndicator from "@/components/socket-indicator";
import UserAvatar from "@/components/user-avatar";

interface Props {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

export default function ChatHeader({ serverId, imageUrl, name, type }: Props) {
  return (
    <header className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )}
      <p className="font-semibold text-base text-black dark:text-white">
        {name}
      </p>
      <div>{type === "conversation" && <ChatVideoButton />}</div>
      <SocketIndicator />
    </header>
  );
}
