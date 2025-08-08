import { useState } from "react";
import { Header } from "@/components/Header";
import { AccessKeyInput } from "@/components/AccessKeyInput";
import { StudentGrid } from "@/components/StudentGrid";
import { Student } from "@/components/StudentCard";
import { getStudentsForKey, accessKeyConfigs } from "@/data/mockStudents";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, CheckCircle, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [currentAccessKey, setCurrentAccessKey] = useState<string | null>(null);
  const [unlockedStudents, setUnlockedStudents] = useState<Student[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleKeySubmit = async (accessKey: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const students = getStudentsForKey(accessKey);
    const config = accessKeyConfigs[accessKey as keyof typeof accessKeyConfigs];
    
    if (students.length === 0 || !config) {
      toast({
        title: "Invalid Access Key",
        description: "The access key you entered is not valid or has expired.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    setCurrentAccessKey(accessKey);
    setUnlockedStudents(students);
    setIsLoading(false);
    
    toast({
      title: "Profiles Unlocked!",
      description: `${students.length} ${config.description.toLowerCase()} unlocked successfully.`,
    });
  };

  const handleBookmark = (studentId: string, isBookmarked: boolean) => {
    const newBookmarkedIds = new Set(bookmarkedIds);
    if (isBookmarked) {
      newBookmarkedIds.add(studentId);
    } else {
      newBookmarkedIds.delete(studentId);
    }
    setBookmarkedIds(newBookmarkedIds);

    toast({
      title: isBookmarked ? "Profile Bookmarked" : "Bookmark Removed",
      description: isBookmarked 
        ? "Student profile added to your bookmarks." 
        : "Student profile removed from bookmarks.",
    });
  };

  const handleDownloadBookmarked = () => {
    const bookmarkedStudents = unlockedStudents.filter(s => bookmarkedIds.has(s.id));
    
    if (bookmarkedStudents.length === 0) {
      toast({
        title: "No Bookmarks",
        description: "Please bookmark some profiles first.",
        variant: "destructive",
      });
      return;
    }

    // Create CSV content
    const csvContent = [
      "Name,Domain,Location,GPA,Skills,LinkedIn,GitHub,Summary",
      ...bookmarkedStudents.map(student => 
        `"${student.name}","${student.domain}","${student.location || ''}","${student.gpa || ''}","${student.skills.join('; ')}","${student.linkedin}","${student.github}","${student.ai_summary}"`
      )
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smarted-bookmarked-profiles-${currentAccessKey}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `${bookmarkedStudents.length} profiles exported successfully.`,
    });
  };

  const handleReset = () => {
    setCurrentAccessKey(null);
    setUnlockedStudents([]);
    setBookmarkedIds(new Set());
  };

  return (
    <div className="min-h-screen bg-background">
      {currentAccessKey ? (
        <>
          <Header
            bookmarkedCount={bookmarkedIds.size}
            totalUnlocked={unlockedStudents.length}
            onDownloadBookmarked={handleDownloadBookmarked}
            accessKey={currentAccessKey}
          />
          
          <div className="fixed top-4 right-4 z-50">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
          
          <main className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                >
                  <ArrowLeft className="w-4 h-4" />
                  New Access Key
                </Button>
                
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <h1 className="text-2xl font-semibold text-foreground">
                    {accessKeyConfigs[currentAccessKey as keyof typeof accessKeyConfigs]?.description}
                  </h1>
                </div>
              </div>
              
              {bookmarkedIds.size > 0 && (
                <Button
                  variant="accent"
                  onClick={handleDownloadBookmarked}
                >
                  <Download className="w-4 h-4" />
                  Export {bookmarkedIds.size} Selected
                </Button>
              )}
            </div>

            <StudentGrid
              students={unlockedStudents}
              onBookmark={handleBookmark}
              bookmarkedIds={bookmarkedIds}
              accessKey={currentAccessKey}
            />
          </main>
        </>
      ) : (
        <main className="min-h-screen flex flex-col items-center justify-center px-6">
          <div className="mb-8">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <AccessKeyInput
            onKeySubmit={handleKeySubmit}
            isLoading={isLoading}
          />
        </main>
      )}
    </div>
  );
};

export default Index;
