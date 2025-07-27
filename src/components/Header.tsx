import { Button } from "@/components/ui/button";
import { BookmarkCheck, Download, Settings, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

interface HeaderProps {
  bookmarkedCount: number;
  totalUnlocked: number;
  onDownloadBookmarked: () => void;
  accessKey?: string;
}

export function Header({ bookmarkedCount, totalUnlocked, onDownloadBookmarked, accessKey }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">SE</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">SmartEd Recruit</h1>
              {accessKey && (
                <p className="text-xs text-muted-foreground">
                  Key: {accessKey} • {totalUnlocked} profiles unlocked
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Bookmarked Count */}
            {bookmarkedCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
                <BookmarkCheck className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">{bookmarkedCount} bookmarked</span>
              </div>
            )}

            {/* Download Bookmarked */}
            <Button
              variant="outline"
              size="sm"
              onClick={onDownloadBookmarked}
              disabled={bookmarkedCount === 0}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}