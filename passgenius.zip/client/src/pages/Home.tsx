import { useState, useEffect, useCallback } from "react";
import { PasswordDisplay } from "@/components/PasswordDisplay";
import { ConfigurationPanel } from "@/components/ConfigurationPanel";
import { VaultList } from "@/components/VaultList";
import { SaveDialog } from "@/components/SaveDialog";
import { Shield, Lock } from "lucide-react";

// --- Logic Helpers ---
const CHAR_SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function generatePasswordLogic(length: number, options: { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean }) {
  let charset = "";
  if (options.upper) charset += CHAR_SETS.upper;
  if (options.lower) charset += CHAR_SETS.lower;
  if (options.numbers) charset += CHAR_SETS.numbers;
  if (options.symbols) charset += CHAR_SETS.symbols;

  if (!charset) return "";

  let password = "";
  // Ensure at least one of each selected type
  const requiredChars = [];
  if (options.upper) requiredChars.push(CHAR_SETS.upper[Math.floor(Math.random() * CHAR_SETS.upper.length)]);
  if (options.lower) requiredChars.push(CHAR_SETS.lower[Math.floor(Math.random() * CHAR_SETS.lower.length)]);
  if (options.numbers) requiredChars.push(CHAR_SETS.numbers[Math.floor(Math.random() * CHAR_SETS.numbers.length)]);
  if (options.symbols) requiredChars.push(CHAR_SETS.symbols[Math.floor(Math.random() * CHAR_SETS.symbols.length)]);

  for (let i = 0; i < length - requiredChars.length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  // Combine and shuffle
  password += requiredChars.join('');
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

function calculateStrength(password: string) {
  let score = 0;
  if (password.length > 8) score += 1;
  if (password.length > 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score < 3) return { label: "Weak", color: "hsl(0, 84%, 60%)" }; // Destructive Red
  if (score < 5) return { label: "Medium", color: "hsl(45, 93%, 47%)" }; // Yellow/Orange
  return { label: "Strong", color: "hsl(142, 71%, 45%)" }; // Success Green
}

export default function Home() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState({ label: "", color: "" });

  const handleGenerate = useCallback(() => {
    // If no options selected, fallback to lower
    if (!Object.values(options).some(Boolean)) {
      setOptions(prev => ({ ...prev, lower: true }));
      return;
    }
    const newPass = generatePasswordLogic(length, options);
    setPassword(newPass);
    setStrength(calculateStrength(newPass));
  }, [length, options]);

  // Initial generation
  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleOptionChange = (key: keyof typeof options, val: boolean) => {
    setOptions(prev => {
      const next = { ...prev, [key]: val };
      // Prevent unchecking the last option
      if (!Object.values(next).some(Boolean)) return prev;
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-border/60 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold font-display tracking-tight text-foreground">
              Fortress<span className="text-primary">Gen</span>
            </h1>
          </div>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Secure & Client-Side
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        
        <section className="space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
              Generate Unbreakable Passwords
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Create cryptographically strong credentials instantly. 
              Your security is our priority.
            </p>
          </div>

          <PasswordDisplay 
            password={password} 
            onGenerate={handleGenerate} 
            strengthColor={strength.color}
          />

          <div className="flex justify-end">
             <SaveDialog password={password} strength={strength.label} />
          </div>

          <ConfigurationPanel 
            length={length}
            setLength={setLength}
            options={options}
            setOption={handleOptionChange}
            strengthLabel={strength.label}
            strengthColor={strength.color}
          />
        </section>

        <div className="my-12 border-t border-border/60" />

        <section>
          <VaultList />
        </section>

      </main>
      
      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-20" />
    </div>
  );
}
