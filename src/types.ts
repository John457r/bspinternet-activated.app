export type SubmissionStatus = 'Pending Review' | 'Approved';

export interface Submission {
  id: string;
  userId: string;
  password: string;
  timestamp: string;
  status: SubmissionStatus;
}
