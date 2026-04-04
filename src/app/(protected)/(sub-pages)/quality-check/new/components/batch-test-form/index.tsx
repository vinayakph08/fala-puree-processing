"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ChevronUp,
  ChevronDown,
  Droplets,
  FlaskConical,
  Palette,
  Flame,
  QrCode,
  UtensilsCrossed,
  Camera as CameraIcon,
} from "lucide-react";
import { Camera } from "@/components/camera";
import type { LabValues } from "@/components/camera/capture-confirmation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateQualityTestFormValues, createQualityTestSchema } from "@/app/(protected)/(main-pages)/quality-check/utils";
import { createQualityTestAction } from "../../server-actions";
import { generateBatchId } from "../../utils";

// ── Status chip ──────────────────────────────────────────────────────────────

type CaptureStatus = "captured" | "to-capture" | "manual-entry";

function getStatus(value: number | null | undefined): CaptureStatus {
  if (value !== null && value !== undefined && value !== 0) return "captured";
  return "to-capture";
}

function StatusChip({ status }: { status: CaptureStatus }) {
  if (status === "captured")
    return (
      <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
        Captured
      </span>
    );
  if (status === "manual-entry")
    return (
      <span className="border border-orange-400 text-orange-500 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
        Manual Entry
      </span>
    );
  return (
    <span className="border border-gray-300 text-gray-500 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-gray-400 inline-block" />
      To Capture
    </span>
  );
}

// ── Parameter card ────────────────────────────────────────────────────────────

interface ParameterCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  status: CaptureStatus;
  capturedLabel?: string;
  children: React.ReactNode;
}

