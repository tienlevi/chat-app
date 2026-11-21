import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Download, ExternalLink, Play } from "lucide-react";

import { MessageFile } from "@/interfaces/message";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { downloadFile, fileName } from "@/utils/file";
import { FILE_ICON } from "@/constants/files";

interface Props {
  file: MessageFile;
  isOwn: boolean;
}

interface MediaDialogProps {
  url: string;
  name: string;
  description: string;
  trigger: ReactNode;
  children: ReactNode;
}

function MediaDialog({
  url,
  name,
  description,
  trigger,
  children,
}: MediaDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={t("chat.attachment.view", { name })}
          className="group relative overflow-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {trigger}
        </button>
      </DialogTrigger>

      <DialogContent className="gap-3 p-3 sm:max-w-3xl">
        <DialogHeader className="pr-8">
          <DialogTitle className="truncate text-sm">{name}</DialogTitle>
          <DialogDescription className="sr-only">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center overflow-hidden rounded-lg bg-black">
          {children}
        </div>

        <DialogFooter className="flex-row justify-end gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={url} target="_blank" rel="noreferrer">
              <ExternalLink />
              {t("chat.attachment.open")}
            </a>
          </Button>
          <Button size="sm" onClick={() => downloadFile(url, name)}>
            <Download />
            {t("chat.attachment.download")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MessageFiles({ file, isOwn }: Props) {
  const { t } = useTranslation();
  const name = fileName(file.url);

  const renderFile = () => {
    const Icon = FILE_ICON[file.type];

    switch (file.type) {
      case "image":
        return (
          <MediaDialog
            url={file.url}
            name={name}
            description={t("chat.attachment.image")}
            trigger={
              <img
                src={file.url}
                alt={name}
                loading="lazy"
                className="h-full w-full max-w-80 object-cover transition-opacity group-hover:opacity-90"
              />
            }
          >
            <img
              src={file.url}
              alt={name}
              className="max-h-[75vh] w-auto object-contain"
            />
          </MediaDialog>
        );

      case "video":
        return (
          <MediaDialog
            url={file.url}
            name={name}
            description={t("chat.attachment.video")}
            trigger={
              <>
                <video
                  src={file.url}
                  preload="metadata"
                  muted
                  className="max-h-60 w-full max-w-80 object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
                  <span className="flex size-11 items-center justify-center rounded-full bg-black/60 text-white">
                    <Play className="size-5 fill-current" />
                  </span>
                </span>
              </>
            }
          >
            <video
              src={file.url}
              controls
              autoPlay
              className="max-h-[75vh] w-full"
            />
          </MediaDialog>
        );

      case "file":
        return (
          <li key={file._id}>
            <button
              type="button"
              onClick={() => downloadFile(file.url, name)}
              aria-label={t("chat.attachment.downloadFile", { name })}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-opacity hover:opacity-90",
                isOwn ? "bg-black/15" : "bg-background/70",
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg",
                  isOwn ? "bg-black/20" : "bg-secondary",
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 truncate text-[13px] font-medium">
                {name}
              </span>
              <Download className="ml-auto size-4 shrink-0 opacity-70" />
            </button>
          </li>
        );
    }
  };

  return renderFile();
}

export default MessageFiles;
