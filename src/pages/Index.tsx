import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle, Send, RotateCcw, History } from "lucide-react";
import { HistoryModal } from "@/components/HistoryModal";
import logo from "@/assets/logo.png";

type CheckType = "startup" | "daily" | "shutdown" | "ratio" | null;

const Index = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employee, setEmployee] = useState("");
  const [partA, setPartA] = useState("");
  const [partB, setPartB] = useState("");
  const [cupA, setCupA] = useState("");
  const [cupB, setCupB] = useState("");
  const [checkType, setCheckType] = useState<CheckType>(null);
  const [comments, setComments] = useState("");
  
  // Result state - only shown after submit
  const [showResult, setShowResult] = useState(false);
  const [resultRatio, setResultRatio] = useState<number | null>(null);
  const [isAcceptable, setIsAcceptable] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const resetForm = () => {
    setEmployee("");
    setPartA("");
    setPartB("");
    setCupA("");
    setCupB("");
    setCheckType(null);
    setComments("");
    setShowResult(false);
    setResultRatio(null);
    setIsAcceptable(false);
  };

  const isValidEmployeeId = (id: string) => {
    return /^\d{2,4}$/.test(id.trim());
  };

  // Calculate net weights and ratio
  const getNetA = () => {
    if (!partA || !cupA) return null;
    return parseFloat(partA) - parseFloat(cupA);
  };

  const getNetB = () => {
    if (!partB || !cupB) return null;
    return parseFloat(partB) - parseFloat(cupB);
  };

  const calculateRatio = () => {
    const netA = getNetA();
    const netB = getNetB();
    if (netA === null || netB === null || netB === 0) return null;
    return netA / netB;
  };

  const handleSubmit = async () => {
    // Employee ID is required and must be 2-4 digits
    if (!isValidEmployeeId(employee)) {
      toast({ title: "Invalid Employee ID", description: "Must be 2-4 digits", variant: "destructive" });
      return;
    }

    // Check Type is required only if no ratio (all weight fields not filled)
    const ratioValue = calculateRatio();
    if (!checkType && ratioValue === null) {
      toast({ title: "Check Type Required", description: "Please select Startup, Daily, or Shutdown when no ratio is entered", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate ratio if all weight parts are provided
      let ratio: string | null = null;
      
      if (ratioValue !== null) {
        ratio = ratioValue.toFixed(3);
      }

      const { error } = await supabase.from("EpoxyMix").insert({
        UUID: crypto.randomUUID(),
        Timestamp: new Date().toISOString(),
        Employee: parseInt(employee) || null,
        "Part A": partA || null,
        "Part B": partB || null,
        "Cup A": cupA || null,
        "Cup B": cupB || null,
        Ratio: ratio,
        "Daily Check": checkType === "daily" ? "Yes" : null,
        Startup: checkType === "startup" ? "Yes" : null,
        Shutdown: checkType === "shutdown" ? "Yes" : null,
        "Ratio Check": checkType === "ratio" ? "Yes" : null,
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

  const previewRatio = calculateRatio();

  return (
    <div className="min-h-screen bg-zinc-900 p-4 flex flex-col">
      <div className="mx-auto w-full max-w-xl flex-1 flex flex-col space-y-4">
        {/* Header */}
        <div className="border-l-4 border-amber-500 bg-zinc-800 p-4 flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
          <h1 className="text-2xl font-bold uppercase tracking-wider text-amber-500">
            Epoxy Mix Log
          </h1>
        </div>

        {/* Employee ID - Required */}
        <div className="space-y-2">
          <label className="text-xl font-bold text-white">
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
            className="h-16 border-2 border-amber-500 bg-zinc-800 !text-4xl font-bold text-zinc-100 placeholder:text-zinc-500 placeholder:text-2xl"
          />
        </div>

        {/* Check Type Buttons */}
        <div className="space-y-2">
          <label className="text-xl font-bold text-white">Check Type</label>
          <div className="grid grid-cols-2 gap-2">
            {(["startup", "daily", "shutdown", "ratio"] as const).map((type) => (
              <Button
                key={type}
                type="button"
                onClick={() => setCheckType(checkType === type ? null : type)}
                className={`h-14 text-lg font-bold uppercase ${
                  checkType === type
                    ? "bg-amber-500 text-zinc-900 hover:bg-amber-400 ring-4 ring-amber-300"
                    : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                }`}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Part A & Part B with Cup weights */}
        <div className="grid grid-cols-2 gap-3">
          {/* Column A */}
          <div className="space-y-2">
            <label className="text-xl font-bold text-white">Part A</label>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={partA}
              onChange={(e) => setPartA(e.target.value)}
              className="h-16 border-2 border-amber-500 bg-zinc-800 !text-4xl font-bold text-zinc-100 placeholder:text-zinc-500 placeholder:text-2xl"
            />
            <label className="text-lg font-bold text-zinc-400">Cup A</label>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={cupA}
              onChange={(e) => setCupA(e.target.value)}
              className="h-16 border-2 border-amber-500 bg-zinc-800 !text-4xl font-bold text-zinc-100 placeholder:text-zinc-500 placeholder:text-2xl"
            />
          </div>
          {/* Column B */}
          <div className="space-y-2">
            <label className="text-xl font-bold text-white">Part B</label>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={partB}
              onChange={(e) => setPartB(e.target.value)}
              className="h-16 border-2 border-amber-500 bg-zinc-800 !text-4xl font-bold text-zinc-100 placeholder:text-zinc-500 placeholder:text-2xl"
            />
            <label className="text-lg font-bold text-zinc-400">Cup B</label>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={cupB}
              onChange={(e) => setCupB(e.target.value)}
              className="h-16 border-2 border-amber-500 bg-zinc-800 !text-4xl font-bold text-zinc-100 placeholder:text-zinc-500 placeholder:text-2xl"
            />
          </div>
        </div>

        {/* Ratio Preview */}
        <div className="rounded-lg border-2 border-zinc-600 bg-zinc-800 p-4">
          <label className="text-lg font-bold text-white">Ratio (Part A - Cup A) ÷ (Part B - Cup B)</label>
          <p className="mt-2 text-4xl font-mono font-bold text-zinc-100">
            {previewRatio !== null ? previewRatio.toFixed(3) : "—"}
          </p>
          <p className="mt-1 text-lg text-zinc-400">
            Acceptable: 11.878 - 12.362
          </p>
        </div>

        {/* Comments */}
        <div className="space-y-2">
          <label className="text-xl font-bold text-white">Comments</label>
          <Input
            type="text"
            placeholder="Optional comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="h-16 border-2 border-zinc-500 bg-zinc-800 !text-4xl font-bold text-zinc-100 placeholder:text-zinc-500 placeholder:text-2xl"
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="h-16 w-full bg-green-600 text-2xl font-bold uppercase tracking-wider text-white hover:bg-green-500 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : (
            <>
              <Send className="mr-2 h-6 w-6" />
              Submit
            </>
          )}
        </Button>

        {/* View History Button */}
        <Button
          onClick={() => setHistoryOpen(true)}
          variant="outline"
          className="h-14 w-full border-2 border-zinc-500 bg-zinc-800 text-xl font-bold text-zinc-200 hover:bg-zinc-700"
        >
          <History className="mr-2 h-6 w-6" />
          View History
        </Button>

        <HistoryModal open={historyOpen} onOpenChange={setHistoryOpen} />
      </div>
    </div>
  );
};

export default Index;
