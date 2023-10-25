"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import React from "react";

type HandleIfPDFProps = {
  value: string;
  onChange: (url?: string) => void;
  fileType: string;
};

const FileType = ({ onChange, value, fileType }: HandleIfPDFProps) => (
  <section
    className={
      fileType === "pdf"
        ? "relative flex items-center p-2 mt-2 rounded-md bg-background/10"
        : "relative h-20 w-20"
    }
  >
    {fileType === "pdf" ? (
      <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
    ) : (
      <Image src={value} alt="Upload" className="rounded-full" />
    )}

    {fileType === "pdf" && (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
      >
        {value}
      </a>
    )}

    <button
      onClick={() => onChange("")}
      className={`bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm ${
        fileType === "pdf" ? "-top-2 -right-2" : "top-0 right-0"
      }`}
      type="button"
    >
      <X className="h-4 w-4" />
    </button>
  </section>
);

export default FileType;
