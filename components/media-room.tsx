import { useState } from "react";

interface Props {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export default function MediaRoom({ chatId, video, audio }: Props) {
  const [item, setItem] = useState(null);

  return (
    <div>
      <p>MediaRoom</p>
    </div>
  );
}
