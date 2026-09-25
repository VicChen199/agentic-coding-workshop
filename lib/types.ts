export type MeetingDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

export type Course = {
  code: string;
  title: string;
  department: string;
  credits: number;
  instructor: string;
  description: string;
  meetingDays: MeetingDay[];
  startTime: string;
  endTime: string;
  startDate: string;
  prerequisites: string[];
};

export type Review = {
  id: string;
  courseCode: string;
  rating: number;
  workloadHours: number;
  comment: string;
  author: string;
  createdAt: string;
};

export type Seed = {
  courses: Course[];
  reviews: Review[];
};
