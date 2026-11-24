import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, SendHorizontal } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import IUser from "@/interfaces/user";
import useMessageSocket from "@/hooks/useMessageSocket";
import { uploadFile } from "@/services/cloudinary";
import {
  MAX_FILE_SIZE,
  MAX_FILES,
  getCloudinaryType,
  getMessageFileType,
} from "@/utils/file";
import Emoji from "./Emoji";
import Attach from "./Attach";
import AttachmentItem, { type PendingFile } from "./AttachmentItem";

const MAX_HEIGHT = 160;

interface Props {
  receiver: IUser;
  className?: string;
}

function MessageComposer({ receiver, className }: Props) {
  const { sendMessageDirect } = useMessageSocket();
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingFilesRef = useRef(pendingFiles);
  pendingFilesRef.current = pendingFiles;

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_HEIGHT)}px`;
  }, [value]);

  const handleSelectFiles = useCallback(
    (files: File[]) => {
      const valid = files.filter((file) => {
        if (file.size <= MAX_FILE_SIZE) return true;
        toast.error(
          t("chat.composer.fileTooLarge", {
            name: file.name,
            size: MAX_FILE_SIZE / (1024 * 1024),
          }),
        );
        return false;
      });

      const room = Math.max(MAX_FILES - pendingFilesRef.current.length, 0);
      if (valid.length > room) {
        toast.error(t("chat.composer.tooManyFiles", { max: MAX_FILES }));
      }

      const next: PendingFile[] = valid.slice(0, room).map((file) => ({
        id: crypto.randomUUID(),
        file,
        type: getMessageFileType(file),
      }));

      if (next.length) setPendingFiles((prev) => [...prev, ...next]);
      textareaRef.current?.focus();
    },
    [t],
  );

  const handleRemoveFile = useCallback((id: string) => {
    setPendingFiles((prev) => prev.filter((file) => file.id !== id));
  }, []);

  const handleSend = useCallback(async () => {
    const text = value.trim();
    if ((!text && !pendingFiles.length) || isUploading) return;

    try {
      setIsUploading(true);
      const files = await Promise.all(
        pendingFiles.map(async ({ file, type }) => {
          const result = await uploadFile(file, getCloudinaryType(type));
          return { type, url: result.secure_url, name: file.name };
        }),
      );

      sendMessageDirect(receiver._id || "", text, files);
      setPendingFiles([]);
      setValue("");
    } catch {
      toast.error(t("chat.composer.uploadFailed"));
    } finally {
      setIsUploading(false);
      textareaRef.current?.focus();
    }
  }, [value, pendingFiles, isUploading, receiver._id, sendMessageDirect, t]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const canSend =
    (value.trim().length > 0 || pendingFiles.length > 0) && !isUploading;

  return (
    <div className={cn("px-4 pb-4 sm:px-6", className)}>
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-3xl border border-border bg-secondary/60 transition-colors focus-within:border-ring/60 focus-within:bg-card">
          {pendingFiles.length > 0 && (
            <div className="flex min-w-0 gap-2 overflow-x-auto px-3 pt-3">
              {pendingFiles.map((item) => (
                <AttachmentItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemoveFile}
                  disabled={isUploading}
                />
              ))}
            </div>
          )}

          <div className="flex items-end gap-1.5 p-1.5">
            <Attach onSelect={handleSelectFiles} disabled={isUploading} />

            <Textarea
              ref={textareaRef}
              rows={1}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("chat.composer.placeholder", {
                name: receiver.name,
              })}
              aria-label={t("chat.composer.placeholder", {
                name: receiver.name,
              })}
              className="min-h-9 resize-none border-none bg-transparent py-2 text-[14px] shadow-none focus-visible:ring-0 dark:bg-transparent"
            />

            <Emoji
              value={value}
              setValue={setValue}
              textareaRef={textareaRef}
            />

            <Button
              type="button"
              size="icon"
              onClick={handleSend}
              disabled={!canSend}
              aria-label={
                isUploading
                  ? t("chat.composer.uploading")
                  : t("chat.composer.send")
              }
              className="rounded-full transition-transform active:scale-95"
            >
              {isUploading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <SendHorizontal />
              )}
            </Button>
          </div>
        </div>

        <p className="mt-2 px-4 text-[11px] text-muted-foreground">
          {t("chat.composer.hint")}
        </p>
      </div>
    </div>
  );
}

export default MessageComposer;
