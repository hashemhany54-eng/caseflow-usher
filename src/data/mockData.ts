import { Order, Task, TimelineEvent, DesignReview, User } from "@/types";

export const mockUser: User = {
  id: "u1",
  name: "Dr. Sarah Chen",
  role: "doctor",
  status: "active",
  avatar: "",
};

const now = Date.now();
const hour = 3600000;

export const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    patient_name: "James Wilson",
    patient_age: 45,
    patient_gender: "Male",
    status: "in_progress",
    is_resubmitted: true,
    original_order_id: "ORD-2024-000",
    lab_type: "Crown & Bridge",
    priority: "high",
    due_date: new Date(now - hour).toISOString(),
    case_type: "Crown Restoration",
    practice: "Sunrise Dental",
    address: "123 Main St, Austin TX",
    scanner: "iTero Element 5D",
    app_source: "Desktop",
  },
  {
    id: "ORD-2024-002",
    patient_name: "Emily Rodriguez",
    patient_age: 32,
    patient_gender: "Female",
    status: "waiting_review",
    is_resubmitted: false,
    lab_type: "Orthodontics",
    priority: "medium",
    due_date: new Date(now + hour * 0.5).toISOString(),
    case_type: "Aligner Design",
    practice: "SmileCare Ortho",
    address: "456 Oak Ave, Dallas TX",
    scanner: "3Shape TRIOS",
    app_source: "Mobile",
  },
  {
    id: "ORD-2024-003",
    patient_name: "Robert Kim",
    patient_age: 58,
    patient_gender: "Male",
    status: "in_progress",
    is_resubmitted: false,
    lab_type: "Implants",
    priority: "low",
    due_date: new Date(now + hour * 8).toISOString(),
    case_type: "Implant Abutment",
    practice: "Premier Dental Group",
    address: "789 Elm Blvd, Houston TX",
    scanner: "Medit i700",
    app_source: "Desktop",
  },
  {
    id: "ORD-2024-004",
    patient_name: "Maria Santos",
    patient_age: 27,
    patient_gender: "Female",
    status: "completed",
    is_resubmitted: false,
    lab_type: "Crown & Bridge",
    priority: "low",
    due_date: new Date(now - hour * 2).toISOString(),
    case_type: "Veneer Design",
    practice: "Aesthetic Dentistry",
    address: "321 Pine Rd, San Antonio TX",
    scanner: "iTero Element 5D",
    app_source: "Desktop",
  },
  {
    id: "ORD-2024-005",
    patient_name: "David Thompson",
    patient_age: 63,
    patient_gender: "Male",
    status: "canceled",
    is_resubmitted: false,
    lab_type: "Removables",
    priority: "low",
    due_date: new Date(now + hour * 24).toISOString(),
    case_type: "Full Denture",
    practice: "Family Dental",
    address: "654 Maple Dr, Fort Worth TX",
    scanner: "3Shape TRIOS",
    app_source: "Mobile",
  },
];

export const mockTasks: Task[] = [
  {
    id: "TSK-001",
    order_id: "ORD-2024-001",
    assigned_to: "u1",
    status: "in_progress",
    due_date: mockOrders[0].due_date,
    order: mockOrders[0],
  },
  {
    id: "TSK-002",
    order_id: "ORD-2024-002",
    assigned_to: "u1",
    status: "pending",
    due_date: mockOrders[1].due_date,
    order: mockOrders[1],
  },
  {
    id: "TSK-003",
    order_id: "ORD-2024-003",
    assigned_to: "u1",
    status: "in_progress",
    due_date: mockOrders[2].due_date,
    order: mockOrders[2],
  },
];

export const mockTimeline: Record<string, TimelineEvent[]> = {
  "ORD-2024-001": [
    { id: "te1", order_id: "ORD-2024-001", stage: "order_placed", action_by: "System", timestamp: new Date(now - hour * 48).toISOString() },
    { id: "te2", order_id: "ORD-2024-001", stage: "design", action_by: "Dr. Sarah Chen", timestamp: new Date(now - hour * 24).toISOString() },
    { id: "te3", order_id: "ORD-2024-001", stage: "qc", action_by: "QC Team", timestamp: new Date(now - hour * 12).toISOString() },
  ],
  "ORD-2024-002": [
    { id: "te4", order_id: "ORD-2024-002", stage: "order_placed", action_by: "System", timestamp: new Date(now - hour * 24).toISOString() },
    { id: "te5", order_id: "ORD-2024-002", stage: "design", action_by: "Dr. Sarah Chen", timestamp: new Date(now - hour * 6).toISOString() },
  ],
  "ORD-2024-003": [
    { id: "te6", order_id: "ORD-2024-003", stage: "order_placed", action_by: "System", timestamp: new Date(now - hour * 12).toISOString() },
  ],
};
