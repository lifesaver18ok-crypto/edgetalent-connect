import { Student } from "@/components/StudentCard";

export const mockStudents: Student[] = [
  {
    id: "STU001",
    name: "Sarah Chen",
    domain: "DS",
    skills: ["Python", "TensorFlow", "Pandas", "SQL", "Machine Learning", "Data Visualization"],
    resume_url: "https://example.com/resume/sarah-chen.pdf",
    linkedin: "https://linkedin.com/in/sarah-chen",
    github: "https://github.com/sarahchen",
    ai_summary: "Data scientist with strong foundations in ML algorithms and statistical analysis. Built predictive models for e-commerce and financial applications.",
    location: "San Francisco, CA",
    graduation_year: 2024,
    gpa: 3.8,
    projects: 12
  },
  {
    id: "STU002", 
    name: "Alex Rodriguez",
    domain: "WD",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Docker"],
    resume_url: "https://example.com/resume/alex-rodriguez.pdf",
    linkedin: "https://linkedin.com/in/alex-rodriguez",
    github: "https://github.com/alexrodriguez",
    ai_summary: "Full-stack developer specializing in React and modern web technologies. Led development of 3 production applications serving 10k+ users.",
    location: "Austin, TX",
    graduation_year: 2024,
    gpa: 3.9,
    projects: 18
  },
  {
    id: "STU003",
    name: "Priya Sharma",
    domain: "ML",
    skills: ["PyTorch", "Computer Vision", "NLP", "Deep Learning", "Python", "Kubernetes"],
    resume_url: "https://example.com/resume/priya-sharma.pdf",
    linkedin: "https://linkedin.com/in/priya-sharma",
    github: "https://github.com/priyasharma", 
    ai_summary: "ML engineer focused on computer vision and NLP. Developed real-time object detection systems and chatbot frameworks with 95% accuracy.",
    location: "Seattle, WA",
    graduation_year: 2024,
    gpa: 3.95,
    projects: 15
  },
  {
    id: "STU004",
    name: "Marcus Johnson",
    domain: "UI",
    skills: ["Figma", "Adobe Creative Suite", "React", "User Research", "Prototyping", "Design Systems"],
    resume_url: "https://example.com/resume/marcus-johnson.pdf",
    linkedin: "https://linkedin.com/in/marcus-johnson",
    github: "https://github.com/marcusjohnson",
    ai_summary: "UX/UI designer with strong technical skills. Created design systems for 5+ SaaS products and improved user engagement by 40%.",
    location: "New York, NY", 
    graduation_year: 2024,
    gpa: 3.7,
    projects: 22
  },
  {
    id: "STU005",
    name: "Emma Thompson",
    domain: "DS",
    skills: ["R", "Python", "Statistical Analysis", "Tableau", "Big Data", "Apache Spark"],
    resume_url: "https://example.com/resume/emma-thompson.pdf",
    linkedin: "https://linkedin.com/in/emma-thompson",
    github: "https://github.com/emmathompson",
    ai_summary: "Analytics specialist with expertise in statistical modeling and business intelligence. Delivered insights that drove $2M+ revenue growth.",
    location: "Chicago, IL",
    graduation_year: 2024,
    gpa: 3.85,
    projects: 10
  },
  {
    id: "STU006",
    name: "David Kim",
    domain: "BE",
    skills: ["Java", "Spring Boot", "Microservices", "PostgreSQL", "Redis", "Apache Kafka"],
    resume_url: "https://example.com/resume/david-kim.pdf",
    linkedin: "https://linkedin.com/in/david-kim",
    github: "https://github.com/davidkim",
    ai_summary: "Backend engineer specializing in scalable systems architecture. Built microservices handling 1M+ requests per day with 99.9% uptime.",
    location: "Los Angeles, CA",
    graduation_year: 2024,
    gpa: 3.75,
    projects: 14
  },
  {
    id: "STU007",
    name: "Jessica Liu",
    domain: "WD",
    skills: ["Vue.js", "JavaScript", "CSS", "Responsive Design", "Firebase", "Jest"],
    resume_url: "https://example.com/resume/jessica-liu.pdf",
    linkedin: "https://linkedin.com/in/jessica-liu", 
    github: "https://github.com/jessicaliu",
    ai_summary: "Frontend developer passionate about user experience and performance optimization. Reduced page load times by 60% across multiple projects.",
    location: "Boston, MA",
    graduation_year: 2024,
    gpa: 3.8,
    projects: 16
  },
  {
    id: "STU008",
    name: "Ahmed Hassan",
    domain: "ML",
    skills: ["TensorFlow", "Scikit-learn", "MLOps", "Docker", "Python", "Data Engineering"],
    resume_url: "https://example.com/resume/ahmed-hassan.pdf",
    linkedin: "https://linkedin.com/in/ahmed-hassan",
    github: "https://github.com/ahmedhassan",
    ai_summary: "MLOps engineer with experience in model deployment and monitoring. Streamlined ML pipelines reducing model deployment time by 70%.",
    location: "Phoenix, AZ",
    graduation_year: 2024,
    gpa: 3.9,
    projects: 11
  }
];

// Access key configurations
export const accessKeyConfigs = {
  "DS2006": {
    domain: "DS",
    count: 6,
    description: "Data Science Profiles"
  },
  "WD1010": {
    domain: "WD", 
    count: 10,
    description: "Web Development Profiles"
  },
  "ML0504": {
    domain: "ML",
    count: 4,
    description: "Machine Learning Profiles"
  },
  "UI0805": {
    domain: "UI",
    count: 5,
    description: "UI/UX Design Profiles"
  },
  "BE0708": {
    domain: "BE",
    count: 8,
    description: "Backend Engineering Profiles"
  }
};

export function getStudentsForKey(accessKey: string): Student[] {
  const config = accessKeyConfigs[accessKey as keyof typeof accessKeyConfigs];
  if (!config) return [];
  
  const domainStudents = mockStudents.filter(student => student.domain === config.domain);
  return domainStudents.slice(0, config.count);
}