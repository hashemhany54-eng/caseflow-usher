import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoRow } from "@/components/task-details/InfoRow";
import { ActivityPanel } from "@/components/task-details/ActivityPanel";
import { motion } from "framer-motion";
import { useState } from "react";

// Mock original order data for the cancelled order
const mockOriginalOrder = {
  id: "ORD-2024-000",
  patient_name: "Nikia Hebbard",
  patient_age: 27,
  patient_gender: "F",
  status: "canceled" as const,
  canceled_by: "Dentist",
  cancel_reason: "Cancelled and resubmitted with changes.",
  resubmitted_order_id: "ORD-2024-001",
  doctor_name: "Dr. Ismail Fathi",
  practice: "Union Street Dental",
  address: "130 union st., bennington, VT 05201",
  country: "United States",
  production_order: "Yes",
  lab_type: "Zircon",
  design_preview: true,
  designer_name: "In House",
  prep: "No",
  separate_model: true,
  qc_required: true,
  double_qc: false,
  shipping_type: "Not set (Defaults to Two-day)",
  app_source: "Chairside v1.98.0-alliedstar",
  scanner: "Vision - GIAC0145",
  laptop: "Dandy-DDCW0T3",
  tags: [],
  case_type: "Anterior",
  crown_type: "Full Contour Zirconia",
  priority: "high" as const,
  design_level: "Standard",
  timeline: [
    { stage: "Placed", date: "Dec 30", completed: true },
    { stage: "Design Preview", date: "Est. Jan 5", completed: false },
    { stage: "Ship by", date: "Jan 12", completed: false },
    { stage: "Cancelled", date: "Dec 31", completed: true, isCancelled: true },
  ],
};

// Mock activity events
const mockActivity = [
  {
    title: "Placed on Hold",
    time: "3:56AM",
    details: [
      "Reason: Needs",
      "Review GPT: All actions",
      "Practice-Facing: No",
      "Action performed by GPTActions",
    ],
  },
  {
    title: "Items Added To Order",
    time: "4:03AM",
    details: [
      "Item added: Matrix",
      "Action performed by Trish Schweizer",
      "(patricia.schweizer@meetdandy.com)",
    ],
  },
  {
    title: "Removed from On Hold",
    time: "4:08PM",
    details: [
      "Reason: Proceed",
      "Action performed by Marianne Estacio",
      "(marianne.estacio@meetdandy.com)",
    ],
  },
  {
    title: "Manufacturer Assignment Changed",
    time: "4:08PM",
    details: [
      "Decision logic: manual",
      "Assigned to: Zircon",
      "Action performed by Marianne Estacio",
      "(marianne.estacio@meetdandy.com)",
    ],
  },
  {
    title: "Order Cancelled",
    time: "6:49PM",
    details: [
      "Cancelled by: Dentist",
      "Action performed by Ismail Fathi",
      "(drismalifathi@gmail.com)",
    ],
  },
];

