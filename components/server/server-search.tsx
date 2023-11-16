"use client";

import { Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";

type CLickEvent = {
  id: string;
  type: "channel" | "member";
};

type Data = {
  icon: ReactNode;
  name: string;
  id: string;
};

interface Props {
  data: {
    label: string;
    type: "channel" | "member";
    data: Data[] | undefined;
  }[];
}

export default function ServerSearch({ data }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams() as { serverId: string | null };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prevState) => !prevState);
      }
    };

    window.addEventListener("keydown", down);

    return () => window.removeEventListener("keydown", down);
  }, []);

  const onCLick = useCallback(
    ({ id, type }: CLickEvent) => {
      setOpen(false);

      if (type === "member")
        return router.push(`/servers/${params?.serverId}/conversations/${id}`);

      if (type === "channel")
        return router.push(`/servers/${params?.serverId}/channels/${id}`);
    },
    [params?.serverId, router],
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
      >
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          Search
        </p>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
          <span className="text-xs">⌘</span>K
        </kbd>

        {/* TODO: Adding CommandDialog */}
      </button>
    </>
  );
}