function ParameterCard({
  icon,
  title,
  subtitle,
  status,
  capturedLabel,
  children,
}: ParameterCardProps) {
  const [expanded, setExpanded] = useState(status !== "captured");

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center gap-3 p-4 min-h-[72px]"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
          {icon}
        </div>
        <div className="flex-1 text-left">
          <p className="font-semibold text-sm text-gray-900">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusChip status={status} />
          {status === "captured" && capturedLabel && (
            <span className="text-xs text-gray-500 font-medium">
              {capturedLabel}
            </span>
          )}
        </div>
      </button>
      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────

export function BatchTestForm() {
  const router = useRouter();
  const [cookingExpanded, setCookingExpanded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // useState lazy initializer runs exactly once — safe in React Strict Mode.
  // Never generate the ID inside useEffect; effects run twice in dev (Strict Mode)
  // which would increment the localStorage counter by 2.
  const [initialBatchId] = useState(() => generateBatchId());

  const form = useForm<CreateQualityTestFormValues>({
    resolver: zodResolver(createQualityTestSchema),
    defaultValues: {
      batch_id: initialBatchId,
      production_line: "",
      color_l: undefined,
      color_a: undefined,
      color_b: undefined,
      texture_brix: undefined,
      viscosity_cp: undefined,
      taste_flavour_score: undefined,
      cooking_color_score: undefined,
      cooking_taste_score: undefined,
      cooking_notes: "",
    },
  });

  const watchColor = form.watch(["color_l", "color_a", "color_b"]);
  const watchTexture = form.watch("texture_brix");
  const watchViscosity = form.watch("viscosity_cp");
  const watchTaste = form.watch("taste_flavour_score");
  const watchCookingColor = form.watch("cooking_color_score");
  const watchCookingTaste = form.watch("cooking_taste_score");

  const colorStatus = getStatus(watchColor[0]);
  const colorLabel =
    watchColor[0] != null
      ? `L: ${watchColor[0]}, a: ${watchColor[1] ?? "–"}, b: ${watchColor[2] ?? "–"}`
      : undefined;

  async function handleSubmit(
    values: CreateQualityTestFormValues,
    status: "draft" | "pending",
  ) {
    const setLoading = status === "pending" ? setIsSubmitting : setIsSaving;
    setLoading(true);
    try {
      const { error } = await createQualityTestAction(values, status);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success(
        status === "pending"
          ? "Batch report submitted."
          : "Saved as draft.",
      );
      router.push("/quality-check");
    } finally {
      setLoading(false);
    }
  }

  function handleCameraCapture(_file: File, labValues?: LabValues, textureScore?: number | null) {
    if (labValues) {
      form.setValue("color_l", labValues.l, { shouldValidate: true });
      form.setValue("color_a", labValues.a, { shouldValidate: true });
      form.setValue("color_b", labValues.b, { shouldValidate: true });
    }
    if (textureScore != null) {
      form.setValue("texture_brix", textureScore, { shouldValidate: true });
    }
    toast.success("Color & Texture values captured");
    setIsCameraOpen(false);
  }

  return (
    <>
      <Camera
        isOpen={isCameraOpen}
        onCapture={handleCameraCapture}
        onCancel={() => setIsCameraOpen(false)}
      />
      <Form {...form}>
      <div className="space-y-4 pb-40">
        {/* Batch Identity */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Batch Identity
          </p>
          <FormField
            control={form.control}
            name="batch_id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. SP-20240403-A1"
                    className="text-2xl font-bold h-14 border border-gray-200 rounded-xl placeholder:text-gray-300 placeholder:font-normal placeholder:text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="production_line"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Linked to: Production line / batch name"
                      className="border-0 p-0 h-auto text-sm text-muted-foreground placeholder:text-gray-300 focus-visible:ring-0 shadow-none"
                    />
                    <QrCode className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Mandatory Quality Parameters */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
            Mandatory Quality Parameters
          </p>

          {/* Color Analysis */}
          <ParameterCard
            icon={<Palette className="h-5 w-5" />}
            title="Color Analysis"
            subtitle="L*a*b* colorspace"
            status={colorStatus}
            capturedLabel={colorLabel}
          >
            {/* Camera capture button */}
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="w-full flex items-center justify-center gap-2 min-h-[44px] rounded-xl border border-primary/30 bg-primary/5 text-primary text-sm font-semibold hover:bg-primary/10 transition-colors"
            >
              <CameraIcon className="h-4 w-4" />
              Capture with Camera
            </button>
            <p className="text-[11px] text-muted-foreground text-center -mt-1">
              or enter values manually
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(["color_l", "color_a", "color_b"] as const).map((key, i) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={key}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">
                        {["L*", "a*", "b*"][i]}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="0.0"
                          className="min-h-[44px]"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? null
                                : parseFloat(e.target.value),
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </ParameterCard>

          {/* Texture */}
          <ParameterCard
            icon={<FlaskConical className="h-5 w-5" />}
            title="Texture (Brix)"
            subtitle="Digital Refractometer"
            status={getStatus(watchTexture)}
            capturedLabel={
              watchTexture != null ? `${watchTexture} °Bx` : undefined
            }
          >
            {/* Camera capture removed — texture score is filled automatically when
                the Color Analysis capture button is used (single capture fills both). */}
            <FormField
              control={form.control}
              name="texture_brix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">
                    Brix Value (°Bx)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.0"
                      className="min-h-[44px]"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? null
                            : parseFloat(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </ParameterCard>

          {/* Viscosity */}
          <ParameterCard
            icon={<Droplets className="h-5 w-5" />}
            title="Viscosity"
            subtitle="Bostwick Consistometer"
            status={getStatus(watchViscosity)}
            capturedLabel={
              watchViscosity != null ? `${watchViscosity} cP` : undefined
            }
          >
            <FormField
              control={form.control}
              name="viscosity_cp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">
                    Viscosity (cP)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      className="min-h-[44px]"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? null
                            : parseFloat(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </ParameterCard>

          {/* Taste & Flavour */}
          <ParameterCard
            icon={<UtensilsCrossed className="h-5 w-5" />}
            title="Taste & Flavour"
            subtitle="Sensory Evaluation"
            status={getStatus(watchTaste)}
            capturedLabel={
              watchTaste != null ? `Score: ${watchTaste}` : undefined
            }
          >
            <FormField
              control={form.control}
              name="taste_flavour_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">
                    Score (0–10)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      placeholder="0.0"
                      className="min-h-[44px]"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? null
                            : parseFloat(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </ParameterCard>
        </div>

        {/* Cooking Stress Test */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <button
            type="button"
            className="w-full flex items-center justify-between p-4 min-h-[60px]"
            onClick={() => setCookingExpanded((v) => !v)}
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
                <Flame className="h-5 w-5" />
              </div>
              <span className="font-semibold text-sm text-gray-900">
                Cooking Performance
              </span>
            </div>
            {cookingExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          {cookingExpanded && (
            <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="cooking_color_score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Color Score
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="0.0"
                          className="min-h-[44px]"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? null
                                : parseFloat(e.target.value),
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cooking_taste_score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Taste Score
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="0.0"
                          className="min-h-[44px]"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? null
                                : parseFloat(e.target.value),
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="cooking_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Notes on Cooking
                    </FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Describe aroma and consistency changes..."
                        className="w-full min-h-[96px] resize-none rounded-xl border border-input bg-background px-3 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-gray-200 p-4 space-y-2 md:hidden">
        <Button
          type="button"
          className="w-full min-h-[52px] bg-[#4a7c59] hover:bg-[#3d6a4b] text-white font-bold tracking-wider uppercase rounded-2xl"
          disabled={isSubmitting || isSaving}
          onClick={form.handleSubmit((values) =>
            handleSubmit(values, "pending"),
          )}
        >
          {isSubmitting ? "Submitting..." : "Submit Batch Report"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full min-h-[52px] font-bold tracking-wider uppercase rounded-2xl text-gray-700"
          disabled={isSubmitting || isSaving}
          onClick={form.handleSubmit((values) =>
            handleSubmit(values, "draft"),
          )}
        >
          {isSaving ? "Saving..." : "Save as Draft"}
        </Button>
      </div>

      {/* Desktop CTA (below form, not fixed) */}
      <div className="hidden md:flex flex-col gap-2 mt-8">
        <Button
          type="button"
          className="w-full min-h-[52px] bg-[#4a7c59] hover:bg-[#3d6a4b] text-white font-bold tracking-wider uppercase rounded-2xl"
          disabled={isSubmitting || isSaving}
          onClick={form.handleSubmit((values) =>
            handleSubmit(values, "pending"),
          )}
        >
          {isSubmitting ? "Submitting..." : "Submit Batch Report"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full min-h-[52px] font-bold tracking-wider uppercase rounded-2xl text-gray-700"
          disabled={isSubmitting || isSaving}
          onClick={form.handleSubmit((values) =>
            handleSubmit(values, "draft"),
          )}
        >
          {isSaving ? "Saving..." : "Save as Draft"}
        </Button>
      </div>
    </Form>
    </>
  );
}
