// Employee data type for the table
export type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
  status: "Active" | "Inactive";
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  birthDate: string;
  emergencyContact: string;
  manager: string;
  startDate: string;
  performanceRating: number;
  bonus: number;
  vacationDays: number;
  sickDays: number;
  project: string;
  skills: string;
  education: string;
  experience: number;
  certification: string;
  teamSize: number;
  lastReview: string;
  nextReview: string;
  notes: string;
};

// Column pinning type
export type ColumnPinning = {
  left?: string[];
  right?: string[];
};
