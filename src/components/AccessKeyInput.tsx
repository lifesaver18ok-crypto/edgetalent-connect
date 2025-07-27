import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { KeyRound, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccessKeyInputProps {
  onKeySubmit: (key: string) => void;
  isLoading?: boolean;
}

export function AccessKeyInput({ onKeySubmit, isLoading = false }: AccessKeyInputProps) {
  const [accessKey, setAccessKey] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessKey.trim()) {
      setIsValid(false);
      return;
    }
    setIsValid(true);
    onKeySubmit(accessKey.trim().toUpperCase());
  };

  const validateKey = (key: string) => {
    // Basic validation for key format (e.g., DS2006, WD1010)
    const keyPattern = /^[A-Z]{2}\d{4}$/;
    return keyPattern.test(key.toUpperCase());
  };

  const handleKeyChange = (value: string) => {
    setAccessKey(value);
    if (value && !validateKey(value)) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-swiss">
      <div className="text-center space-swiss-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-6">
          <KeyRound className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-light text-foreground mb-4">
          Access Student Profiles
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          Enter your domain-specific access key to unlock curated student profiles
        </p>
      </div>

      <Card className="bento-card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Access Key
            </label>
            <div className="relative">
              <Input
                type="text"
                value={accessKey}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder="e.g., DS2006, WD1010"
                className={cn(
                  "h-12 pr-12 text-center text-lg font-mono tracking-wider",
                  !isValid && "border-destructive focus-visible:ring-destructive"
                )}
                maxLength={6}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {accessKey && validateKey(accessKey) ? (
                  <Sparkles className="w-5 h-5 text-accent" />
                ) : (
                  <Search className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>
            {!isValid && (
              <p className="text-sm text-destructive">
                Please enter a valid access key (format: AB1234)
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={!accessKey || !validateKey(accessKey) || isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Unlocking Profiles...
              </>
            ) : (
              <>
                <KeyRound className="w-5 h-5" />
                Unlock Profiles
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="font-medium text-foreground">Sample Keys:</p>
              <p className="text-muted-foreground">DS2006 - Data Science</p>
              <p className="text-muted-foreground">WD1010 - Web Development</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">Key Format:</p>
              <p className="text-muted-foreground">[Domain][Count]</p>
              <p className="text-muted-foreground">2 letters + 4 digits</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}