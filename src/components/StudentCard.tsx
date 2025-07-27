import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Github, 
  Linkedin, 
  FileText, 
  Bookmark, 
  BookmarkCheck, 
  Star,
  MapPin,
  Calendar,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Student {
  id: string;
  name: string;
  domain: string;
  skills: string[];
  resume_url: string;
  linkedin: string;
  github: string;
  ai_summary: string;
  location?: string;
  graduation_year?: number;
  gpa?: number;
  projects?: number;
}

interface StudentCardProps {
  student: Student;
  onBookmark: (studentId: string, isBookmarked: boolean) => void;
  isBookmarked: boolean;
  className?: string;
}

const domainColors = {
  DS: "bg-blue-500/10 text-blue-600 border-blue-200",
  WD: "bg-green-500/10 text-green-600 border-green-200",
  ML: "bg-purple-500/10 text-purple-600 border-purple-200",
  UI: "bg-pink-500/10 text-pink-600 border-pink-200",
  BE: "bg-orange-500/10 text-orange-600 border-orange-200",
};

const domainNames = {
  DS: "Data Science",
  WD: "Web Development", 
  ML: "Machine Learning",
  UI: "UI/UX Design",
  BE: "Backend Engineering",
};

export function StudentCard({ student, onBookmark, isBookmarked, className }: StudentCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const handleBookmark = () => {
    onBookmark(student.id, !isBookmarked);
  };

  const domainColor = domainColors[student.domain as keyof typeof domainColors] || "bg-gray-500/10 text-gray-600 border-gray-200";
  const domainName = domainNames[student.domain as keyof typeof domainNames] || student.domain;

  return (
    <Card className={cn(
      "bento-card bento-card-hover group cursor-pointer relative overflow-hidden",
      className
    )}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-semibold text-lg">
                {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  {student.name}
                </h3>
                <Badge className={cn("text-xs", domainColor)}>
                  {domainName}
                </Badge>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5 text-accent" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {student.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{student.location}</span>
            </div>
          )}
          {student.graduation_year && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Class of {student.graduation_year}</span>
            </div>
          )}
          {student.gpa && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>{student.gpa} GPA</span>
            </div>
          )}
        </div>

        {/* AI Summary */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {student.ai_summary}
          </p>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Core Skills</h4>
          <div className="flex flex-wrap gap-2">
            {student.skills.slice(0, 5).map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs"
              >
                {skill}
              </Badge>
            ))}
            {student.skills.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{student.skills.length - 5} more
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1"
            onClick={() => window.open(student.resume_url, '_blank')}
          >
            <FileText className="w-4 h-4" />
            Resume
          </Button>
          
          {student.github && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open(student.github, '_blank')}
            >
              <Github className="w-4 h-4" />
            </Button>
          )}
          
          {student.linkedin && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open(student.linkedin, '_blank')}
            >
              <Linkedin className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Projects indicator */}
        {student.projects && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
            <Award className="w-3 h-3" />
            <span>{student.projects} projects completed</span>
          </div>
        )}
      </div>
    </Card>
  );
}