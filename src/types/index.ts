export interface User {
  id: string;
  name: string;
  role: "doctor" | "designer";
  status: "active" | "offline";
  avatar: string;
}

export interface Order {
  id: string;
  patient_name: string;
  patient_age?: number;
  patient_gender?: string;
  status: "in_progress" | "waiting_review" | "completed" | "canceled";
  is_resubmitted: boolean;
  original_order_id?: string;
  lab_type: string;
  priority: "high" | "medium" | "low";
  due_date: string;
  case_type: string;
  practice?: string;
  address?: string;
  scanner?: string;
  app_source?: string;
}

export interface Task {
  id: string;
  order_id: string;
  assigned_to: string;
  status: "pending" | "in_progress" | "completed" | "skipped";
  due_date: string;
  order?: Order;
}

export interface TimelineEvent {
  id: string;
  order_id: string;
  stage: "order_placed" | "design" | "qc" | "preview" | "model";
  action_by: string;
  timestamp: string;
}

export interface DesignReview {
  id: string;
  task_id: string;
  decision: "approved" | "rejected" | "revision_needed";
  notes: string;
}

export type Priority = "high" | "medium" | "low";
