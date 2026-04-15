import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Batch {
  id: string;
  name: string;
  description: string;
  schedule: string; // e.g., "Morning", "Evening", "Sunday"
  createdDate: string;
  studentCount: number;
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  enrolledDate: string;
  status: "active" | "inactive";
  batchId?: string; // Batch enrollment
}

export type VisibilityType = "ALL" | "SELECTIVE" | "BATCH";

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "doc" | "note";
  uploadDate: string;
  visibilityType: VisibilityType;
  selectedStudents?: string[]; // student IDs
  batchId?: string; // Batch-specific content
  fileUrl?: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  uploadDate: string;
  visibilityType: VisibilityType;
  selectedStudents?: string[]; // student IDs
  batchId?: string; // Batch-specific video
  videoUrl?: string;
}

export interface Test {
  id: string;
  testNo: number;
  testDate: string;
  portion: string;
  startTime: string;
  endTime: string;
  cbtLink: string;
  status: "closed" | "active" | "upcoming";
  batchId: string;
  createdDate: string;
}

interface DataContextType {
  batches: Batch[];
  addBatch: (batch: Omit<Batch, "id" | "createdDate" | "studentCount">) => void;
  updateBatch: (id: string, batch: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;

  students: Student[];
  addStudent: (student: Omit<Student, "id">) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudentsByBatch: (batchId: string) => Student[];

  content: ContentItem[];
  addContent: (item: Omit<ContentItem, "id" | "uploadDate">) => void;
  deleteContent: (id: string) => void;
  getContentByBatch: (batchId: string) => ContentItem[];

  videos: Video[];
  addVideo: (video: Omit<Video, "id" | "uploadDate">) => void;
  deleteVideo: (id: string) => void;
  getVideosByBatch: (batchId: string) => Video[];

  tests: Test[];
  addTest: (test: Omit<Test, "id" | "createdDate">) => void;
  updateTest: (id: string, test: Partial<Test>) => void;
  deleteTest: (id: string) => void;
  getTestsByBatch: (batchId: string) => Test[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const initialBatches: Batch[] = [
  {
    id: "1",
    name: "Morning Batch",
    description: "Classes from 6:00 AM to 12:00 PM",
    schedule: "Monday to Friday, 6:00 AM - 12:00 PM",
    createdDate: "2024-01-01",
    studentCount: 2,
  },
  {
    id: "2",
    name: "Evening Batch",
    description: "Classes from 4:00 PM to 9:00 PM",
    schedule: "Monday to Friday, 4:00 PM - 9:00 PM",
    createdDate: "2024-01-01",
    studentCount: 2,
  },
  {
    id: "3",
    name: "Sunday Special Batch",
    description: "Classes on Sunday",
    schedule: "Sunday, 9:00 AM - 5:00 PM",
    createdDate: "2024-01-15",
    studentCount: 0,
  },
];

const initialStudents: Student[] = [
  {
    id: "1",
    studentId: "STU2024001",
    name: "John Doe",
    email: "john.doe@student.edu",
    enrolledDate: "2024-01-15",
    status: "active",
    batchId: "1", // Morning Batch
  },
  {
    id: "2",
    studentId: "STU2024002",
    name: "Jane Smith",
    email: "jane.smith@student.edu",
    enrolledDate: "2024-01-20",
    status: "active",
    batchId: "1", // Morning Batch
  },
  {
    id: "3",
    studentId: "STU2024003",
    name: "Mike Johnson",
    email: "mike.j@student.edu",
    enrolledDate: "2024-02-01",
    status: "active",
    batchId: "2", // Evening Batch
  },
  {
    id: "4",
    studentId: "STU2024004",
    name: "Sarah Williams",
    email: "sarah.w@student.edu",
    enrolledDate: "2024-02-10",
    status: "active",
    batchId: "2", // Evening Batch
  },
];

const initialContent: ContentItem[] = [
  {
    id: "1",
    title: "Introduction to Computer Science",
    description: "Fundamental concepts and programming basics",
    type: "pdf",
    uploadDate: "2024-03-01",
    visibilityType: "BATCH",
    batchId: "1", // For Morning Batch
  },
  {
    id: "2",
    title: "Data Structures & Algorithms",
    description: "Comprehensive guide to DSA",
    type: "pdf",
    uploadDate: "2024-03-05",
    visibilityType: "BATCH",
    batchId: "2", // For Evening Batch
  },
  {
    id: "3",
    title: "Web Development Notes",
    description: "HTML, CSS, JavaScript fundamentals",
    type: "note",
    uploadDate: "2024-03-10",
    visibilityType: "ALL",
  },
];

const initialVideos: Video[] = [
  {
    id: "1",
    title: "Introduction to Programming",
    description: "Learn the basics of programming with Python",
    thumbnail:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
    duration: "45:30",
    uploadDate: "2024-03-01",
    visibilityType: "BATCH",
    batchId: "1", // For Morning Batch
  },
  {
    id: "2",
    title: "Advanced JavaScript Concepts",
    description: "Deep dive into closures, promises, and async/await",
    thumbnail:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
    duration: "1:20:15",
    uploadDate: "2024-03-08",
    visibilityType: "BATCH",
    batchId: "2", // For Evening Batch
  },
  {
    id: "3",
    title: "Database Design Fundamentals",
    description: "Learn SQL and database normalization",
    thumbnail:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80",
    duration: "55:20",
    uploadDate: "2024-03-15",
    visibilityType: "ALL",
  },
];

const initialTests: Test[] = [
  {
    id: "1",
    testNo: 1,
    testDate: "28.02.26",
    portion: "Unit-1 Descriptive Statistics",
    startTime: "6:00 AM",
    endTime: "7:30 AM",
    cbtLink: "https://exam.example.com/test1",
    status: "closed",
    batchId: "1",
    createdDate: "2024-02-10",
  },
  {
    id: "2",
    testNo: 2,
    testDate: "22.03.26",
    portion: "Unit – 2 Probability",
    startTime: "2:00 PM",
    endTime: "3:30 PM",
    cbtLink: "https://exam.example.com/test2",
    status: "closed",
    batchId: "1",
    createdDate: "2024-02-15",
  },
  {
    id: "3",
    testNo: 3,
    testDate: "29.03.26",
    portion: "Unit – 3 Probability Distributions",
    startTime: "2:00 PM",
    endTime: "3:30 PM",
    cbtLink: "https://exam.example.com/test3",
    status: "closed",
    batchId: "1",
    createdDate: "2024-02-20",
  },
  {
    id: "4",
    testNo: 4,
    testDate: "05.04.26",
    portion: "Unit – 4 Estimation Theory",
    startTime: "2:00 PM",
    endTime: "3:30 PM",
    cbtLink: "https://exam.example.com/test4",
    status: "closed",
    batchId: "1",
    createdDate: "2024-02-25",
  },
  {
    id: "5",
    testNo: 5,
    testDate: "12.04.26",
    portion: "Unit – 5 Tests of Hypotheses",
    startTime: "2:00 PM",
    endTime: "3:30 PM",
    cbtLink: "https://exam.example.com/test5",
    status: "closed",
    batchId: "1",
    createdDate: "2024-03-01",
  },
  {
    id: "6",
    testNo: 6,
    testDate: "19.04.26",
    portion: "Unit – 6 Sampling & DOE",
    startTime: "2:00 PM",
    endTime: "3:30 PM",
    cbtLink: "https://exam.example.com/test6",
    status: "active",
    batchId: "1",
    createdDate: "2024-03-05",
  },
  {
    id: "7",
    testNo: 7,
    testDate: "26.04.26",
    portion: "Unit – 7 Time Series & Index Numbers",
    startTime: "2:00 PM",
    endTime: "3:30 PM",
    cbtLink: "https://exam.example.com/test7",
    status: "active",
    batchId: "1",
    createdDate: "2024-03-10",
  },
  {
    id: "8",
    testNo: 8,
    testDate: "03.05.26",
    portion: "Unit – 8,9,10 SQC, Vital Statistics, Statistical Computing",
    startTime: "2:00 PM",
    endTime: "3:30 PM",
    cbtLink: "https://exam.example.com/test8",
    status: "active",
    batchId: "1",
    createdDate: "2024-03-15",
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [batches, setBatches] = useState<Batch[]>(initialBatches);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [content, setContent] = useState<ContentItem[]>(initialContent);
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [tests, setTests] = useState<Test[]>(initialTests);

  const addBatch = (
    batch: Omit<Batch, "id" | "createdDate" | "studentCount">,
  ) => {
    const newBatch: Batch = {
      ...batch,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split("T")[0],
      studentCount: 0,
    };
    setBatches([...batches, newBatch]);
  };

  const updateBatch = (id: string, updates: Partial<Batch>) => {
    setBatches(batches.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBatch = (id: string) => {
    // Remove batch association from students
    setStudents(
      students.map((s) =>
        s.batchId === id ? { ...s, batchId: undefined } : s,
      ),
    );
    setBatches(batches.filter((b) => b.id !== id));
  };

  const addStudent = (student: Omit<Student, "id">) => {
    const newStudent = {
      ...student,
      id: Date.now().toString(),
    };
    setStudents([...students, newStudent]);

    // Update batch student count
    if (newStudent.batchId) {
      updateBatch(newStudent.batchId, {
        studentCount:
          batches.find((b) => b.id === newStudent.batchId)?.studentCount ||
          0 + 1,
      });
    }
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    const oldStudent = students.find((s) => s.id === id);
    setStudents(students.map((s) => (s.id === id ? { ...s, ...updates } : s)));

    // Update batch student counts if batch changed
    if (oldStudent && oldStudent.batchId !== updates.batchId) {
      if (oldStudent.batchId) {
        updateBatch(oldStudent.batchId, {
          studentCount: Math.max(
            0,
            (batches.find((b) => b.id === oldStudent.batchId)?.studentCount ||
              0) - 1,
          ),
        });
      }
      if (updates.batchId) {
        updateBatch(updates.batchId, {
          studentCount:
            (batches.find((b) => b.id === updates.batchId)?.studentCount || 0) +
            1,
        });
      }
    }
  };

  const deleteStudent = (id: string) => {
    const student = students.find((s) => s.id === id);
    setStudents(students.filter((s) => s.id !== id));

    // Update batch student count
    if (student?.batchId) {
      updateBatch(student.batchId, {
        studentCount: Math.max(
          0,
          (batches.find((b) => b.id === student.batchId)?.studentCount || 0) -
            1,
        ),
      });
    }
  };

  const getStudentsByBatch = (batchId: string): Student[] => {
    return students.filter((s) => s.batchId === batchId);
  };

  const addContent = (item: Omit<ContentItem, "id" | "uploadDate">) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString().split("T")[0],
    };
    setContent([...content, newItem]);
  };

  const deleteContent = (id: string) => {
    setContent(content.filter((c) => c.id !== id));
  };

  const getContentByBatch = (batchId: string): ContentItem[] => {
    return content.filter(
      (c) =>
        c.visibilityType === "ALL" ||
        (c.visibilityType === "BATCH" && c.batchId === batchId),
    );
  };

  const addVideo = (video: Omit<Video, "id" | "uploadDate">) => {
    const newVideo = {
      ...video,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString().split("T")[0],
    };
    setVideos([...videos, newVideo]);
  };

  const deleteVideo = (id: string) => {
    setVideos(videos.filter((v) => v.id !== id));
  };

  const getVideosByBatch = (batchId: string): Video[] => {
    return videos.filter(
      (v) =>
        v.visibilityType === "ALL" ||
        (v.visibilityType === "BATCH" && v.batchId === batchId),
    );
  };

  const addTest = (test: Omit<Test, "id" | "createdDate">) => {
    const newTest: Test = {
      ...test,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split("T")[0],
    };
    setTests([...tests, newTest]);
  };

  const updateTest = (id: string, updates: Partial<Test>) => {
    setTests(tests.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTest = (id: string) => {
    setTests(tests.filter((t) => t.id !== id));
  };

  const getTestsByBatch = (batchId: string): Test[] => {
    return tests
      .filter((t) => t.batchId === batchId)
      .sort((a, b) => a.testNo - b.testNo);
  };

  return (
    <DataContext.Provider
      value={{
        batches,
        addBatch,
        updateBatch,
        deleteBatch,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudentsByBatch,
        content,
        addContent,
        deleteContent,
        getContentByBatch,
        videos,
        addVideo,
        deleteVideo,
        getVideosByBatch,
        tests,
        addTest,
        updateTest,
        deleteTest,
        getTestsByBatch,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
