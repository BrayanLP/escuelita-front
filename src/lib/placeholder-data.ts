
import type { Course, Instructor, Review, Lesson, UserProfileData, ForumThread, ForumPost } from './types';

const instructors: Instructor[] = [
  { id: 'inst1', name: 'Dr. Ada Lovelace', bio: 'Pioneer in computer science and expert in algorithms.', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'inst2', name: 'Prof. Alan Turing', bio: 'Specialist in AI and theoretical computer science.', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'inst3', name: 'Grace Hopper', bio: 'Expert in compilers and programming languages.', avatarUrl: 'https://placehold.co/100x100.png' },
];

const reviews: Review[] = [
  { id: 'rev1', userId: 'user1', userName: 'Alice Wonderland', rating: 5, comment: 'Amazing course, learned a lot!', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), userAvatarUrl: 'https://placehold.co/40x40.png' },
  { id: 'rev2', userId: 'user2', userName: 'Bob The Builder', rating: 4, comment: 'Good content, well explained.', createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), userAvatarUrl: 'https://placehold.co/40x40.png' },
  { id: 'rev3', userId: 'user3', userName: 'Charlie Chaplin', rating: 5, comment: 'Highly recommended for beginners!', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), userAvatarUrl: 'https://placehold.co/40x40.png' },
];

const sampleLessons: Lesson[] = [
  { 
    id: 'les1.1', title: 'Welcome & Course Overview', duration: '10min', 
    videoPlaceholderImageUrl: 'https://placehold.co/800x450.png',
    videoImageHint: 'welcome presentation',
    resources: [{id: 'res1.1.1', name: 'Course Syllabus PDF', url: '#' }] 
  },
  { 
    id: 'les1.2', title: 'Setting Up Your Dev Environment', duration: '25min',
    videoPlaceholderImageUrl: 'https://placehold.co/800x450.png',
    videoImageHint: 'code editor setup'
  },
  { 
    id: 'les2.1', title: 'Core Concept: The DOM', duration: '45min',
    videoPlaceholderImageUrl: 'https://placehold.co/800x450.png',
    videoImageHint: 'abstract network'
  },
  { 
    id: 'les2.2', title: 'Building Your First Component', duration: '1hr 30min',
    videoPlaceholderImageUrl: 'https://placehold.co/800x450.png',
    videoImageHint: 'team collaboration',
    resources: [
      {id: 'res2.2.1', name: 'Starter Code (zip)', url: '#' },
      {id: 'res2.2.2', name: 'Completed Example (zip)', url: '#' }
    ]
  },
  {
    id: 'les3.1', title: 'Advanced State Management', duration: '1hr 15min',
    videoPlaceholderImageUrl: 'https://placehold.co/800x450.png',
    videoImageHint: 'complex diagram'
  }
];

export const courses: Course[] = [
  {
    id: 'course1',
    title: 'Introduction to Web Development',
    tagline: 'Learn to build modern websites from scratch.',
    description: 'A comprehensive introduction to HTML, CSS, and JavaScript.',
    longDescription: 'This course covers the foundational elements of web development. You will start with basic HTML structure, move on to styling with CSS, and finally add interactivity with JavaScript. By the end, you will be able to build your own responsive websites.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'web development code',
    category: 'Development',
    price: 49.99,
    currency: 'USD',
    instructors: [instructors[0]],
    lessons: sampleLessons.slice(0, 3), // Assign some lessons
    reviews: [reviews[0], reviews[1]],
    rating: 4.5,
    enrollmentCount: 1250,
  },
  {
    id: 'course2',
    title: 'Advanced JavaScript Concepts',
    tagline: 'Master the tricky parts of JavaScript.',
    description: 'Deep dive into closures, prototypes, and async programming.',
    longDescription: 'Take your JavaScript skills to the next level. This course explores advanced topics often missed by developers, including closures, the prototype chain, asynchronous programming with Promises and async/await, and functional programming patterns in JavaScript.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'javascript logo',
    category: 'Development',
    price: 79.99,
    currency: 'USD',
    instructors: [instructors[1], instructors[0]],
    lessons: sampleLessons.slice(1, 4), // Assign different lessons
    reviews: [reviews[2]],
    rating: 4.8,
    enrollmentCount: 870,
  },
  {
    id: 'course3',
    title: 'Data Science with Python',
    tagline: 'Unlock insights from data using Python.',
    description: 'Learn Pandas, NumPy, Matplotlib, and Scikit-learn.',
    longDescription: 'Enter the exciting field of data science. This course teaches you how to manipulate, analyze, and visualize data using powerful Python libraries. You will work on real-world datasets and learn the fundamentals of machine learning.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'data science chart',
    category: 'Data Science',
    price: 99.99,
    currency: 'USD',
    instructors: [instructors[2]],
    lessons: sampleLessons, // Assign all lessons
    reviews: [],
    rating: 4.2,
    enrollmentCount: 2100,
  },
];

