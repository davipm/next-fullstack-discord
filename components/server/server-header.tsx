"use client";

import { MemberRole } from "@prisma/client";
import { useState } from "react";

import { ServerWithMembersWithProfiles } from "@/types";

interface Props {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export default function ServerHeader({ server, role }: Props) {
  const [item, setItem] = useState(null);

  return (
    <div>
      <p>ServerHeader</p>
    </div>
  );
}
