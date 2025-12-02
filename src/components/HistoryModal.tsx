import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { SPCChart } from "./SPCChart";
import { CheckLog } from "./CheckLog";
import { BarChart3, ClipboardList, Loader2 } from "lucide-react";

interface EpoxyMixRecord {
  UUID: string;
  Timestamp: string | null;
  Ratio: string | null;
  Employee: number | null;
  Startup: string | null;
  "Daily Check": string | null;
  Shutdown: string | null;
}

interface HistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HistoryModal({ open, onOpenChange }: HistoryModalProps) {
  const [data, setData] = useState<EpoxyMixRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: records, error } = await supabase
        .from("EpoxyMix")
        .select("*")
        .order("Timestamp", { ascending: false })
        .limit(500);

      if (error) throw error;
      setData(records || []);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden bg-zinc-900 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-xl">Epoxy Mix History</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
              <TabsTrigger value="chart" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                SPC Chart
              </TabsTrigger>
              <TabsTrigger value="log" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Check Log
              </TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="mt-4">
              <SPCChart data={data} />
            </TabsContent>
            <TabsContent value="log" className="mt-4">
              <CheckLog data={data} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
