import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface EpoxyMixForm {
  employee: string;
  partA: string;
  partB: string;
  ratio: string;
  checkType: "startup" | "shutdown" | "daily";
  notes: string;
}

const Index = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ratioStatus, setRatioStatus] = useState<"ok" | "out-of-range" | null>(null);
  
  const { register, handleSubmit, watch, reset, setValue } = useForm<EpoxyMixForm>({
    defaultValues: {
      employee: "",
      partA: "",
      partB: "",
      ratio: "",
      checkType: "daily",
      notes: "",
    },
  });

  const partA = watch("partA");
  const partB = watch("partB");

  const calculateRatio = () => {
    const a = parseFloat(partA);
    const b = parseFloat(partB);
    
    if (!isNaN(a) && !isNaN(b) && b !== 0) {
      const ratio = (a / b).toFixed(2);
      setValue("ratio", ratio);
      
      const ratioValue = a / b;
      if (ratioValue >= 2 && ratioValue <= 4) {
        setRatioStatus("ok");
      } else {
        setRatioStatus("out-of-range");
      }
    } else {
      setValue("ratio", "");
      setRatioStatus(null);
    }
  };

  const onSubmit = async (data: EpoxyMixForm) => {
    setIsSubmitting(true);
    
    try {
      const uuid = crypto.randomUUID();
      const timestamp = new Date().toISOString();
      
      const { error } = await supabase.from("EpoxyMix").insert({
        UUID: uuid,
        Timestamp: timestamp,
        Employee: parseInt(data.employee) || null,
        "Part A": data.partA,
        "Part B": data.partB,
        Ratio: data.ratio,
        "Daily Check": data.checkType === "daily" ? data.notes : null,
        Startup: data.checkType === "startup" ? data.notes : null,
        Shutdown: data.checkType === "shutdown" ? data.notes : null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Epoxy mix record saved successfully",
      });
      
      reset();
      setRatioStatus(null);
    } catch (error) {
      console.error("Error saving record:", error);
      toast({
        title: "Error",
        description: "Failed to save record. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 border-l-4 border-amber-500 bg-zinc-800 p-4">
          <h1 className="text-2xl font-bold uppercase tracking-wider text-amber-500">
            Epoxy Mix Tracking
          </h1>
          <p className="mt-1 text-sm text-zinc-400">Production Quality Control</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="employee" className="text-sm font-medium uppercase tracking-wide text-zinc-300">
              Employee ID
            </Label>
            <Input
              id="employee"
              type="number"
              placeholder="Enter employee ID"
              className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500"
              {...register("employee", { required: true })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partA" className="text-sm font-medium uppercase tracking-wide text-zinc-300">
                Part A (Resin)
              </Label>
              <Input
                id="partA"
                type="text"
                placeholder="Amount"
                className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500"
                {...register("partA")}
                onBlur={calculateRatio}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partB" className="text-sm font-medium uppercase tracking-wide text-zinc-300">
                Part B (Hardener)
              </Label>
              <Input
                id="partB"
                type="text"
                placeholder="Amount"
                className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500"
                {...register("partB")}
                onBlur={calculateRatio}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium uppercase tracking-wide text-zinc-300">
              Calculated Ratio
            </Label>
            <div className={`flex items-center gap-3 rounded-md border p-3 ${
              ratioStatus === "out-of-range" 
                ? "border-red-500 bg-red-950/50" 
                : ratioStatus === "ok"
                ? "border-green-500 bg-green-950/50"
                : "border-zinc-700 bg-zinc-800"
            }`}>
              <Input
                type="text"
                readOnly
                placeholder="--"
                className="border-0 bg-transparent text-xl font-mono text-zinc-100 focus:ring-0"
                {...register("ratio")}
              />
              {ratioStatus === "out-of-range" && (
                <div className="flex items-center gap-2 text-red-500">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm font-bold uppercase">Out of Range</span>
                </div>
              )}
              {ratioStatus === "ok" && (
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-bold uppercase">OK</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium uppercase tracking-wide text-zinc-300">
              Check Type
            </Label>
            <RadioGroup
              defaultValue="daily"
              onValueChange={(value) => setValue("checkType", value as "startup" | "shutdown" | "daily")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="startup" id="startup" className="border-zinc-500 text-amber-500" />
                <Label htmlFor="startup" className="cursor-pointer text-zinc-300">Startup</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="shutdown" id="shutdown" className="border-zinc-500 text-amber-500" />
                <Label htmlFor="shutdown" className="cursor-pointer text-zinc-300">Shutdown</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" className="border-zinc-500 text-amber-500" />
                <Label htmlFor="daily" className="cursor-pointer text-zinc-300">Daily Check</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium uppercase tracking-wide text-zinc-300">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Enter any observations or notes..."
              className="min-h-[100px] border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500"
              {...register("notes")}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 py-6 text-lg font-bold uppercase tracking-wider text-zinc-900 hover:bg-amber-400 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Submit Record"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Index;
