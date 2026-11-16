import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useObjectUrl from "@/hooks/useObjectUrl";
import { formatFileSize } from "@/utils/file";
import type { MessageFileType } from "@/interfaces/message";

export interface PendingFile {
  id: string;
  file: File;
  type: MessageFileType;
}

interface Props {
  item: PendingFile;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

function AttachmentItem({ item, onRemove, disabled }: Props) {
  const { t } = useTranslation();
  const { id, file, type } = item;
  const [open, setOpen] = useState(false);
  const previewUrl = useObjectUrl(type === "file" ? null : file);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "group relative shrink-0 overflow-hidden rounded-2xl border border-border bg-card",
          type === "file" ? "h-16 w-48" : "size-16",
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("chat.composer.previewFile", { name: file.name })}
          className={cn(
            "size-full cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-ring",
            type === "file" && "flex items-center gap-2 px-3 text-left",
          )}
        >
          {type === "image" && previewUrl && (
            <img
              src={previewUrl}
              alt={file.name}
              className="size-full object-cover"
            />
          )}
          {type === "video" && previewUrl && (
            <video src={previewUrl} muted className="size-full object-cover" />
          )}
          {type === "file" && (
            <>
              <FileText className="size-6 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{file.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </>
          )}
        </button>

        <Button
          type="button"
          size="icon"
          variant="secondary"
          disabled={disabled}
          onClick={() => onRemove(id)}
          aria-label={t("chat.composer.removeFile", { name: file.name })}
          className="absolute top-1 right-1 size-5 rounded-full shadow-sm"
        >
          <X className="size-3" />
        </Button>
      </div>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader className="pr-6">
          <DialogTitle className="truncate">{file.name}</DialogTitle>
          <DialogDescription>{formatFileSize(file.size)}</DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[70vh] items-center justify-center overflow-hidden rounded-xl bg-muted">
          {type === "image" && previewUrl && (
            <img
              src={previewUrl}
              alt={file.name}
              className="max-h-[70vh] w-auto object-contain"
            />
          )}
          {type === "video" && previewUrl && (
            <video
              src={previewUrl}
              controls
              autoPlay
              className="max-h-[70vh] w-full"
            />
          )}
          {type === "file" && (
            <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <FileText className="size-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {t("chat.composer.noPreview")}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AttachmentItem;
