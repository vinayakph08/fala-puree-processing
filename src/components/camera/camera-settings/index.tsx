"use client";

import { FC, useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { CameraSettings, ExtendedCapabilities } from "@/types/media-track";

interface CameraSettingsProps {
  open: boolean;
  onClose: () => void;
  settings: CameraSettings;
  capabilities: ExtendedCapabilities | null;
  onApply: (settings: CameraSettings) => void;
}

function SettingRow({
  label,
  hint,
  supported,
  children,
}: {
  label: string;
  hint?: string;
  supported: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-2 ${!supported ? "opacity-50" : ""}`}>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        {!supported && (
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Not supported
          </span>
        )}
        {supported && hint && (
          <span className="text-[10px] text-muted-foreground">{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}

export const CameraSettingsPanel: FC<CameraSettingsProps> = ({
  open,
  onClose,
  settings,
  capabilities,
  onApply,
}) => {
  const [draft, setDraft] = useState<CameraSettings>(settings);

  // Always-current ref so event handlers don't close over stale state
  const draftRef = useRef<CameraSettings>(draft);
  draftRef.current = draft;

  // Sync draft when settings change externally (e.g. defaults applied on stream start)
  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const caps = capabilities;
  const unsupported = caps === null;

  // Fires on slider mouseup/touchend — avoids spamming applyConstraints during drag
  const applyLatest = useCallback(() => {
    onApply(draftRef.current);
  }, [onApply]);

  const handleResetToAuto = () => {
    const reset: CameraSettings = {
      ...draftRef.current,
      whiteBalanceMode: "auto",
      exposureMode: "auto",
    };
    setDraft(reset);
    onApply(reset);
  };

  // White Balance
  const wbSupported = !unsupported && (caps.whiteBalanceMode?.length ?? 0) > 0;
  const wbManual = draft.whiteBalanceMode === "manual";
  const ctSupported = wbSupported && !!caps?.colorTemperature;
  const ctMin = caps?.colorTemperature?.min ?? 500;
  const ctMax = caps?.colorTemperature?.max ?? 8500;
  const ctStep = caps?.colorTemperature?.step ?? 100;
  const ctPercent =
    ctMax > ctMin
      ? Math.round(((draft.colorTemperature - ctMin) / (ctMax - ctMin)) * 100)
      : 0;

  // Exposure
  // Cap slider max at 330 units (33ms = 1/30s) so the live viewfinder stays
  // at ≥30fps. The physical sensor cannot expose faster than exposureTime per
  // frame — dragging to the camera's raw max (often 10 000+) freezes the feed.
  const VIEWFINDER_SAFE_MAX_EXPOSURE = 330;
  const expSupported = !unsupported && (caps.exposureMode?.length ?? 0) > 0;
  const expManual = draft.exposureMode === "manual";
  const etSupported = expSupported && !!caps?.exposureTime;
  const etMin = caps?.exposureTime?.min ?? 100;
  const etMax = Math.min(
    caps?.exposureTime?.max ?? VIEWFINDER_SAFE_MAX_EXPOSURE,
    VIEWFINDER_SAFE_MAX_EXPOSURE,
  );
  const etStep = caps?.exposureTime?.step ?? 10;
  const etMs = Math.round(draft.exposureTime * 0.1);
  const etFps =
    draft.exposureTime > 0
      ? Math.min(60, Math.round(10000 / draft.exposureTime))
      : 0;
  const etShutter =
    draft.exposureTime > 0
      ? `≈ 1/${Math.round(10000 / draft.exposureTime)}s  ·  ${etFps}fps`
      : "";

  // ISO
  const isoSupported = !unsupported && !!caps?.iso;
  const isoMin = caps?.iso?.min ?? 50;
  const isoMax = caps?.iso?.max ?? 3200;
  const isoStep = caps?.iso?.step ?? 50;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl max-h-[85dvh] flex flex-col p-0"
      >
        {/* Sticky header */}
        <SheetHeader className="flex-none px-4 pt-5 pb-3 border-b border-border">
          <SheetTitle className="text-lg font-bold">Camera Settings</SheetTitle>
          <p className="text-xs text-muted-foreground">
            Manual controls for standardized QC captures
          </p>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {unsupported && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
              <p className="text-sm font-medium text-amber-800">
                Manual camera controls are not supported on this device.
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Results may vary due to automatic exposure and white balance
                adjustments.
              </p>
            </div>
          )}
          {/* White Balance */}
          <SettingRow
            label="White Balance"
            supported={wbSupported}
            hint={
              wbManual && wbSupported ? `${draft.colorTemperature}K` : "Auto"
            }
          >
            <div className="flex items-center gap-3">
              <Switch
                id="wb-mode"
                disabled={!wbSupported}
                checked={wbManual}
                onCheckedChange={(checked) => {
                  const next: CameraSettings = {
                    ...draftRef.current,
                    whiteBalanceMode: checked ? "manual" : "auto",
                  };
                  setDraft(next);
                  onApply(next);
                }}
              />
              <Label htmlFor="wb-mode" className="text-sm">
                {wbManual ? "Manual" : "Auto"}
              </Label>
            </div>

            {/* Colour Temperature slider */}
            {wbSupported && (
              <div className="space-y-1.5">
                <Slider
                  min={ctMin}
                  max={ctMax}
                  step={ctStep}
                  value={[draft.colorTemperature]}
                  disabled={!wbManual || !ctSupported}
                  onValueChange={([v]) =>
                    setDraft((d) => ({ ...d, colorTemperature: v }))
                  }
                  onValueCommit={applyLatest}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
                  <span>Warm {ctMin}K</span>
                  <span className="font-semibold text-foreground">
                    {ctPercent}% — {draft.colorTemperature}K
                  </span>
                  <span>Cool {ctMax}K</span>
                </div>
              </div>
            )}
          </SettingRow>

          <div className="h-px bg-border" />

          {/* Exposure */}
          <SettingRow
            label="Exposure"
            supported={expSupported}
            hint={expManual && expSupported ? `${etMs}ms ${etShutter}` : "Auto"}
          >
            <div className="flex items-center gap-3">
              <Switch
                id="exp-mode"
                disabled={!expSupported}
                checked={expManual}
                onCheckedChange={(checked) => {
                  const next: CameraSettings = {
                    ...draftRef.current,
                    exposureMode: checked ? "manual" : "auto",
                  };
                  setDraft(next);
                  onApply(next);
                }}
              />
              <Label htmlFor="exp-mode" className="text-sm">
                {expManual ? "Manual" : "Auto"}
              </Label>
            </div>

            {expSupported && (
              <div className="space-y-1.5">
                <Slider
                  min={etMin}
                  max={etMax}
                  step={etStep}
                  value={[draft.exposureTime]}
                  disabled={!expManual || !etSupported}
                  onValueChange={([v]) =>
                    setDraft((d) => ({ ...d, exposureTime: v }))
                  }
                  onValueCommit={applyLatest}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
                  <span>{Math.round(etMin * 0.1)}ms</span>
                  <span className="font-semibold text-foreground">
                    {etMs}ms {etShutter}
                  </span>
                  <span>{Math.round(etMax * 0.1)}ms</span>
                </div>
                <p className="text-[10px] text-amber-600 mt-1">
                  Higher exposure = slower frame rate. Max capped at 1/30s to
                  keep preview smooth.
                </p>
              </div>
            )}
          </SettingRow>

          <div className="h-px bg-border" />

          {/* ISO */}
          <SettingRow
            label="ISO"
            supported={isoSupported}
            hint={isoSupported ? `ISO ${draft.iso}` : undefined}
          >
            <Slider
              min={isoMin}
              max={isoMax}
              step={isoStep}
              value={[draft.iso]}
              disabled={!isoSupported}
              onValueChange={([v]) => setDraft((d) => ({ ...d, iso: v }))}
              onValueCommit={applyLatest}
              className="w-full"
            />
            {isoSupported && (
              <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
                <span>ISO {isoMin}</span>
                <span className="font-semibold text-foreground">
                  ISO {draft.iso}
                </span>
                <span>ISO {isoMax}</span>
              </div>
            )}
          </SettingRow>
        </div>

        {/* Sticky footer */}
        <div className="flex-none flex gap-3 px-4 py-4 border-t border-border">
          <Button
            variant="ghost"
            className="flex-1 min-h-[44px]"
            onClick={handleResetToAuto}
            disabled={unsupported}
          >
            Reset to Auto
          </Button>
          <Button
            variant="outline"
            className="flex-1 min-h-[44px]"
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
