
// Mock data for the Magic On Tap Admin dashboard

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: "active" | "inactive";
};

export type PRSession = {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: number;
  status: "scheduled" | "completed" | "canceled";
};

// Mock statistics
export const statistics = {
  totalUsers: 127,
  activeUsers: 98,
  totalSessions: 45,
  completedSessions: 32,
  userGrowthRate: 12.5,
  sessionCompletionRate: 71,
};

// Mock users data
export const users: User[] = [
  {
    id: "usr_1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    lastLogin: "2023-04-07T10:30:00",
    status: "active",
  },
  {
    id: "usr_2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "User",
    lastLogin: "2023-04-06T14:45:00",
    status: "active",
  },
  {
    id: "usr_3",
    name: "Mike Johnson",
    email: "mike.j@example.com",
    role: "User",
    lastLogin: "2023-04-05T09:15:00",
    status: "active",
  },
  {
    id: "usr_4",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    role: "Manager",
    lastLogin: "2023-04-04T16:20:00",
    status: "inactive",
  },
  {
    id: "usr_5",
    name: "David Lee",
    email: "david.lee@example.com",
    role: "User",
    lastLogin: "2023-04-03T11:50:00",
    status: "active",
  },
];

// Mock PR Sessions data
export const prSessions: PRSession[] = [
  {
    id: "ses_1",
    title: "Sprint Planning Session",
    date: "2023-04-10T09:00:00",
    duration: "1.5 hours",
    participants: 8,
    status: "scheduled",
  },
  {
    id: "ses_2",
    title: "Code Review Workshop",
    date: "2023-04-05T14:00:00",
    duration: "2 hours",
    participants: 12,
    status: "completed",
  },
  {
    id: "ses_3",
    title: "Team Retrospective",
    date: "2023-04-03T11:00:00",
    duration: "1 hour",
    participants: 6,
    status: "completed",
  },
  {
    id: "ses_4",
    title: "Architecture Planning",
    date: "2023-04-01T10:00:00",
    duration: "3 hours",
    participants: 5,
    status: "completed",
  },
  {
    id: "ses_5",
    title: "Onboarding Session",
    date: "2023-04-12T15:00:00",
    duration: "2 hours",
    participants: 3,
    status: "scheduled",
  },
];
