import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Type, CaseUpper, CaseLower, Hash, Fingerprint } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConfigurationPanelProps {
  length: number;
  setLength: (val: number) => void;
  options: {
    upper: boolean;
    lower: boolean;
    numbers: boolean;
    symbols: boolean;
  };
  setOption: (key: keyof ConfigurationPanelProps['options'], val: boolean) => void;
  strengthLabel: string;
  strengthColor: string;
}

export function ConfigurationPanel({ 
  length, 
  setLength, 
  options, 
  setOption,
  strengthLabel,
  strengthColor
}: ConfigurationPanelProps) {
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Length Control */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-border/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Password Length</h3>
              <p className="text-sm text-muted-foreground">Character count</p>
            </div>
          </div>
          <span className="text-3xl font-mono font-bold text-primary">{length}</span>
        </div>
        
        <Slider
          value={[length]}
          onValueChange={(vals) => setLength(vals[0])}
          min={8}
          max={64}
          step={1}
          className="py-4"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground mt-2 font-mono">
          <span>8</span>
          <span>32</span>
          <span>64</span>
        </div>
      </div>

      {/* Strength Meter Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-5 h-5 text-muted-foreground" />
          <span className="font-medium text-muted-foreground">Security Strength</span>
        </div>
        <div className="text-2xl font-bold transition-colors duration-300" style={{ color: strengthColor }}>
          {strengthLabel}
        </div>
        <div className="w-full bg-muted rounded-full h-2 mt-4 overflow-hidden">
          <div 
            className="h-full transition-all duration-500 ease-out"
            style={{ 
              width: strengthLabel === "Weak" ? "33%" : strengthLabel === "Medium" ? "66%" : "100%",
              backgroundColor: strengthColor
            }}
          />
        </div>
      </div>

      {/* Character Options */}
      <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { id: 'upper', label: 'Uppercase', icon: CaseUpper, desc: 'A-Z' },
          { id: 'lower', label: 'Lowercase', icon: CaseLower, desc: 'a-z' },
          { id: 'numbers', label: 'Numbers', icon: Hash, desc: '0-9' },
          { id: 'symbols', label: 'Symbols', icon: Fingerprint, desc: '!@#$' },
        ].map((opt) => (
          <div 
            key={opt.id}
            className="bg-white p-4 rounded-xl border border-border/50 shadow-sm flex items-center justify-between hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                <opt.icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{opt.label}</span>
                <span className="text-xs text-muted-foreground font-mono">{opt.desc}</span>
              </div>
            </div>
            <Switch
              checked={options[opt.id as keyof typeof options]}
              onCheckedChange={(checked) => setOption(opt.id as any, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
