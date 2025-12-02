import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle, Send, RotateCcw, History } from "lucide-react";
import { HistoryModal } from "@/components/HistoryModal";
import logo from "@/assets/logo.png";

type CheckType = "startup" | "shutdown" | "daily" | null;

const Index = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employee, setEmployee] = useState("");
  const [partA, setPartA] = useState("");
  const [partB, setPartB] = useState("");
  const [checkType, setCheckType] = useState<CheckType>(null);
  
  // Result state - only shown after submit
  const [showResult, setShowResult] = useState(false);
  const [resultRatio, setResultRatio] = useState<number | null>(null);
  const [isAcceptable, setIsAcceptable] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const resetForm = () => {
    setEmployee("");
    setPartA("");
    setPartB("");
    setCheckType(null);
    setShowResult(false);
    setResultRatio(null);
    setIsAcceptable(false);
  };

  const isValidEmployeeId = (id: string) => {
    return /^\d{2,4}$/.test(id.trim());
  };

  const handleSubmit = async () => {
    // Employee ID is required and must be 2-4 digits
    if (!isValidEmployeeId(employee)) {
      toast({ title: "Invalid Employee ID", description: "Must be 2-4 digits", variant: "destructive" });
      return;
    }

    // Check Type is required
    if (!checkType) {
      toast({ title: "Check Type Required", description: "Please select Startup, Daily, or Shutdown", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate ratio if both parts are provided
      let ratio: string | null = null;
      let ratioValue: number | null = null;
      
      if (partA && partB && parseFloat(partB) !== 0) {
        ratioValue = parseFloat(partA) / parseFloat(partB);
        ratio = ratioValue.toFixed(3);
      }

      const { error } = await supabase.from("EpoxyMix").insert({
        UUID: crypto.randomUUID(),
        Timestamp: new Date().toISOString(),
        Employee: parseInt(employee) || null,
        "Part A": partA || null,
        "Part B": partB || null,
        Ratio: ratio,
        "Daily Check": checkType === "daily" ? "Yes" : null,
        Startup: checkType === "startup" ? "Yes" : null,
        Shutdown: checkType === "shutdown" ? "Yes" : null,
      });

      if (error) throw error;

      // Show result only if ratio was calculated
      if (ratioValue !== null) {
        const acceptable = ratioValue >= 11.878 && ratioValue <= 12.362;
        setResultRatio(ratioValue);
        setIsAcceptable(acceptable);
        setShowResult(true);
        
        if (acceptable) {
          toast({ title: "✓ Saved - Ratio Acceptable" });
        }
      } else {
        // No ratio calculated (e.g., startup check only)
        toast({ title: "✓ Saved!" });
        resetForm();
      }
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Result screen after submit
  if (showResult && resultRatio !== null) {
    return (
      <div className={`min-h-screen p-4 ${isAcceptable ? "bg-zinc-900" : "bg-red-900"}`}>
        <div className="mx-auto max-w-xl space-y-6">
          <div className={`rounded-lg border-4 p-6 text-center ${
            isAcceptable 
              ? "border-green-500 bg-green-950/50" 
              : "border-red-500 bg-red-950/80"
          }`}>
            {isAcceptable ? (
              <>
                <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
                <h1 className="mt-4 text-3xl font-bold text-green-400">ACCEPTABLE</h1>
                <p className="mt-2 text-4xl font-mono font-bold text-white">
                  Ratio: {resultRatio.toFixed(3)}
                </p>
                <p className="mt-2 text-lg text-zinc-400">
                  Range: 11.878 - 12.362
                </p>
              </>
            ) : (
              <>
                <AlertTriangle className="mx-auto h-20 w-20 text-red-500" />
                <h1 className="mt-4 text-3xl font-bold text-red-400">OUT OF RANGE</h1>
                <p className="mt-2 text-4xl font-mono font-bold text-white">
                  Ratio: {resultRatio.toFixed(3)}
                </p>
                <p className="mt-2 text-lg text-zinc-300">
                  Acceptable Range: 11.878 - 12.362
                </p>
                <div className="mt-6 rounded-lg bg-red-800 p-4">
                  <p className="text-xl font-bold text-white">
                    ⚠️ RETEST REQUIRED
                  </p>
                  <p className="mt-2 text-lg text-red-200">
                    Contact Supervisor if problem persists
                  </p>
                </div>
              </>
            )}
          </div>

          <Button
            onClick={resetForm}
            className="h-16 w-full bg-zinc-700 text-xl font-bold text-white hover:bg-zinc-600"
          >
            <RotateCcw className="mr-2 h-6 w-6" />
            New Entry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="mx-auto max-w-xl space-y-6">
        {/* Header */}
        <div className="border-l-4 border-amber-500 bg-zinc-800 p-4 flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
          <h1 className="text-2xl font-bold uppercase tracking-wider text-amber-500">
            Epoxy Mix Log
          </h1>
        </div>

        {/* Employee ID - Required */}
        <div className="space-y-2">
          <label className="text-lg font-medium text-zinc-300">
            Employee ID <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            inputMode="numeric"
            pattern="\d{2,4}"
            maxLength={4}
            placeholder="2-4 digits"
            value={employee}
            onChange={(e) => setEmployee(e.target.value.replace(/\D/g, "").slice(0, 4))}
            className="h-24 border-zinc-600 bg-zinc-800 text-5xl font-bold text-zinc-100 placeholder:text-zinc-500 placeholder:text-3xl"
          />
        </div>

        {/* Check Type Buttons */}
        <div className="space-y-2">
          <label className="text-lg font-medium text-zinc-300">Check Type</label>
          <div className="grid grid-cols-3 gap-3">
            {(["startup", "daily", "shutdown"] as const).map((type) => (
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

        {/* Part A & Part B */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-lg font-medium text-zinc-300">Part A</label>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={partA}
              onChange={(e) => setPartA(e.target.value)}
              className="h-24 border-zinc-600 bg-zinc-800 text-5xl font-bold text-zinc-100 placeholder:text-zinc-500 placeholder:text-3xl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-lg font-medium text-zinc-300">Part B</label>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={partB}
              onChange={(e) => setPartB(e.target.value)}
              className="h-24 border-zinc-600 bg-zinc-800 text-5xl font-bold text-zinc-100 placeholder:text-zinc-500 placeholder:text-3xl"
            />
          </div>
        </div>

        {/* Ratio Preview (calculated but not validated until submit) */}
        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
          <label className="text-lg font-medium text-zinc-300">Ratio (Part A ÷ Part B)</label>
          <p className="mt-2 text-3xl font-mono font-bold text-zinc-100">
            {partA && partB && parseFloat(partB) !== 0 
              ? (parseFloat(partA) / parseFloat(partB)).toFixed(3)
              : "—"
            }
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Acceptable: 11.878 - 12.362
          </p>
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

        {/* View History Button */}
        <Button
          onClick={() => setHistoryOpen(true)}
          variant="outline"
          className="h-14 w-full border-zinc-600 bg-zinc-800 text-lg font-medium text-zinc-300 hover:bg-zinc-700"
        >
          <History className="mr-2 h-5 w-5" />
          View History
        </Button>

        <HistoryModal open={historyOpen} onOpenChange={setHistoryOpen} />
      </div>
    </div>
  );
};

export default Index;
