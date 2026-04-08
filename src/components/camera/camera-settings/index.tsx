"use client";

import { FC, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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

  // Sync draft when settings change externally (e.g. reset from parent)
  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const caps = capabilities;
  const unsupported = caps === null;

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleResetToAuto = () => {
    setDraft((prev) => ({
      ...prev,
      whiteBalanceMode: "auto",
      exposureMode: "auto",
    }));
  };

  // White Balance
  const wbSupported = !unsupported && (caps.whiteBalanceMode?.length ?? 0) > 0;
  const wbManual = draft.whiteBalanceMode === "manual";
  const ctSupported = wbSupported && !!caps?.colorTemperature;
  const ctMin = caps?.colorTemperature?.min ?? 2500;
  const ctMax = caps?.colorTemperature?.max ?? 7500;
  const ctStep = caps?.colorTemperature?.step ?? 100;
  const ctPercent =
    ctMax > ctMin
      ? Math.round(((draft.colorTemperature - ctMin) / (ctMax - ctMin)) * 100)
      : 0;

  // Exposure
  const expSupported = !unsupported && (caps.exposureMode?.length ?? 0) > 0;
  const expManual = draft.exposureMode === "manual";
  const etSupported = expSupported && !!caps?.exposureTime;
  const etMin = caps?.exposureTime?.min ?? 100;
  const etMax = caps?.exposureTime?.max ?? 1000;
  const etStep = caps?.exposureTime?.step ?? 10;
  const etMs = Math.round(draft.exposureTime * 0.1);
  const etShutter =
    draft.exposureTime > 0
      ? `≈ 1/${Math.round(10000 / draft.exposureTime)}s`
      : "";

  // ISO
  const isoSupported = !unsupported && !!caps?.iso;
  const isoMin = caps?.iso?.min ?? 50;
  const isoMax = caps?.iso?.max ?? 3200;
  const isoStep = caps?.iso?.step ?? 50;

  // Sharpness
  const sharpSupported = !unsupported && !!caps?.sharpness;
  const sharpMin = caps?.sharpness?.min ?? 0;
  const sharpMax = caps?.sharpness?.max ?? 10;
  const sharpStep = caps?.sharpness?.step ?? 1;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl max-h-[85dvh] overflow-y-auto pb-safe"
      >
        <SheetHeader className="mb-4">
          <SheetTitle className="text-lg font-bold">Camera Settings</SheetTitle>
          <p className="text-xs text-muted-foreground -mt-1">
            Manual controls for standardized QC captures
          </p>
        </SheetHeader>

        {/* Unsupported device banner */}
        {unsupported && (
          <div className="mb-5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 mx-4">
            <p className="text-sm font-medium text-amber-800">
              Manual camera controls are not supported on this device.
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Results may vary due to automatic exposure and white balance
              adjustments.
            </p>
          </div>
        )}

        <div className="space-y-6 mx-4">
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
                onCheckedChange={(checked) =>
                  setDraft((d) => ({
                    ...d,
                    whiteBalanceMode: checked ? "manual" : "auto",
                  }))
                }
                className="min-h-[44px]"
              />
              <Label htmlFor="wb-mode" className="text-sm">
                {wbManual ? "Manual" : "Auto"}
              </Label>
            </div>

            {/* Colour Temperature slider */}
            {wbSupported && (
              <div className="space-y-1.5">
                <input
                  type="range"
                  min={ctMin}
                  max={ctMax}
                  step={ctStep}
                  value={draft.colorTemperature}
                  disabled={!wbManual || !ctSupported}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      colorTemperature: Number(e.target.value),
                    }))
                  }
                  className="w-full h-2 accent-primary disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
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
                onCheckedChange={(checked) =>
                  setDraft((d) => ({
                    ...d,
                    exposureMode: checked ? "manual" : "auto",
                  }))
                }
                className="min-h-[44px]"
              />
              <Label htmlFor="exp-mode" className="text-sm">
                {expManual ? "Manual" : "Auto"}
              </Label>
            </div>

            {expSupported && (
              <div className="space-y-1.5">
                <input
                  type="range"
                  min={etMin}
                  max={etMax}
                  step={etStep}
                  value={draft.exposureTime}
                  disabled={!expManual || !etSupported}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      exposureTime: Number(e.target.value),
                    }))
                  }
                  className="w-full h-2 accent-primary disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
                  <span>{Math.round(etMin * 0.1)}ms</span>
                  <span className="font-semibold text-foreground">
                    {etMs}ms {etShutter}
                  </span>
                  <span>{Math.round(etMax * 0.1)}ms</span>
                </div>
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
            <input
              type="range"
              min={isoMin}
              max={isoMax}
              step={isoStep}
              value={draft.iso}
              disabled={!isoSupported}
              onChange={(e) =>
                setDraft((d) => ({ ...d, iso: Number(e.target.value) }))
              }
              className="w-full h-2 accent-primary disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
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

          <div className="h-px bg-border" />

          {/* Sharpness */}
          <SettingRow
            label="Sharpness"
            supported={sharpSupported}
            hint={sharpSupported ? `${draft.sharpness}` : undefined}
          >
            <input
              type="range"
              min={sharpMin}
              max={sharpMax}
              step={sharpStep}
              value={draft.sharpness}
              disabled={!sharpSupported}
              onChange={(e) =>
                setDraft((d) => ({ ...d, sharpness: Number(e.target.value) }))
              }
              className="w-full h-2 accent-primary disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            />
            {sharpSupported && (
              <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
                <span>Low {sharpMin}</span>
                <span className="font-semibold text-foreground">
                  {draft.sharpness}
                </span>
                <span>High {sharpMax}</span>
              </div>
            )}
          </SettingRow>
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 mt-8 pb-2 mx-4">
          <Button
            variant="ghost"
            className="flex-1 min-h-[44px]"
            onClick={handleResetToAuto}
            disabled={unsupported}
          >
            Reset to Auto
          </Button>
          <Button
            className="flex-1 min-h-[44px]"
            onClick={handleApply}
            disabled={unsupported}
          >
            Apply
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
