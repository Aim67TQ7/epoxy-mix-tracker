import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SPCChart } from "./SPCChart";
import { CheckLog } from "./CheckLog";
import { BarChart3, ClipboardList, Loader2, Download } from "lucide-react";
import * as XLSX from "xlsx";

interface EpoxyMixRecord {
  UUID: string;
  Timestamp: string | null;
  Ratio: string | null;
  Employee: number | null;
  Startup: string | null;
  "Daily Check": string | null;
  Shutdown: string | null;
  "Part A": string | null;
  "Part B": string | null;
}

interface HistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HistoryModal({ open, onOpenChange }: HistoryModalProps) {
  const [data, setData] = useState<EpoxyMixRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

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

  const handleDownloadExcel = async () => {
    setDownloading(true);
    try {
      // Fetch all data for export
      const { data: allRecords, error } = await supabase
        .from("EpoxyMix")
        .select("*")
        .order("Timestamp", { ascending: false });

      if (error) throw error;

      // Transform data for Excel
      const excelData = (allRecords || []).map((record) => ({
        Timestamp: record.Timestamp || "",
        Employee: record.Employee || "",
        "Part A": record["Part A"] || "",
        "Part B": record["Part B"] || "",
        Ratio: record.Ratio || "",
        Startup: record.Startup || "",
        "Daily Check": record["Daily Check"] || "",
        Shutdown: record.Shutdown || "",
      }));

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Epoxy Mix Data");

      // Set column widths
      ws["!cols"] = [
        { wch: 20 }, // Timestamp
        { wch: 10 }, // Employee
        { wch: 10 }, // Part A
        { wch: 10 }, // Part B
        { wch: 10 }, // Ratio
        { wch: 10 }, // Startup
        { wch: 12 }, // Daily Check
        { wch: 10 }, // Shutdown
      ];

      // Generate filename with date
      const date = new Date().toISOString().split("T")[0];
      const filename = `EpoxyMix_Export_${date}.xlsx`;

      // Download file
      XLSX.writeFile(wb, filename);
    } catch (err) {
      console.error("Error downloading Excel:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden bg-zinc-900 text-zinc-100">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl">Epoxy Mix History</DialogTitle>
          <Button
            onClick={handleDownloadExcel}
            disabled={downloading || loading}
            variant="outline"
            size="sm"
            className="mr-8 border-zinc-600 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          >
            {downloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download Excel
          </Button>
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
