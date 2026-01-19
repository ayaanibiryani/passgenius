import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCreatePassword } from "@/hooks/use-passwords";

interface SaveDialogProps {
  password: string;
  strength: string;
}

export function SaveDialog({ password, strength }: SaveDialogProps) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const { mutate: save, isPending } = useCreatePassword();

  const handleSave = () => {
    if (!label.trim()) return;
    
    save(
      { label, value: password, strength },
      {
        onSuccess: () => {
          setOpen(false);
          setLabel("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full text-muted-foreground hover:text-primary hover:bg-primary/5"
        >
          <Save className="w-4 h-4 mr-2" />
          Save to Vault
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save to Vault</DialogTitle>
          <DialogDescription>
            Give this password a memorable label to find it later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              placeholder="e.g. Personal Gmail, Netflix, Work WiFi..."
              className="input-premium"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label>Password Preview</Label>
            <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all text-muted-foreground">
              {password}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!label.trim() || isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Password"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
