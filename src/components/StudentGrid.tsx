import { useState, useEffect } from "react";
import { StudentCard, Student } from "@/components/StudentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, SortAsc, Grid3x3, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentGridProps {
  students: Student[];
  onBookmark: (studentId: string, isBookmarked: boolean) => void;
  bookmarkedIds: Set<string>;
  accessKey: string;
}

type SortOption = "name" | "domain" | "gpa" | "recent";
type ViewMode = "grid" | "list";

export function StudentGrid({ students, onBookmark, bookmarkedIds, accessKey }: StudentGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filteredStudents, setFilteredStudents] = useState(students);

  // Get unique domains
  const domains = Array.from(new Set(students.map(s => s.domain)));

  // Filter and sort logic
  useEffect(() => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        student.ai_summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Domain filter
    if (selectedDomain) {
      filtered = filtered.filter(student => student.domain === selectedDomain);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "domain":
          return a.domain.localeCompare(b.domain);
        case "gpa":
          return (b.gpa || 0) - (a.gpa || 0);
        case "recent":
          return (b.graduation_year || 0) - (a.graduation_year || 0);
        default:
          return 0;
      }
    });

    setFilteredStudents(filtered);
  }, [students, searchTerm, selectedDomain, sortBy]);

  const domainNames = {
    DS: "Data Science",
    WD: "Web Development", 
    ML: "Machine Learning",
    UI: "UI/UX Design",
    BE: "Backend Engineering",
  };

  return (
    <div className="space-swiss">
      {/* Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search students, skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Domain Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-1">
              <Button
                variant={selectedDomain === null ? "default" : "outline"}
                size="xs"
                onClick={() => setSelectedDomain(null)}
              >
                All
              </Button>
              {domains.map(domain => (
                <Button
                  key={domain}
                  variant={selectedDomain === domain ? "default" : "outline"}
                  size="xs"
                  onClick={() => setSelectedDomain(domain)}
                >
                  {domainNames[domain as keyof typeof domainNames] || domain}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1 rounded-md border border-border bg-background text-sm"
            >
              <option value="name">Name</option>
              <option value="domain">Domain</option>
              <option value="gpa">GPA</option>
              <option value="recent">Recent</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="xs"
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="xs"
              onClick={() => setViewMode("list")}
            >
              <LayoutList className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredStudents.length} of {students.length} profiles
          </p>
          {selectedDomain && (
            <Badge variant="secondary">
              Filtered by: {domainNames[selectedDomain as keyof typeof domainNames] || selectedDomain}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Access Key: {accessKey}
        </p>
      </div>

      {/* Student Grid */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No students found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className={cn(
          "animate-fade-in",
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
        )}>
          {filteredStudents.map((student, index) => (
            <div
              key={student.id}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <StudentCard
                student={student}
                onBookmark={onBookmark}
                isBookmarked={bookmarkedIds.has(student.id)}
                className={viewMode === "list" ? "max-w-none" : ""}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}