
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

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string; // Placeholder for video content, e.g., a YouTube link or path to video file
  videoPlaceholderImageUrl?: string; // Image to show for the video area
  videoImageHint?: string;
  resources?: Array<{
    id: string;
    name: string;
    url: string; // URL for download
    // icon?: React.ElementType; // Could add specific icons per resource type later
  }>;
  // Add content field if lessons have text content besides video
  // content?: string; 
}

export interface Course {
  id: string;
  title: string;
  tagline: string;
  description: string; // Short description for course card
  longDescription: string; // Detailed description for course overview (if we keep an overview page)
  imageUrl: string; // For course card
  imageHint?: string;
  category: string;
  price: number;
  currency: string; // e.g., "USD"
  instructors: Instructor[]; // Might be shown on a separate course info tab or landing page
  lessons: Lesson[];
  reviews: Review[]; // Might be shown on a separate course info tab or landing page
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
}

export interface ForumThread {
  id: string;
  courseId?: string; 
  title: string;
  authorId: string;
  authorName: string;
  createdAt: string; 
  lastActivityAt: string; 
  postCount: number;
  posts: ForumPost[];
}
