"use client";

import { Channel, MemberRole, Server } from "@prisma/client";
import { useState } from "react";

interface Props {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

export default function ServerChannel({ server, channel, role }: Props) {
  const [item, setItem] = useState(null);

  return (
    <div>
      <p>ServerChannel</p>
    </div>
  );
}