export const userProfiles: UserProfileData[] = [
  {
    id: 'user1',
    name: 'Alice Wonderland',
    email: 'alice@example.com',
    avatarUrl: 'https://placehold.co/150x150.png',
    bio: 'Curious learner exploring the world of tech.',
    joinedDate: new Date(Date.now() - 86400000 * 30).toISOString(),
    completedCourses: [
      { id: 'course1', title: 'Introduction to Web Development', imageUrl: 'https://placehold.co/100x60.png', category: 'Development' }
    ],
    joinedCommunities: [
      { id: 'comm1', name: 'Web Dev Beginners', imageUrl: 'https://placehold.co/50x50.png' }
    ],
    discussionsParticipated: [
      { id: 'thread1-course1', title: 'Trouble with CSS Flexbox', courseId: 'course1' },
      { id: 'community-thread1', title: 'General Chat about Web Development Trends'}
    ]
  },
  {
    id: 'user2',
    name: 'Bob The Builder',
    email: 'bob@example.com',
    avatarUrl: 'https://placehold.co/150x150.png',
    bio: 'Passionate about building things, digital and physical.',
    joinedDate: new Date(Date.now() - 86400000 * 60).toISOString(),
    completedCourses: [
        { id: 'course1', title: 'Introduction to Web Development', imageUrl: 'https://placehold.co/100x60.png', category: 'Development' },
        { id: 'course2', title: 'Advanced JavaScript Concepts', imageUrl: 'https://placehold.co/100x60.png', category: 'Development' }
    ],
    joinedCommunities: [],
    discussionsParticipated: [
      { id: 'thread1-course2', title: 'Understanding JavaScript Closures', courseId: 'course2' },
      { id: 'community-thread2', title: 'Favorite Frontend Frameworks in 2024?'}
    ]
  }
];

