import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Trash2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  "Cup A": string | null;
  "Cup B": string | null;
}

interface EditTableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PASSCODE = "4155";

export function EditTableModal({ open, onOpenChange }: EditTableModalProps) {
  const { toast } = useToast();
  const [authenticated, setAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [data, setData] = useState<EpoxyMixRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<EpoxyMixRecord>>({});

  useEffect(() => {
    if (open && authenticated) {
      fetchData();
    }
    if (!open) {
      setAuthenticated(false);
      setPasscode("");
    }
  }, [open, authenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: records, error } = await supabase
        .from("EpoxyMix")
        .select("*")
        .order("Timestamp", { ascending: false })
        .limit(100);

      if (error) throw error;
      setData(records || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasscodeSubmit = () => {
    if (passcode === PASSCODE) {
      setAuthenticated(true);
    } else {
      toast({ title: "Invalid Passcode", variant: "destructive" });
      setPasscode("");
    }
  };

  const startEdit = (record: EpoxyMixRecord) => {
    setEditingId(record.UUID);
    setEditValues({
      Employee: record.Employee,
      "Part A": record["Part A"],
      "Part B": record["Part B"],
      "Cup A": record["Cup A"],
      "Cup B": record["Cup B"],
      Ratio: record.Ratio,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = async (uuid: string) => {
    try {
      const { error } = await supabase
        .from("EpoxyMix")
        .update({
          Employee: editValues.Employee,
          "Part A": editValues["Part A"],
          "Part B": editValues["Part B"],
          "Cup A": editValues["Cup A"],
          "Cup B": editValues["Cup B"],
          Ratio: editValues.Ratio,
        })
        .eq("UUID", uuid);

      if (error) throw error;
      toast({ title: "Saved!" });
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error("Error saving:", err);
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    }
  };

  const deleteRecord = async (uuid: string) => {
    if (!confirm("Delete this record?")) return;
    try {
      const { error } = await supabase.from("EpoxyMix").delete().eq("UUID", uuid);
      if (error) throw error;
      toast({ title: "Deleted" });
      fetchData();
    } catch (err) {
      console.error("Error deleting:", err);
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const formatDate = (timestamp: string | null) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleString();
  };

  if (!authenticated) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm bg-zinc-900 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Lock className="h-5 w-5" />
              Enter Passcode
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="4-digit passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value.replace(/\D/g, "").slice(0, 4))}
              onKeyDown={(e) => e.key === "Enter" && handlePasscodeSubmit()}
              className="h-14 border-2 border-zinc-600 bg-zinc-800 text-center text-2xl font-bold tracking-widest text-zinc-100"
            />
            <Button
              onClick={handlePasscodeSubmit}
              className="h-12 w-full bg-amber-500 text-lg font-bold text-zinc-900 hover:bg-amber-400"
            >
              Unlock
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-hidden bg-zinc-900 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Records</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollArea className="h-[60vh] w-full">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-700">
                    <TableHead className="text-zinc-400">Timestamp</TableHead>
                    <TableHead className="text-zinc-400">Employee</TableHead>
                    <TableHead className="text-zinc-400">Part A</TableHead>
                    <TableHead className="text-zinc-400">Cup A</TableHead>
                    <TableHead className="text-zinc-400">Part B</TableHead>
                    <TableHead className="text-zinc-400">Cup B</TableHead>
                    <TableHead className="text-zinc-400">Ratio</TableHead>
                    <TableHead className="text-zinc-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((record) => (
                    <TableRow key={record.UUID} className="border-zinc-700">
                      <TableCell className="text-xs text-zinc-400">
                        {formatDate(record.Timestamp)}
                      </TableCell>
                      {editingId === record.UUID ? (
                        <>
                          <TableCell>
                            <Input
                              type="number"
                              value={editValues.Employee ?? ""}
                              onChange={(e) => setEditValues({ ...editValues, Employee: parseInt(e.target.value) || null })}
                              className="h-8 w-16 bg-zinc-800 text-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editValues["Part A"] ?? ""}
                              onChange={(e) => setEditValues({ ...editValues, "Part A": e.target.value })}
                              className="h-8 w-20 bg-zinc-800 text-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editValues["Cup A"] ?? ""}
                              onChange={(e) => setEditValues({ ...editValues, "Cup A": e.target.value })}
                              className="h-8 w-20 bg-zinc-800 text-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editValues["Part B"] ?? ""}
                              onChange={(e) => setEditValues({ ...editValues, "Part B": e.target.value })}
                              className="h-8 w-20 bg-zinc-800 text-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editValues["Cup B"] ?? ""}
                              onChange={(e) => setEditValues({ ...editValues, "Cup B": e.target.value })}
                              className="h-8 w-20 bg-zinc-800 text-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editValues.Ratio ?? ""}
                              onChange={(e) => setEditValues({ ...editValues, Ratio: e.target.value })}
                              className="h-8 w-20 bg-zinc-800 text-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" onClick={() => saveEdit(record.UUID)} className="h-7 bg-green-600 hover:bg-green-500">
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-7">
                                ✕
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{record.Employee ?? "—"}</TableCell>
                          <TableCell>{record["Part A"] ?? "—"}</TableCell>
                          <TableCell>{record["Cup A"] ?? "—"}</TableCell>
                          <TableCell>{record["Part B"] ?? "—"}</TableCell>
                          <TableCell>{record["Cup B"] ?? "—"}</TableCell>
                          <TableCell className="font-mono">{record.Ratio ?? "—"}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" onClick={() => startEdit(record)} className="h-7 border-zinc-600">
                                Edit
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => deleteRecord(record.UUID)} className="h-7">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
