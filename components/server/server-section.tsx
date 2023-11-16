"use client";

import { ChannelType, MemberRole } from "@prisma/client";
import { useState } from "react";

import { ServerWithMembersWithProfiles } from "@/types";

interface Props {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

export default function ServerSection({
  label,
  server,
  sectionType,
  channelType,
  role,
}: Props) {
  const [item, setItem] = useState(null);

  return (
    <div>
      <p>ServerSection</p>
    </div>
  );
}
