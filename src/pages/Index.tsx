import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle, Send } from "lucide-react";

type CheckType = "startup" | "shutdown" | "daily";

const Index = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employee, setEmployee] = useState("");
  const [partA, setPartA] = useState("");
  const [partB, setPartB] = useState("");
  const [checkType, setCheckType] = useState<CheckType>("daily");
  const [ratioStatus, setRatioStatus] = useState<"ok" | "out-of-range" | null>(null);
  const [ratio, setRatio] = useState("");

  const calculateRatio = (a: string, b: string) => {
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    
    if (!isNaN(aNum) && !isNaN(bNum) && bNum !== 0) {
      const r = (aNum / bNum).toFixed(2);
      setRatio(r);
      const ratioValue = aNum / bNum;
      setRatioStatus(ratioValue >= 2 && ratioValue <= 4 ? "ok" : "out-of-range");
    } else {
      setRatio("");
      setRatioStatus(null);
    }
  };

  const handlePartAChange = (value: string) => {
    setPartA(value);
    calculateRatio(value, partB);
  };

  const handlePartBChange = (value: string) => {
    setPartB(value);
    calculateRatio(partA, value);
  };

  const handleSubmit = async () => {
    if (!employee) {
      toast({ title: "Enter Employee ID", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("EpoxyMix").insert({
        UUID: crypto.randomUUID(),
        Timestamp: new Date().toISOString(),
        Employee: parseInt(employee) || null,
        "Part A": partA,
        "Part B": partB,
        Ratio: ratio,
        "Daily Check": checkType === "daily" ? "Yes" : null,
        Startup: checkType === "startup" ? "Yes" : null,
        Shutdown: checkType === "shutdown" ? "Yes" : null,
      });

      if (error) throw error;

      toast({ title: "✓ Saved!", description: "Record submitted successfully" });
      
      // Reset form
      setEmployee("");
      setPartA("");
      setPartB("");
      setRatio("");
      setRatioStatus(null);
      setCheckType("daily");
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="mx-auto max-w-xl space-y-6">
        {/* Header */}
        <div className="border-l-4 border-amber-500 bg-zinc-800 p-4">
          <h1 className="text-2xl font-bold uppercase tracking-wider text-amber-500">
            Epoxy Mix Log
          </h1>
        </div>

        {/* Employee ID */}
        <div className="space-y-2">
          <label className="text-lg font-medium text-zinc-300">Employee ID</label>
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Enter ID"
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            className="h-16 border-zinc-600 bg-zinc-800 text-2xl text-zinc-100 placeholder:text-zinc-500"
          />
        </div>

        {/* Part A & Part B */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-lg font-medium text-zinc-300">Part A</label>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={partA}
              onChange={(e) => handlePartAChange(e.target.value)}
              className="h-16 border-zinc-600 bg-zinc-800 text-2xl text-zinc-100 placeholder:text-zinc-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-lg font-medium text-zinc-300">Part B</label>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={partB}
              onChange={(e) => handlePartBChange(e.target.value)}
              className="h-16 border-zinc-600 bg-zinc-800 text-2xl text-zinc-100 placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Ratio Display */}
        {ratio && (
          <div className={`flex items-center justify-between rounded-lg border-2 p-4 ${
            ratioStatus === "out-of-range" 
              ? "border-red-500 bg-red-950/50" 
              : "border-green-500 bg-green-950/50"
          }`}>
            <span className="text-3xl font-mono font-bold text-zinc-100">
              Ratio: {ratio}:1
            </span>
            {ratioStatus === "out-of-range" ? (
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-8 w-8" />
                <span className="text-lg font-bold">OUT OF RANGE</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle className="h-8 w-8" />
                <span className="text-lg font-bold">OK</span>
              </div>
            )}
          </div>
        )}

        {/* Check Type Buttons */}
        <div className="space-y-2">
          <label className="text-lg font-medium text-zinc-300">Check Type</label>
          <div className="grid grid-cols-3 gap-3">
            {(["startup", "daily", "shutdown"] as CheckType[]).map((type) => (
              <Button
                key={type}
                type="button"
                onClick={() => setCheckType(type)}
                className={`h-16 text-lg font-bold uppercase ${
                  checkType === type
                    ? "bg-amber-500 text-zinc-900 hover:bg-amber-400"
                    : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                }`}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="h-20 w-full bg-green-600 text-2xl font-bold uppercase tracking-wider text-white hover:bg-green-500 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : (
            <>
              <Send className="mr-3 h-6 w-6" />
              Submit
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Index;
