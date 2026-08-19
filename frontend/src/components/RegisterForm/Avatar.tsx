import { useCallback, useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Avatar as AvatarPrimitive, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getCroppedImg } from "@/utils/cropImage";
import { defaultAvatar } from "@/constants";

interface AvatarProps {
  src: string | null;
  className?: string;
  onCropConfirm: (file: File, previewUrl: string) => void;
  onCropCancel?: () => void;
}

function Avatar({ src, className, onCropConfirm, onCropCancel }: AvatarProps) {
  const { t } = useTranslation();
  const rawSrcRef = useRef<string | null>(null);
  const [displaySrc, setDisplaySrc] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (src && src !== rawSrcRef.current) {
      rawSrcRef.current = src;
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setDialogOpen(true);
    }
  }, [src]);

  const handleCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) onCropCancel?.();
  };

  const handleConfirm = async () => {
    if (!rawSrcRef.current || !croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const { file, previewUrl } = await getCroppedImg(
        rawSrcRef.current,
        croppedAreaPixels,
      );
      rawSrcRef.current = previewUrl;
      setDisplaySrc((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return previewUrl;
      });
      onCropConfirm(file, previewUrl);
      setDialogOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <AvatarPrimitive className="size-28">
        <AvatarImage src={displaySrc || defaultAvatar} alt="Avatar preview" />
      </AvatarPrimitive>

      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("auth.register.cropTitle")}</DialogTitle>
            <DialogDescription>
              {t("auth.register.cropDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="relative h-72 w-full overflow-hidden rounded-lg bg-muted">
            {rawSrcRef.current && (
              <Cropper
                image={rawSrcRef.current}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            )}
          </div>

          <div className="flex items-center gap-3 px-1">
            <span className="text-sm text-muted-foreground">{t("common.zoom")}</span>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={([value]) => setZoom(value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isProcessing}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!croppedAreaPixels || isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                t("common.save")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Avatar;
