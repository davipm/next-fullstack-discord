"use client";

import { Member, Profile, Server } from "@prisma/client";
import { useState } from "react";

interface Props {
  member: Member & { profile: Profile };
  server: Server;
}

export default function ServerMember({ server, member }: Props) {
  const [item, setItem] = useState(null);

  return (
    <div>
      <p>ServerMember</p>
    </div>
  );
}
