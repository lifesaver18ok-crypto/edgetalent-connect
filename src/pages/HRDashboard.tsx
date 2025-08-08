import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { 
  Users, 
  BookmarkPlus, 
  Download, 
  LogOut, 
  BarChart3, 
  TrendingUp,
  UserCheck,
  Calendar,
  Search,
  Filter,
  GraduationCap,
  MapPin,
  Star
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  domain: string;
  skills: string[];
  location: string;
  gpa: number;
  linkedin: string;
  github: string;
  ai_summary: string;
}

interface Bookmark {
  id: string;
  studentId: string;
  studentName: string;
  createdAt: any;
  notes?: string;
}

const HRDashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch students
      const studentsSnapshot = await getDocs(collection(db, 'students'));
      const studentsData = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Student[];
      setStudents(studentsData);

      // Fetch bookmarks for current user (in a real app, you'd filter by user ID)
      const bookmarksSnapshot = await getDocs(collection(db, 'bookmarks'));
      const bookmarksData = bookmarksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Bookmark[];
      setBookmarks(bookmarksData);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addBookmark = async (student: Student) => {
    try {
      const bookmark = {
        studentId: student.id,
        studentName: student.name,
        createdAt: new Date(),
        notes: ''
      };

      await addDoc(collection(db, 'bookmarks'), bookmark);
      
      toast({
        title: "Bookmark Added",
        description: `${student.name} has been bookmarked.`,
      });
      
      fetchData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add bookmark.",
        variant: "destructive",
      });
    }
  };

  const removeBookmark = async (bookmarkId: string) => {
    try {
      await deleteDoc(doc(db, 'bookmarks', bookmarkId));
      
      toast({
        title: "Bookmark Removed",
        description: "Bookmark has been removed.",
      });
      
      fetchData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove bookmark.",
        variant: "destructive",
      });
    }
  };

  const exportBookmarks = () => {
    const bookmarkedStudents = students.filter(student => 
      bookmarks.some(bookmark => bookmark.studentId === student.id)
    );

    if (bookmarkedStudents.length === 0) {
      toast({
        title: "No Bookmarks",
        description: "You don't have any bookmarked profiles to export.",
        variant: "destructive",
      });
      return;
    }

    const csvContent = [
      "Name,Domain,Location,GPA,Skills,LinkedIn,GitHub,Summary",
      ...bookmarkedStudents.map(student => 
        `"${student.name}","${student.domain}","${student.location}","${student.gpa}","${student.skills.join('; ')}","${student.linkedin}","${student.github}","${student.ai_summary}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hr-bookmarked-profiles-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `${bookmarkedStudents.length} profiles exported successfully.`,
    });
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDomain = !filterDomain || student.domain === filterDomain;
    return matchesSearch && matchesDomain;
  });

  const domains = [...new Set(students.map(student => student.domain))];
  const isBookmarked = (studentId: string) => bookmarks.some(b => b.studentId === studentId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-semibold text-foreground">HR Dashboard</h1>
                <p className="text-sm text-muted-foreground">Talent Discovery & Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="sm">Home</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground">Available candidates</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookmarked</CardTitle>
              <BookmarkPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookmarks.length}</div>
              <p className="text-xs text-muted-foreground">Saved profiles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Domains</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{domains.length}</div>
              <p className="text-xs text-muted-foreground">Skill categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg GPA</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {students.length > 0 ? (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(1) : '0.0'}
              </div>
              <p className="text-xs text-muted-foreground">Performance metric</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="browse">Browse Talent</TabsTrigger>
            <TabsTrigger value="bookmarks">My Bookmarks</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search & Filter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by name or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <select
                    value={filterDomain}
                    onChange={(e) => setFilterDomain(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="">All Domains</option>
                    {domains.map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map(student => (
                <Card key={student.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{student.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {student.location}
                        </CardDescription>
                      </div>
                      <Button
                        variant={isBookmarked(student.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (isBookmarked(student.id)) {
                            const bookmark = bookmarks.find(b => b.studentId === student.id);
                            if (bookmark) removeBookmark(bookmark.id);
                          } else {
                            addBookmark(student);
                          }
                        }}
                      >
                        <BookmarkPlus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{student.domain}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning fill-current" />
                        <span className="text-sm font-medium">{student.gpa}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {student.skills.slice(0, 3).map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {student.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{student.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {student.ai_summary}
                    </p>

                    <div className="flex gap-2">
                      {student.linkedin && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={student.linkedin} target="_blank" rel="noopener noreferrer">
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {student.github && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={student.github} target="_blank" rel="noopener noreferrer">
                            GitHub
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">No profiles found</p>
                  <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="bookmarks" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">My Bookmarks</h2>
              {bookmarks.length > 0 && (
                <Button onClick={exportBookmarks}>
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              )}
            </div>

            {bookmarks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookmarkPlus className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">No bookmarks yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Start bookmarking profiles to save them here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.map(bookmark => {
                  const student = students.find(s => s.id === bookmark.studentId);
                  if (!student) return null;

                  return (
                    <Card key={bookmark.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{student.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              Saved {new Date(bookmark.createdAt.seconds * 1000).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeBookmark(bookmark.id)}
                          >
                            <BookmarkPlus className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{student.domain}</Badge>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-warning fill-current" />
                            <span className="text-sm font-medium">{student.gpa}</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {student.skills.slice(0, 3).map(skill => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {student.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{student.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {student.linkedin && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={student.linkedin} target="_blank" rel="noopener noreferrer">
                                LinkedIn
                              </a>
                            </Button>
                          )}
                          {student.github && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={student.github} target="_blank" rel="noopener noreferrer">
                                GitHub
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default HRDashboard;