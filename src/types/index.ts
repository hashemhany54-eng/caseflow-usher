export interface User {
  id: string;
  name: string;
  role: "doctor" | "designer";
  status: "active" | "offline" | "away" | "pause" | "busy";
  avatar: string;
}

export interface Order {
  id: string;
  patient_name: string;
  patient_age?: number;
  patient_gender?: string;
  status: "new" | "in_progress" | "waiting_review" | "completed" | "canceled" | "on_hold" | "shipped" | "delivered";
  is_resubmitted: boolean;
  original_order_id?: string;
  lab_type: string;
  priority: "high" | "medium" | "low";
  due_date: string;
  case_type: string;
  crown_type?: string;
  practice?: string;
  doctor_name?: string;
  address?: string;
  country?: string;
  scanner?: string;
  app_source?: string;
  laptop?: string;
  shipping_type?: string;
  designer_name?: string;
  qc_reviewer?: string;
  qc_required?: boolean;
  double_qc?: boolean;
  design_level?: string;
  design_preview?: boolean;
  production_order?: string;
  prep?: string;
  separate_model?: boolean;
  tags?: string[];
  is_split?: boolean;
}

export interface Task {
  id: string;
  order_id: string;
  assigned_to: string;
  status: "pending" | "in_progress" | "completed" | "skipped";
  due_date: string;
  task_type?: string;
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

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  timestamp: string;
  type: "text" | "system" | "attachment";
  attachment_url?: string;
  attachment_name?: string;
}

export interface ChatRoom {
  id: string;
  order_id?: string;
  task_id?: string;
  name: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}

export type Priority = "high" | "medium" | "low";
