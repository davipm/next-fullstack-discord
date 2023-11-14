"use client";

import { useState } from "react";

type Props = {
  serverId: string;
};

//TODO: finish the component ServerSidebar
export default function ServerSidebar({ serverId }: Props) {
  const [item, setItem] = useState(null);

  return (
    <div>
      <p>ServerSidebar</p>
    </div>
  );
}