const forumPosts: ForumPost[] = [
    { id: 'post1-thread1-course1', userId: 'user1', userName: 'Alice Wonderland', userAvatarUrl: 'https://placehold.co/40x40.png', content: 'I am having some trouble understanding how flexbox works for responsive layouts. Can anyone help?', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'post2-thread1-course1', userId: 'user2', userName: 'Bob The Builder', userAvatarUrl: 'https://placehold.co/40x40.png', content: 'Flexbox can be tricky! What specific part are you struggling with? Maybe share some code?', createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString() },
    { id: 'post3-thread1-course1', userId: 'user1', userName: 'Alice Wonderland', userAvatarUrl: 'https://placehold.co/40x40.png', content: 'Thanks Bob! It\'s mostly about `justify-content` and `align-items` when the container resizes.', createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 'post1-thread1-course2', userId: 'user2', userName: 'Bob The Builder', userAvatarUrl: 'https://placehold.co/40x40.png', content: 'Closures in JavaScript seem like magic. How do they really work under the hood?', createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: 'post2-thread1-course2', userId: 'inst2', userName: 'Prof. Alan Turing', userAvatarUrl: 'https://placehold.co/40x40.png', content: 'A closure gives you access to an outer function’s scope from an inner function. Think of it as a function bundling its lexical environment.', createdAt: new Date(Date.now() - 86400000 * 3.5).toISOString() },
    { id: 'post1-community-thread1', userId: 'user1', userName: 'Alice Wonderland', userAvatarUrl: 'https://placehold.co/40x40.png', content: 'Hey everyone! What are some of the most exciting web development trends you are seeing this year?', createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 'post2-community-thread1', userId: 'user2', userName: 'Bob The Builder', userAvatarUrl: 'https://placehold.co/40x40.png', content: 'I think AI integration into web apps is huge. Also, server components are changing how we build things.', createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString() },
    { id: 'post1-community-thread2', userId: 'user2', userName: 'Bob The Builder', userAvatarUrl: 'https://placehold.co/40x40.png', content: 'What are your go-to frontend frameworks these days? Still React, or are Svelte/Vue gaining more ground for you?', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
];

export let forumThreads: ForumThread[] = [
  { 
    id: 'thread1-course1', 
    courseId: 'course1', 
    title: 'Trouble with CSS Flexbox', 
    authorId: 'user1', 
    authorName: 'Alice Wonderland', 
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), 
    lastActivityAt: new Date(Date.now() - 86400000 * 1).toISOString(), 
    postCount: 3,
    posts: [forumPosts[0], forumPosts[1], forumPosts[2]]
  },
  { 
    id: 'thread2-course1', 
    courseId: 'course1', 
    title: 'Best resources for JavaScript practice?', 
    authorId: 'user2', 
    authorName: 'Bob The Builder', 
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), 
    lastActivityAt: new Date(Date.now() - 86400000 * 4.5).toISOString(), 
    postCount: 1,
    posts: [{ id: 'post1-thread2c1', userId: 'user2', userName: 'Bob The Builder', content: 'Looking for websites or platforms to practice JS problems.', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), userAvatarUrl: 'https://placehold.co/40x40.png' }]
  },
  { 
    id: 'thread1-course2', 
    courseId: 'course2', 
    title: 'Understanding JavaScript Closures', 
    authorId: 'user2', 
    authorName: 'Bob The Builder', 
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), 
    lastActivityAt: new Date(Date.now() - 86400000 * 3.5).toISOString(), 
    postCount: 2,
    posts: [forumPosts[3], forumPosts[4]]
  },
  {
    id: 'community-thread1',
    title: 'General Chat about Web Development Trends',
    authorId: 'user1',
    authorName: 'Alice Wonderland',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    lastActivityAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    postCount: 2,
    posts: [forumPosts[5], forumPosts[6]]
  },
  {
    id: 'community-thread2',
    title: 'Favorite Frontend Frameworks in 2024?',
    authorId: 'user2',
    authorName: 'Bob The Builder',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    lastActivityAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    postCount: 1,
    posts: [forumPosts[7]]
  }
];

export const getCourseById = (id: string): Course | undefined => courses.find(c => c.id === id);
export const getThreadsByCourseId = (courseId: string): ForumThread[] => forumThreads.filter(t => t.courseId === courseId);
export const getCommunityThreads = (): ForumThread[] => forumThreads.filter(t => !t.courseId);
export const getThreadById = (id: string): ForumThread | undefined => forumThreads.find(t => t.id === id);
export const getUserProfileById = (id: string): UserProfileData | undefined => userProfiles.find(u => u.id === id);

export const addPostToThread = (threadId: string, postContent: string, userId: string): ForumPost | undefined => {
  const thread = getThreadById(threadId);
  const user = getUserProfileById(userId);
  if (thread && user) {
    const newPost: ForumPost = {
      id: `post${Date.now()}-${threadId}`,
      userId: user.id,
      userName: user.name,
      userAvatarUrl: user.avatarUrl,
      content: postContent,
      createdAt: new Date().toISOString(),
    };
    thread.posts.push(newPost);
    thread.postCount = thread.posts.length;
    thread.lastActivityAt = new Date().toISOString();
    return newPost;
  }
  return undefined;
};

export const createThread = (title: string, firstPostContent: string, userId: string, courseId?: string): ForumThread | undefined => {
  const user = getUserProfileById(userId);
  if (!user) return undefined;
  if (courseId) {
      const course = getCourseById(courseId);
      if (!course) return undefined; 
  }

  const newThreadId = `thread${Date.now()}${courseId ? `-${courseId}` : '-community'}`;
  const firstPost: ForumPost = {
    id: `post${Date.now()}-${newThreadId}`,
    userId: user.id,
    userName: user.name,
    userAvatarUrl: user.avatarUrl,
    content: firstPostContent,
    createdAt: new Date().toISOString(),
  };
  const newThread: ForumThread = {
    id: newThreadId,
    courseId: courseId,
    title,
    authorId: user.id,
    authorName: user.name,
    createdAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
    postCount: 1,
    posts: [firstPost],
  };
  forumThreads.push(newThread);
  return newThread;
};

export const createCommunityThread = (title: string, firstPostContent: string, userId: string): ForumThread | undefined => {
    return createThread(title, firstPostContent, userId, undefined);
};
