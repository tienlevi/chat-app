import { useState } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import useObjectUrl from "@/hooks/useObjectUrl";
import { getCroppedImg } from "@/utils/cropImage";

interface Props {
  file: File;
  onCancel: () => void;
  onConfirm: (file: File) => void;
}

function AvatarCropStep({ file, onCancel, onConfirm }: Props) {
  const { t } = useTranslation();
  const imageUrl = useObjectUrl(file);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    if (!imageUrl || !area) return;
    setIsProcessing(true);
    try {
      const { file: cropped, previewUrl } = await getCroppedImg(imageUrl, area);
      URL.revokeObjectURL(previewUrl);
      onConfirm(cropped);
    } catch {
      toast.error(t("chat.profile.invalidImage"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("auth.register.cropTitle")}</DialogTitle>
        <DialogDescription>{t("auth.register.cropDescription")}</DialogDescription>
      </DialogHeader>

      <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-muted">
        {imageUrl && (
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setArea(pixels)}
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
          className="rounded-xl"
          onClick={onCancel}
          disabled={isProcessing}
        >
          {t("common.back")}
        </Button>
        <Button
          type="button"
          className="rounded-xl"
          onClick={handleConfirm}
          disabled={!area || isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            t("common.apply")
          )}
        </Button>
      </DialogFooter>
    </>
  );
}

export default AvatarCropStep;
