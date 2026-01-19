import { usePasswords, useDeletePassword } from "@/hooks/use-passwords";
import { Copy, Trash2, KeyRound, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function VaultList() {
  const { data: passwords, isLoading, isError } = usePasswords();
  const { mutate: deletePassword, isPending: isDeleting } = useDeletePassword();
  const { toast } = useToast();

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to clipboard",
      description: "Password is ready to paste.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary/50" />
        <p>Unlocking vault...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-destructive">
        <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Failed to load vault. Please try again.</p>
      </div>
    );
  }

  if (!passwords?.length) {
    return (
      <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">Your vault is empty</h3>
        <p className="text-muted-foreground max-w-sm mx-auto mt-2">
          Generated passwords you save will appear here securely.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-secondary" />
        <h2 className="text-xl font-bold text-foreground">Secure Vault</h2>
        <span className="px-2.5 py-0.5 rounded-full bg-muted text-xs font-bold text-muted-foreground">
          {passwords.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {passwords.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
              className="group bg-white rounded-xl p-5 border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{item.label}</h3>
                  <p className="text-xs text-muted-foreground">
                    {item.createdAt && format(new Date(item.createdAt), 'MMM d, yyyy')} • {item.strength || 'Unknown'} Strength
                  </p>
                </div>
                <div 
                  className={`w-2 h-2 rounded-full mt-2 ${
                    item.strength === 'Strong' ? 'bg-emerald-500' : 
                    item.strength === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} 
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-3 font-mono text-sm truncate mb-4 select-all">
                {item.value}
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 hover:bg-primary/5 hover:text-primary hover:border-primary/20"
                  onClick={() => handleCopy(item.value)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:bg-destructive/5 hover:border-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete password?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove <span className="font-semibold text-foreground">{item.label}</span> from your vault. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => deletePassword(item.id)}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
