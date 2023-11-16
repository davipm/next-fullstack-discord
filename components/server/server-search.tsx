"use client";

import { useState } from "react";

interface Props {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}

export default function ServerSearch({ data }: Props) {
  const [item, setItem] = useState(null);

  return (
    <div>
      <p>ServerSearch</p>
    </div>
  );
}
