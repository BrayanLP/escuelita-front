export interface Instructor {
  id: string;
  name: string;
  bio: string;
  avatarUrl?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO date string
}

export interface SyllabusModule {
  id: string;
  title: string;
  description: string;
  lessons: { id: string; title: string; duration: string }[];
}

export interface Course {
  id: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  imageHint?: string;
  category: string;
  price: number;
  currency: string; // e.g., "USD"
  instructors: Instructor[];
  syllabus: SyllabusModule[];
  reviews: Review[];
  rating: number; // Average rating
  enrollmentCount: number;
}

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  joinedDate: string; // ISO date string
  completedCourses: Pick<Course, 'id' | 'title' | 'imageUrl' | 'category'>[];
  // For "Joined Communities" - assuming this is a future feature, basic structure
  joinedCommunities: { id: string; name: string; imageUrl?: string }[]; 
  discussionsParticipated: Pick<ForumThread, 'id' | 'title' | 'courseId'>[];
}

export interface ForumPost {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  content: string;
  createdAt: string; // ISO date string
  // replies?: ForumPost[]; // For nested comments, if needed
}

export interface ForumThread {
  id: string;
  courseId: string;
  title: string;
  authorId: string;
  authorName: string;
  createdAt: string; // ISO date string
  lastActivityAt: string; // ISO date string
  postCount: number;
  posts: ForumPost[];
}
