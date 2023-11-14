"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import ActionTooltip from "@/components/action-tooltip";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  imageUrl: string;
  name: string;
}

export default function NavigationItem({ id, name, imageUrl }: Props) {
  const params = useParams() as { serverId: string | null };
  const router = useRouter();

  return (
    <ActionTooltip side="right" label={name} align="center">
      <button
        type="button"
        onClick={() => router.push(`/server/${id}`)}
        className="group relative flex items-center"
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]",
          )}
        />

        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]",
          )}
        >
          <Image
            fill
            src={imageUrl}
            alt={name}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </button>
    </ActionTooltip>
  );
}
