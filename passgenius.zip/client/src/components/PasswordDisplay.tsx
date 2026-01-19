import { Copy, RefreshCw, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PasswordDisplayProps {
  password: string;
  onGenerate: () => void;
  strengthColor: string;
}

export function PasswordDisplay({ password, onGenerate, strengthColor }: PasswordDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div 
        className={cn(
          "bg-white rounded-2xl border-2 p-6 md:p-8 shadow-xl transition-all duration-300",
          "hover:shadow-2xl hover:border-primary/20",
          "flex items-center justify-between gap-4"
        )}
        style={{ borderColor: copied ? "hsl(var(--secondary))" : "" }}
      >
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
            Generated Password
          </p>
          <motion.div
            key={password}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-2xl md:text-4xl font-bold tracking-tight text-foreground truncate selection:bg-primary/20"
          >
            {password}
          </motion.div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button
            onClick={onGenerate}
            className="p-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
            title="Generate New"
          >
            <RefreshCw className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          <button
            onClick={handleCopy}
            className={cn(
              "btn-premium flex items-center gap-2",
              copied 
                ? "bg-secondary text-secondary-foreground shadow-secondary/30" 
                : "bg-primary text-primary-foreground shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5"
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  <span className="hidden md:inline">Copied</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-5 h-5" />
                  <span className="hidden md:inline">Copy</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
      
      {/* Strength Indicator Line */}
      <div className="absolute bottom-0 left-6 right-6 h-1 rounded-t-full overflow-hidden">
        <motion.div 
          className="h-full w-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1, backgroundColor: strengthColor }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
