"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrigin } from "@/hooks/use-origin";
import { useModal } from "@/store";

export default function InviteModal() {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === "invite";
  const { server } = data;

  const [copied, setCopied] = useState(false);
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl).then(() => console.log("copy"));
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: () => {
      return axios.patch(`/api/servers/${server?.id}/invite-code`);
    },
    onSuccess: (data: { data: any }) => {
      onOpen("invite", { server: data.data });
    },
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <Label className="uppercase text-sm font-bold text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>

          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              value={inviteUrl}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
            />

            <Button onClick={onCopy} disabled={isLoading} size="icon">
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          <Button
            onClick={() => mutate()}
            disabled={isLoading}
            size="sm"
            className="text-sm text-zinc-500 mt-4"
          >
            Generate a new link
            <RefreshCw className="w-4 h-4 ml-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