export default function OriginalOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const order = mockOriginalOrder;

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-1 overflow-hidden">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-auto p-4 md:p-6">
            <div className="max-w-5xl mx-auto space-y-4">
              {/* Resubmitted banner */}
              <Alert variant="destructive" className="flex items-center justify-between py-2.5 px-4">
                <div className="flex items-center">
                  <AlertTitle className="mb-0 text-sm font-medium">This order was canceled & resubmitted</AlertTitle>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="text-xs h-7 shrink-0 ml-4 bg-destructive/10 text-destructive hover:bg-destructive/20 border-0 shadow-none"
                  onClick={() => navigate(-1)}
                >
                  View new
                </Button>
              </Alert>

              {/* Cancelled alert */}
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>This order was canceled</AlertTitle>
                <AlertDescription>Canceled by: {order.canceled_by}</AlertDescription>
              </Alert>

              {/* Patient card */}
              <div className="rounded-lg border bg-card overflow-hidden">
                <div className="p-5 pb-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <span>Order ID: #{order.id}</span>
                      </div>
                      <h1 className="text-lg font-bold">{order.patient_name}</h1>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        {order.patient_age && <span>{order.patient_age}y</span>}
                        {order.patient_gender && <span>{order.patient_gender}</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* Doctor & Practice */}
                <div className="pt-3 pb-2 py-[8px] px-[20px]">
                  <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Doctor & Practice</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1">
                    <InfoRow label="Doctor" value={order.doctor_name} />
                    <InfoRow label="Practice" value={order.practice} />
                    <InfoRow label="Address" value={order.address} />
                    <InfoRow label="Country" value={order.country} />
                  </div>
                </div>

                <div className="border-t border-border mx-4" />

                {/* Order Details */}
                <div className="pt-3 py-[11px] pb-[20px] px-[20px]">
                  <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Order Details</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1">
                    <InfoRow label="Prod. Order" value={order.production_order} />
                    <InfoRow label="Lab" value={order.lab_type} />
                    <InfoRow label="Design Preview" value={order.design_preview} />
                    <InfoRow label="Designer" value={order.designer_name} />
                    <InfoRow label="Prep" value={order.prep} />
                    <InfoRow label="Sep. Model" value={order.separate_model} />
                    <InfoRow label="Design QC" value={order.qc_required ? "Required" : "Not Required"} />
                    <InfoRow label="Double QC?" value={order.double_qc} />
                    <InfoRow label="Shipping" value={order.shipping_type} />
                    <InfoRow label="App Source" value={order.app_source} />
                    <InfoRow label="Scanner" value={order.scanner} />
                    <InfoRow label="Laptop" value={order.laptop} />
                  </div>
                </div>
              </div>

              {/* Status tabs with timeline */}
              <div className="rounded-lg border bg-card">
                <Tabs defaultValue="status">
                  <div className="flex items-center border-b overflow-x-auto">
                    <TabsList className="h-10 bg-transparent rounded-none justify-start gap-0 p-0 px-5 flex-1 min-w-0">
                      {["TAT", "Status", "Tickets", "Review", "Design", "Zendesk"].map((tab) => (
                        <TabsTrigger
                          key={tab}
                          value={tab.toLowerCase()}
                          className="text-sm h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground px-4 text-muted-foreground"
                        >
                          {tab}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <div className="pr-5 shrink-0">
                      <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
                        Add Delay
                      </Button>
                    </div>
                  </div>

                  <TabsContent value="status" className="p-5 space-y-5">
                    <p className="text-destructive font-medium text-sm">{order.cancel_reason}</p>

                    {/* Timeline stepper */}
                    <div className="relative">
                      <div className="flex items-center w-full">
                        {order.timeline.map((step, i) => (
                          <div key={step.stage} className="flex-1 flex flex-col items-start gap-1">
                            {/* Progress bar */}
                            <div className="w-full flex items-center">
                              <div
                                className={`h-[3px] w-full rounded-full ${
                                  step.isCancelled
                                    ? "bg-transparent"
                                    : step.completed
                                    ? "bg-foreground"
                                    : "bg-muted"
                                }`}
                              />
                            </div>
                            <span
                              className={`text-xs font-medium mt-1 ${
                                step.isCancelled ? "text-destructive font-semibold" : "text-foreground"
                              }`}
                            >
                              {step.stage}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{step.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tat" className="p-5">
                    <div className="text-center text-muted-foreground text-sm py-6">TAT tracking view</div>
                  </TabsContent>
                  <TabsContent value="tickets" className="p-5">
                    <div className="text-center text-muted-foreground text-sm py-6">Tickets view coming soon</div>
                  </TabsContent>
                  <TabsContent value="review" className="p-5">
                    <div className="text-center text-muted-foreground text-sm py-6">Review history coming soon</div>
                  </TabsContent>
                  <TabsContent value="design" className="p-5">
                    <div className="text-center text-muted-foreground text-sm py-6">Design iterations coming soon</div>
                  </TabsContent>
                  <TabsContent value="zendesk" className="p-5">
                    <div className="text-center text-muted-foreground text-sm py-6">Zendesk integration coming soon</div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </motion.div>

          {/* Activity panel */}
          <ActivityPanel collapsed={chatCollapsed} onToggle={() => setChatCollapsed(!chatCollapsed)} />
        </div>
      </div>
    </div>
  );
}
