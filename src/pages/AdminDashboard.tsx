import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Users, Database, Settings, ArrowLeft } from "lucide-react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Student } from "@/components/StudentCard";
import { Link } from "react-router-dom";

interface AccessKey {
  id: string;
  key: string;
  domain: string;
  count: number;
  description: string;
  isActive: boolean;
  createdAt: Date;
  usageCount?: number;
}

const AdminDashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [accessKeys, setAccessKeys] = useState<AccessKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: "",
    domain: "DS",
    skills: [],
    location: "",
    graduation_year: new Date().getFullYear(),
    gpa: 0,
    projects: 0,
    ai_summary: "",
    linkedin: "",
    github: "",
    resume_url: ""
  });
  const [newAccessKey, setNewAccessKey] = useState({
    key: "",
    domain: "DS",
    count: 5,
    description: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
    fetchAccessKeys();
  }, []);

  const fetchStudents = async () => {
    try {
      const q = query(collection(db, "students"), orderBy("name"));
      const querySnapshot = await getDocs(q);
      const studentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Student[];
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive"
      });
    }
  };

  const fetchAccessKeys = async () => {
    try {
      const q = query(collection(db, "accessKeys"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const keysData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as AccessKey[];
      setAccessKeys(keysData);
    } catch (error) {
      console.error("Error fetching access keys:", error);
      toast({
        title: "Error",
        description: "Failed to fetch access keys",
        variant: "destructive"
      });
    }
  };

  const addStudent = async () => {
    if (!newStudent.name || !newStudent.domain) {
      toast({
        title: "Error",
        description: "Name and domain are required",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const docRef = await addDoc(collection(db, "students"), {
        ...newStudent,
        skills: Array.isArray(newStudent.skills) ? newStudent.skills : [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const addedStudent = { id: docRef.id, ...newStudent } as Student;
      setStudents([...students, addedStudent]);
      setNewStudent({
        name: "",
        domain: "DS",
        skills: [],
        location: "",
        graduation_year: new Date().getFullYear(),
        gpa: 0,
        projects: 0,
        ai_summary: "",
        linkedin: "",
        github: "",
        resume_url: ""
      });
      
      toast({
        title: "Success",
        description: "Student added successfully"
      });
    } catch (error) {
      console.error("Error adding student:", error);
      toast({
        title: "Error",
        description: "Failed to add student",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const deleteStudent = async (studentId: string) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "students", studentId));
      setStudents(students.filter(s => s.id !== studentId));
      toast({
        title: "Success",
        description: "Student deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting student:", error);
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const addAccessKey = async () => {
    if (!newAccessKey.key || !newAccessKey.description) {
      toast({
        title: "Error",
        description: "Key and description are required",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const docRef = await addDoc(collection(db, "accessKeys"), {
        ...newAccessKey,
        isActive: true,
        createdAt: new Date(),
        usageCount: 0
      });
      
      const addedKey = { 
        id: docRef.id, 
        ...newAccessKey, 
        isActive: true, 
        createdAt: new Date(),
        usageCount: 0 
      } as AccessKey;
      setAccessKeys([addedKey, ...accessKeys]);
      setNewAccessKey({
        key: "",
        domain: "DS",
        count: 5,
        description: ""
      });
      
      toast({
        title: "Success",
        description: "Access key added successfully"
      });
    } catch (error) {
      console.error("Error adding access key:", error);
      toast({
        title: "Error",
        description: "Failed to add access key",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const toggleAccessKey = async (keyId: string, isActive: boolean) => {
    setIsLoading(true);
    try {
      await updateDoc(doc(db, "accessKeys", keyId), { isActive });
      setAccessKeys(accessKeys.map(key => 
        key.id === keyId ? { ...key, isActive } : key
      ));
      toast({
        title: "Success",
        description: `Access key ${isActive ? 'activated' : 'deactivated'}`
      });
    } catch (error) {
      console.error("Error updating access key:", error);
      toast({
        title: "Error",
        description: "Failed to update access key",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleSkillsChange = (value: string, isNewStudent = true) => {
    const skillsArray = value.split(',').map(s => s.trim()).filter(s => s);
    if (isNewStudent) {
      setNewStudent({ ...newStudent, skills: skillsArray });
    } else if (editingStudent) {
      setEditingStudent({ ...editingStudent, skills: skillsArray });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                  Back to App
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <Badge variant="secondary">
              <Database className="w-4 h-4 mr-2" />
              Firebase Connected
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accessKeys.filter(k => k.isActive).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accessKeys.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Domains</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(students.map(s => s.domain)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">
              <Users className="w-4 h-4 mr-2" />
              Students
            </TabsTrigger>
            <TabsTrigger value="access-keys">
              <Settings className="w-4 h-4 mr-2" />
              Access Keys
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Student</CardTitle>
                <CardDescription>
                  Add a new student profile to the database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="domain">Domain</Label>
                    <Select
                      value={newStudent.domain}
                      onValueChange={(value) => setNewStudent({ ...newStudent, domain: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DS">Data Science</SelectItem>
                        <SelectItem value="WD">Web Development</SelectItem>
                        <SelectItem value="ML">Machine Learning</SelectItem>
                        <SelectItem value="UI">UI/UX Design</SelectItem>
                        <SelectItem value="BE">Backend Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newStudent.location}
                      onChange={(e) => setNewStudent({ ...newStudent, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gpa">GPA</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      max="4.0"
                      value={newStudent.gpa}
                      onChange={(e) => setNewStudent({ ...newStudent, gpa: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={Array.isArray(newStudent.skills) ? newStudent.skills.join(', ') : ''}
                    onChange={(e) => handleSkillsChange(e.target.value)}
                    placeholder="React, TypeScript, Node.js"
                  />
                </div>
                <div>
                  <Label htmlFor="summary">AI Summary</Label>
                  <Textarea
                    id="summary"
                    value={newStudent.ai_summary}
                    onChange={(e) => setNewStudent({ ...newStudent, ai_summary: e.target.value })}
                  />
                </div>
                <Button onClick={addStudent} disabled={isLoading}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Students ({students.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{student.name}</h3>
                          <Badge variant="outline">{student.domain}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{student.ai_summary}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{student.location}</span>
                          <span>GPA: {student.gpa}</span>
                          <span>{student.skills?.length || 0} skills</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteStudent(student.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access-keys" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Access Key</CardTitle>
                <CardDescription>
                  Create a new access key for specific domain access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="key">Access Key</Label>
                    <Input
                      id="key"
                      value={newAccessKey.key}
                      onChange={(e) => setNewAccessKey({ ...newAccessKey, key: e.target.value })}
                      placeholder="DS2024"
                    />
                  </div>
                  <div>
                    <Label htmlFor="keyDomain">Domain</Label>
                    <Select
                      value={newAccessKey.domain}
                      onValueChange={(value) => setNewAccessKey({ ...newAccessKey, domain: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DS">Data Science</SelectItem>
                        <SelectItem value="WD">Web Development</SelectItem>
                        <SelectItem value="ML">Machine Learning</SelectItem>
                        <SelectItem value="UI">UI/UX Design</SelectItem>
                        <SelectItem value="BE">Backend Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="count">Student Count</Label>
                    <Input
                      id="count"
                      type="number"
                      min="1"
                      value={newAccessKey.count}
                      onChange={(e) => setNewAccessKey({ ...newAccessKey, count: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newAccessKey.description}
                      onChange={(e) => setNewAccessKey({ ...newAccessKey, description: e.target.value })}
                      placeholder="Data Science Profiles"
                    />
                  </div>
                </div>
                <Button onClick={addAccessKey} disabled={isLoading}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Access Key
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Keys ({accessKeys.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accessKeys.map((accessKey) => (
                    <div key={accessKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{accessKey.key}</h3>
                          <Badge variant={accessKey.isActive ? "default" : "secondary"}>
                            {accessKey.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline">{accessKey.domain}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{accessKey.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Count: {accessKey.count}</span>
                          <span>Usage: {accessKey.usageCount || 0}</span>
                          <span>Created: {accessKey.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant={accessKey.isActive ? "outline" : "default"}
                          size="sm"
                          onClick={() => toggleAccessKey(accessKey.id, !accessKey.isActive)}
                          disabled={isLoading}
                        >
                          {accessKey.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;