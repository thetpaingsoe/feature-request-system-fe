
// Type for a single Submission item
export type SubmissionLog = {
  id: number;
  type: string;
  data: string;
  user_object: UserType; 
  created_at: string;
  updated_at: string;
  status_change : StatusChangeType,
  feedback_message : string
  
};

type UserType = {
  id: string;
  name: string;
  email: string;
};

type StatusChangeType = {
  from: string;
  to: string;
};


export interface SubmissionLogPagination {
  data: SubmissionLog[];
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  links: InertiaPaginationLink[];
  total: number;
  per_page: number;
}

// Interface for a single Inertia pagination link
export interface InertiaPaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}
