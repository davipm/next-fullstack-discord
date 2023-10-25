"use client";

import FileType from "@/components/file-type";
import { UploadDropzone } from "@/lib/uploadthing";

interface Props {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

export default function FileUpload({ endpoint, ...rest }: Props) {
  const fileType = rest.value.split(".").pop();

  if (rest.value && fileType) return <FileType {...rest} fileType={fileType} />;

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        rest.onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
}
