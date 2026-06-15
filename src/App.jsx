import React, { useState, useEffect, useMemo } from "react";
import {
  Wrench, Monitor, Bell, LayoutDashboard, ClipboardList, PlusCircle,
  CheckCircle2, Clock, AlertTriangle, LogOut, Globe, Printer, Copy,
  Star, Users, Building2, Search, X, Camera, ThumbsUp, RotateCcw,
  Pause, Play, BarChart3, Shield, ChevronRight, Send, RefreshCw
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from "recharts";

/* ============================ THEME ============================ */
const C = {
  primary: "#0F4C5C",
  primaryDark: "#0A3744",
  primarySoft: "#E3EDEF",
  accent: "#E8A33D",
  accentDark: "#C9852A",
  bg: "#EEF2F3",
  card: "#FFFFFF",
  ink: "#16242A",
  sub: "#5B6B70",
  line: "#DDE5E7",
};

/* ============================ CONFIG (data-driven, bilingual) ============================ */
const BRANCHES = [
  { code: "BV", th: "สาขา BV", en: "Branch BV" },
  { code: "BP", th: "สาขา BP", en: "Branch BP" },
  { code: "BC", th: "สาขา BC", en: "Branch BC" },
  { code: "BM", th: "สาขา BM", en: "Branch BM" },
  { code: "BB", th: "สาขา BB", en: "Branch BB" },
  { code: "BE", th: "สาขา BE", en: "Branch BE" },
  { code: "GB", th: "สาขา GB", en: "Branch GB" },
];

const DEPTS = {
  maintenance: { th: "ช่าง", en: "Maintenance", icon: Wrench },
  it: { th: "ไอที", en: "IT", icon: Monitor },
};

const CATEGORIES = {
  maintenance: [
    { id: "elec", th: "ไฟฟ้า", en: "Electrical" },
    { id: "plumb", th: "ประปา", en: "Plumbing" },
    { id: "ac", th: "เครื่องปรับอากาศ", en: "Air conditioning" },
    { id: "furn", th: "เฟอร์นิเจอร์", en: "Furniture" },
    { id: "build", th: "ก่อสร้าง/ทาสี", en: "Building / Paint" },
    { id: "other_m", th: "อื่นๆ", en: "Other" },
  ],
  it: [
    { id: "pc", th: "คอมพิวเตอร์", en: "Computer" },
    { id: "net", th: "เครือข่าย/อินเทอร์เน็ต", en: "Network / Internet" },
    { id: "phone", th: "ระบบโทรศัพท์", en: "Phone system" },
    { id: "pms", th: "ระบบ PMS / POS", en: "PMS / POS system" },
    { id: "device", th: "อุปกรณ์ต่อพ่วง", en: "Peripheral device" },
    { id: "other_i", th: "อื่นๆ", en: "Other" },
  ],
};

const PRIORITIES = [
  { id: "critical", th: "ด่วนมาก", en: "Critical", sla: 2, color: "#DC2626" },
  { id: "high", th: "ด่วน", en: "High", sla: 8, color: "#D97706" },
  { id: "normal", th: "ปกติ", en: "Normal", sla: 24, color: "#2563EB" },
  { id: "low", th: "ต่ำ", en: "Low", sla: 72, color: "#6B7280" },
];

const STATUSES = {
  new: { th: "แจ้งใหม่", en: "New", color: "#2563EB" },
  accepted: { th: "รับงานแล้ว", en: "Accepted", color: "#0891B2" },
  in_progress: { th: "กำลังซ่อม", en: "In progress", color: "#D97706" },
  pending: { th: "งานค้าง", en: "On hold", color: "#DC2626" },
  review: { th: "รออนุมัติ", en: "Awaiting approval", color: "#7C3AED" },
  done: { th: "เสร็จสมบูรณ์", en: "Completed", color: "#059669" },
  rejected: { th: "ตีกลับให้แก้ไข", en: "Returned", color: "#B45309" },
};

const HOLD_REASONS = [
  { id: "parts", th: "รออะไหล่", en: "Waiting for parts" },
  { id: "budget", th: "รออนุมัติงบประมาณ", en: "Waiting for budget" },
  { id: "access", th: "เข้าพื้นที่/ห้องไม่ได้", en: "No access to area" },
  { id: "vendor", th: "รอผู้รับเหมาภายนอก", en: "Waiting for vendor" },
  { id: "other", th: "อื่นๆ", en: "Other" },
];

/* ============================ TRANSLATIONS (UI chrome) ============================ */
const T = {
  th: {
    appName: "ระบบแจ้งซ่อมออนไลน์", tagline: "งานช่าง & ไอที โรงแรม",
    login: "เข้าสู่ระบบ", username: "ชื่อผู้ใช้", password: "รหัสผ่าน",
    quickLogin: "เข้าสู่ระบบด่วน (สำหรับทดสอบ)", wrongLogin: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
    logout: "ออกจากระบบ", dashboard: "แดชบอร์ด", newTicket: "แจ้งซ่อม",
    myTickets: "งานที่ฉันแจ้ง", queue: "คิวงาน", approvals: "อนุมัติงาน",
    reports: "รายงาน & KPI", admin: "ผู้ดูแลระบบ", branch: "สาขา", allBranches: "ทุกสาขา",
    department: "แผนก", category: "หมวดปัญหา", priority: "ความเร่งด่วน",
    location: "ตำแหน่ง/สถานที่", locationPh: "เช่น ห้อง 305 / ล็อบบี้ / ครัวหลัก",
    title: "หัวข้อ", titlePh: "สรุปปัญหาสั้นๆ", description: "รายละเอียด",
    descPh: "อธิบายอาการ/ปัญหาที่พบ", photo: "รูปภาพ", attachPhoto: "แนบรูป",
    submit: "ส่งเรื่องแจ้งซ่อม", submitted: "ส่งเรื่องเรียบร้อย ออกเลขใบงานแล้ว",
    status: "สถานะ", reporter: "ผู้แจ้ง", assignee: "ผู้รับผิดชอบ", unassigned: "ยังไม่มีผู้รับ",
    createdAt: "วันที่แจ้ง", ticketNo: "เลขใบงาน", all: "ทั้งหมด",
    accept: "รับงาน", decline: "ส่งกลับ/ผิดแผนก", start: "เริ่มซ่อม", hold: "พักงาน (ค้าง)",
    complete: "ส่งงาน (ขออนุมัติ)", approve: "อนุมัติ", returnFix: "ตีกลับให้แก้ไข",
    holdReason: "สาเหตุที่งานค้าง", workNote: "บันทึกการซ่อม", afterPhoto: "รูปหลังซ่อม",
    note: "หมายเหตุ", optional: "ไม่บังคับ", confirm: "ยืนยัน", cancel: "ยกเลิก",
    print: "พิมพ์ใบงาน", copy: "คัดลอกข้อความ", copied: "คัดลอกแล้ว",
    rate: "ให้คะแนนความพึงพอใจ", rated: "ขอบคุณสำหรับคะแนน", thanks: "ขอบคุณครับ",
    total: "งานทั้งหมด", today: "วันนี้", openWork: "งานที่ยังไม่เสร็จ", overdue: "เลยกำหนด (SLA)",
    reportedToday: "แจ้งวันนี้", doneToday: "เสร็จวันนี้", stillOpen: "ค้างอยู่",
    holdBreakdown: "สรุปสาเหตุงานค้าง", byBranch: "งานตามสาขา", byStatus: "งานตามสถานะ",
    dailyReport: "รายงานสรุปรายวัน", date: "วันที่", noData: "ไม่มีข้อมูล",
    kpiTitle: "ตัวชี้วัด (KPI) ทีมช่าง & ไอที", staff: "เจ้าหน้าที่",
    kpiCompleted: "งานเสร็จ", kpiAvgAccept: "เวลาตอบรับเฉลี่ย", kpiAvgResolve: "เวลาปิดงานเฉลี่ย",
    kpiOnTime: "ตรงเวลา (SLA)", kpiReject: "ถูกตีกลับ", kpiRating: "ความพึงพอใจ",
    hours: "ชม.", searchPh: "ค้นหาเลขใบงาน / หัวข้อ / สถานที่",
    welcome: "สวัสดี", role_reporter: "ผู้แจ้ง", role_technician: "ช่าง/ไอที",
    role_supervisor: "หัวหน้า", role_manager: "ผู้จัดการ", role_admin: "ผู้ดูแลระบบ",
    users: "ผู้ใช้งานในระบบ", resetDemo: "รีเซ็ตข้อมูลตัวอย่าง", resetConfirm: "ล้างข้อมูลและโหลดตัวอย่างใหม่?",
    sla: "กำหนดเสร็จ (SLA)", actions: "ดำเนินการ", detail: "รายละเอียดใบงาน",
    empty: "ยังไม่มีรายการในส่วนนี้", notify: "การแจ้งเตือน", noNotify: "ไม่มีการแจ้งเตือนใหม่",
    branchName: "ชื่อสาขา", phoneSlip: "นำใบงานนี้ไปพิมพ์ หรือแคปหน้าจอส่งต่อทาง LINE ได้",
    deptM: "ช่าง", deptI: "ไอที", assignedTo: "มอบหมายให้", selectAssignee: "เลือกผู้รับผิดชอบ",
    filterStatus: "กรองสถานะ", clearFilter: "ล้างตัวกรอง",
    assignNow: "มอบหมายงาน", completedOn: "ปิดงานเมื่อ", addAfterPhoto: "เพิ่มรูปหลังซ่อม",
    nNewJob: "งานใหม่รอรับ", nReturned: "งานถูกตีกลับให้แก้ไข", nApproval: "งานรออนุมัติ",
    nRate: "งานเสร็จแล้ว รอให้คะแนน", nOverdue: "งานเลยกำหนด (SLA)", viewAll: "ดูทั้งหมด",
  },
  en: {
    appName: "Hotel Maintenance Desk", tagline: "Maintenance & IT operations",
    login: "Sign in", username: "Username", password: "Password",
    quickLogin: "Quick sign in (demo)", wrongLogin: "Incorrect username or password",
    logout: "Sign out", dashboard: "Dashboard", newTicket: "Report",
    myTickets: "My reports", queue: "Work queue", approvals: "Approvals",
    reports: "Reports & KPI", admin: "Admin", branch: "Branch", allBranches: "All branches",
    department: "Department", category: "Category", priority: "Priority",
    location: "Location", locationPh: "e.g. Room 305 / Lobby / Main kitchen",
    title: "Title", titlePh: "Short summary of the issue", description: "Details",
    descPh: "Describe the problem", photo: "Photo", attachPhoto: "Add photo",
    submit: "Submit report", submitted: "Submitted. Ticket number issued.",
    status: "Status", reporter: "Reporter", assignee: "Assignee", unassigned: "Unassigned",
    createdAt: "Reported", ticketNo: "Ticket", all: "All",
    accept: "Accept", decline: "Return / wrong dept", start: "Start work", hold: "Put on hold",
    complete: "Submit for approval", approve: "Approve", returnFix: "Return to fix",
    holdReason: "On-hold reason", workNote: "Work note", afterPhoto: "After photo",
    note: "Note", optional: "optional", confirm: "Confirm", cancel: "Cancel",
    print: "Print ticket", copy: "Copy text", copied: "Copied",
    rate: "Rate your satisfaction", rated: "Thanks for rating", thanks: "Thank you",
    total: "Total", today: "Today", openWork: "Open work", overdue: "Overdue (SLA)",
    reportedToday: "Reported today", doneToday: "Completed today", stillOpen: "Still open",
    holdBreakdown: "On-hold reasons", byBranch: "By branch", byStatus: "By status",
    dailyReport: "Daily report", date: "Date", noData: "No data",
    kpiTitle: "KPI — Maintenance & IT", staff: "Staff",
    kpiCompleted: "Completed", kpiAvgAccept: "Avg response", kpiAvgResolve: "Avg resolution",
    kpiOnTime: "On-time (SLA)", kpiReject: "Returned", kpiRating: "Satisfaction",
    hours: "h", searchPh: "Search ticket / title / location",
    welcome: "Hello", role_reporter: "Reporter", role_technician: "Technician/IT",
    role_supervisor: "Supervisor", role_manager: "Manager", role_admin: "Admin",
    users: "System users", resetDemo: "Reset demo data", resetConfirm: "Clear data and reload demo?",
    sla: "Due (SLA)", actions: "Actions", detail: "Ticket detail",
    empty: "Nothing here yet", notify: "Notifications", noNotify: "No new notifications",
    branchName: "Branch name", phoneSlip: "Print this slip or screenshot to share via LINE.",
    deptM: "Maintenance", deptI: "IT", assignedTo: "Assigned to", selectAssignee: "Select assignee",
    filterStatus: "Filter status", clearFilter: "Clear filter",
    assignNow: "Assign", completedOn: "Completed on", addAfterPhoto: "Add after photo",
    nNewJob: "New job to accept", nReturned: "Returned to fix", nApproval: "Awaiting approval",
    nRate: "Completed — please rate", nOverdue: "Overdue (SLA)", viewAll: "View all",
  },
};

/* ============================ SEED DATA ============================ */
const SEED_USERS = [
  { id: "u_front", username: "front1", password: "1234", name: "สมหญิง (ฟรอนต์)", role: "reporter", dept: null, branch: "BV", unit: "Front Office" },
  { id: "u_house", username: "house1", password: "1234", name: "มาลี (แม่บ้าน)", role: "reporter", dept: null, branch: "BV", unit: "Housekeeping" },
  { id: "u_kit", username: "kit1", password: "1234", name: "ครัวกลาง BP", role: "reporter", dept: null, branch: "BP", unit: "Kitchen" },
  { id: "u_tech1", username: "tech1", password: "1234", name: "ช่างเอก", role: "technician", dept: "maintenance", branch: "BV" },
  { id: "u_tech2", username: "tech2", password: "1234", name: "ช่างโต้ง", role: "technician", dept: "maintenance", branch: "BP" },
  { id: "u_it1", username: "it1", password: "1234", name: "ไอทีแบงค์", role: "technician", dept: "it", branch: "BV" },
  { id: "u_sup_m", username: "sup1", password: "1234", name: "หัวหน้าช่างวิทย์", role: "supervisor", dept: "maintenance", branch: "BV" },
  { id: "u_sup_i", username: "supit1", password: "1234", name: "หัวหน้าไอทีปอนด์", role: "supervisor", dept: "it", branch: "BV" },
  { id: "u_gm", username: "gm1", password: "1234", name: "ผู้จัดการใหญ่", role: "manager", dept: null, branch: null },
  { id: "u_admin", username: "admin", password: "1234", name: "ผู้ดูแลระบบ", role: "admin", dept: null, branch: null },
];

function hoursAgo(h) { return new Date(Date.now() - h * 3600 * 1000).toISOString(); }

function buildSeedTickets() {
  return [
    mk("BV", "maintenance", "ac", "high", "แอร์ห้อง 305 ไม่เย็น", "Room 305", "u_house", "u_tech1",
      "done", { acc: 11, prog: 10, done: 7, app: 6, rating: 5, note: "เติมน้ำยาแอร์และล้างคอยล์", base: 12 }),
    mk("BV", "maintenance", "plumb", "critical", "น้ำรั่วใต้อ่างล้างจาน ครัว", "Main kitchen", "u_front", "u_tech1",
      "done", { acc: 0.5, prog: 0.4, done: 1.2, app: 1, rating: 4, note: "เปลี่ยนข้อต่อท่อน้ำ", base: 5 }),
    mk("BV", "it", "net", "high", "อินเทอร์เน็ตล็อบบี้หลุดบ่อย", "Lobby", "u_front", "u_it1",
      "review", { acc: 1, prog: 0.5, base: 3, note: "เปลี่ยน Access Point ตัวใหม่ รอตรวจรับ" }),
    mk("BV", "maintenance", "elec", "normal", "ไฟทางเดินชั้น 4 กระพริบ", "Floor 4 corridor", "u_house", "u_tech1",
      "pending", { acc: 2, base: 20, hold: "parts", note: "รอหลอด LED จากคลังกลาง" }),
    mk("BV", "it", "pms", "critical", "ระบบ PMS เช็คอินไม่ได้", "Front desk", "u_front", "u_it1",
      "in_progress", { acc: 0.3, base: 1.5 }),
    mk("BP", "maintenance", "furn", "low", "เก้าอี้ล็อบบี้ขาโยก", "Lobby BP", "u_kit", null,
      "new", { base: 4 }),
    mk("BP", "maintenance", "ac", "normal", "แอร์ห้องประชุมเสียงดัง", "Meeting room BP", "u_kit", "u_tech2",
      "accepted", { acc: 1, base: 6 }),
    mk("BP", "it", "phone", "normal", "โทรศัพท์ห้อง 210 ไม่มีสัญญาณ", "Room 210", "u_kit", null,
      "new", { base: 2 }),
    mk("BV", "maintenance", "build", "low", "สีผนังบันไดหนีไฟลอก", "Fire stairs", "u_house", "u_tech1",
      "done", { acc: 20, prog: 18, done: 30, app: 28, rating: 5, note: "ทาสีใหม่เรียบร้อย", base: 50 }),
    mk("BV", "it", "device", "normal", "เครื่องพิมพ์บัตรคีย์การ์ดเสีย", "Front desk", "u_front", "u_it1",
      "rejected", { acc: 3, base: 9, note: "ตีกลับ: ยังไม่ได้แนบรูปอาการเสีย กรุณาถ่ายเพิ่ม" }),
    mk("BP", "maintenance", "plumb", "high", "ชักโครกห้อง 118 ตัน", "Room 118", "u_kit", "u_tech2",
      "done", { acc: 1, prog: 0.8, done: 2, app: 1.8, rating: 3, note: "ลอกท่อ", base: 8 }),
    mk("BV", "maintenance", "ac", "normal", "แอร์ห้อง 402 น้ำหยด", "Room 402", "u_house", null,
      "new", { base: 1 }),
  ];

  function mk(branch, dept, cat, pri, title, loc, reporterId, assigneeId, status, o) {
    const base = o.base ?? 5;
    const createdAt = hoursAgo(base);
    const acceptedAt = o.acc != null ? hoursAgo(base - o.acc) : null;
    const startedAt = o.prog != null ? hoursAgo(base - o.acc - 0.2) : null;
    const completedAt = o.done != null ? hoursAgo(base - o.acc - o.done) : null;
    const approvedAt = o.app != null ? hoursAgo(base - o.acc - o.app) : null;
    return {
      id: "t_" + Math.random().toString(36).slice(2, 9),
      code: makeCode(branch, createdAt),
      branch, dept, category: cat, priority: pri, title,
      location: loc, description: title, photo: null, afterPhoto: null,
      reporterId, assigneeId, status,
      holdReason: o.hold || null, workNote: o.note || null,
      approvalNote: status === "rejected" ? o.note : null,
      rejectCount: status === "rejected" ? 1 : 0,
      rating: o.rating || null,
      createdAt, acceptedAt, startedAt, completedAt, approvedAt,
      history: [],
    };
  }
}

let CODE_SEQ = 100;
function makeCode(branch, iso) {
  const d = new Date(iso);
  const ym = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}`;
  CODE_SEQ += 1;
  return `${branch}-${ym}-${String(CODE_SEQ).padStart(3, "0")}`;
}

/* ============================ HELPERS ============================ */
const hoursBetween = (a, b) => (!a || !b ? null : (new Date(b) - new Date(a)) / 3600000);
const fmtDate = (iso, lang) =>
  !iso ? "-" : new Date(iso).toLocaleString(lang === "th" ? "th-TH" : "en-GB",
    { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
const sameDay = (iso, day) => iso && new Date(iso).toDateString() === day.toDateString();
const lbl = (obj, lang) => (obj ? obj[lang] : "");
const findCat = (dept, id) => (CATEGORIES[dept] || []).find((c) => c.id === id);
const findPri = (id) => PRIORITIES.find((p) => p.id === id);
const fmtH = (h) => (h == null ? "-" : h < 1 ? `${Math.round(h * 60)}m` : `${h.toFixed(1)}`);

/* ============================ SMALL UI ============================ */
function Badge({ status, lang }) {
  const s = STATUSES[status];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.color + "1A", color: s.color }}>
      <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
      {lbl(s, lang)}
    </span>
  );
}
function PriDot({ id }) {
  const p = findPri(id);
  return <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: p.color }} title={p.id} />;
}
function Stat({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: (color || C.primary) + "18", color: color || C.primary }}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-bold leading-none" style={{ color: C.ink }}>{value}</div>
        <div className="text-xs mt-1 truncate" style={{ color: C.sub }}>{label}</div>
      </div>
    </div>
  );
}
function Field({ label, children, required }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold" style={{ color: C.ink }}>
        {label}{required && <span style={{ color: "#DC2626" }}> *</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
const inputCls = "w-full rounded-xl px-3 py-2.5 text-sm outline-none";
const inputStyle = { border: `1px solid ${C.line}`, background: "#fff", color: C.ink };

/* ============================ MAIN APP ============================ */
export default function App() {
  const [lang, setLang] = useState("th");
  const [users, setUsers] = useState(SEED_USERS);
  const [tickets, setTickets] = useState(buildSeedTickets);
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("dashboard");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [branchFilter, setBranchFilter] = useState("all");
  const [notifOpen, setNotifOpen] = useState(false);
  const t = (k) => T[lang][k] || k;

  // persistence (browser localStorage — data persists per device)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("hotelfix_tickets");
      if (raw) setTickets(JSON.parse(raw));
    } catch (e) { /* fall back to seed */ }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("hotelfix_tickets", JSON.stringify(tickets));
    } catch (e) { /* quota / private mode — in-memory only */ }
  }, [tickets]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const userById = (id) => users.find((u) => u.id === id);

  const updateTicket = (id, patch) =>
    setTickets((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const addTicket = (data) => {
    const code = makeCode(data.branch, new Date().toISOString());
    const tk = {
      id: "t_" + Math.random().toString(36).slice(2, 9),
      code, ...data, status: "new", assigneeId: null,
      createdAt: new Date().toISOString(),
      acceptedAt: null, startedAt: null, completedAt: null, approvedAt: null,
      holdReason: null, workNote: null, approvalNote: null, rating: null, history: [],
    };
    setTickets((p) => [tk, ...p]);
    return tk;
  };

  /* scope tickets by role/branch — computed before any early return so hook order stays stable */
  const scoped = useMemo(() => {
    if (!user) return [];
    let list = tickets;
    if (user.role === "reporter") list = list.filter((x) => x.reporterId === user.id);
    else if (user.role === "technician")
      list = list.filter((x) => x.branch === user.branch && x.dept === user.dept);
    else if (user.role === "supervisor")
      list = list.filter((x) => x.dept === user.dept);
    // manager/admin see all
    if ((user.role === "manager" || user.role === "admin" || user.role === "supervisor") && branchFilter !== "all")
      list = list.filter((x) => x.branch === branchFilter);
    return list;
  }, [tickets, user, branchFilter]);

  if (!user)
    return <Login lang={lang} setLang={setLang} t={t} users={users} onLogin={(u) => { setUser(u); setScreen("dashboard"); }} />;

  const nav = navFor(user.role);
  const notifList = buildNotifs(scoped, user, t);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.ink, fontFamily: "'IBM Plex Sans Thai','IBM Plex Sans',system-ui,sans-serif" }}>
      <FontStyle />
      {/* Top bar */}
      <header className="sticky top-0 z-30" style={{ background: C.primary, color: "#fff" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.accent, color: C.primaryDark }}>
            <Wrench size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold leading-tight truncate">{t("appName")}</div>
            <div className="text-xs opacity-80 truncate">{t("tagline")}</div>
          </div>
          {(user.role === "manager" || user.role === "admin" || user.role === "supervisor") && (
            <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}
              className="rounded-lg text-sm px-2 py-1.5"
              style={{ background: C.primaryDark, color: "#fff", border: "none" }}>
              <option value="all">{t("allBranches")}</option>
              {BRANCHES.map((b) => <option key={b.code} value={b.code}>{b.code}</option>)}
            </select>
          )}
          {/* notification bell */}
          <div className="relative">
            <button onClick={() => setNotifOpen((o) => !o)} className="rounded-lg p-2 relative" style={{ background: C.primaryDark }}>
              <Bell size={16} />
              {notifList.length > 0 && (
                <span className="absolute -top-1 -right-1 text-xs font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center"
                  style={{ background: C.accent, color: C.primaryDark }}>
                  {notifList.length}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl overflow-hidden shadow-xl z-50"
                style={{ background: "#fff", border: `1px solid ${C.line}`, color: C.ink }}>
                <div className="px-3 py-2 text-sm font-bold" style={{ background: C.primarySoft, color: C.primary }}>{t("notify")}</div>
                <div className="max-h-80 overflow-y-auto">
                  {notifList.length === 0 && <div className="px-3 py-6 text-center text-sm" style={{ color: C.sub }}>{t("noNotify")}</div>}
                  {notifList.map((n, i) => (
                    <button key={i} onClick={() => { setSelected(n.id); setNotifOpen(false); }}
                      className="w-full text-left px-3 py-2.5 flex items-start gap-2 hover:bg-gray-50"
                      style={{ borderTop: i ? `1px solid ${C.line}` : "none" }}>
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: n.color + "1A", color: n.color }}>
                        <n.icon size={15} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">{n.text}</span>
                        <span className="block text-xs truncate" style={{ color: C.sub }}>{n.sub}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setLang(lang === "th" ? "en" : "th")}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold"
            style={{ background: C.primaryDark }}>
            <Globe size={15} /> {lang === "th" ? "EN" : "ไทย"}
          </button>
          <button onClick={() => setUser(null)} title={t("logout")}
            className="rounded-lg p-2" style={{ background: C.primaryDark }}>
            <LogOut size={16} />
          </button>
        </div>
        {/* Nav tabs */}
        <div className="max-w-6xl mx-auto px-2 overflow-x-auto">
          <div className="flex gap-1 pb-2">
            {nav.map((n) => (
              <button key={n.key} onClick={() => setScreen(n.key)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
                style={{ background: screen === n.key ? "#fff" : "transparent", color: screen === n.key ? C.primary : "#fff", opacity: screen === n.key ? 1 : 0.85 }}>
                <n.icon size={16} /> {t(n.key)}
                {n.badge && n.badge(scoped, user) > 0 && (
                  <span className="text-xs font-bold rounded-full px-1.5" style={{ background: C.accent, color: C.primaryDark }}>
                    {n.badge(scoped, user)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-5">
        <div className="mb-4 text-sm" style={{ color: C.sub }}>
          {t("welcome")}, <b style={{ color: C.ink }}>{user.name}</b> · {t("role_" + user.role)}
          {user.branch && ` · ${user.branch}`}{user.dept && ` · ${lbl(DEPTS[user.dept], lang)}`}
        </div>

        {screen === "dashboard" && <Dashboard {...{ t, lang, tickets: scoped, user, setScreen, setSelected, userById }} />}
        {screen === "newTicket" && <NewTicket {...{ t, lang, user, addTicket, showToast, setSelected, setScreen }} />}
        {screen === "myTickets" && <TicketList {...{ t, lang, tickets: scoped, user, setSelected, userById, title: t("myTickets") }} />}
        {screen === "queue" && <TicketList {...{ t, lang, tickets: scoped, user, setSelected, userById, title: t("queue") }} />}
        {screen === "approvals" && <TicketList {...{ t, lang, tickets: scoped.filter(x => x.status === "review"), user, setSelected, userById, title: t("approvals"), emptyOk: true }} />}
        {screen === "reports" && <Reports {...{ t, lang, tickets: scoped, userById, users }} />}
        {screen === "admin" && <Admin {...{ t, lang, users, tickets, setTickets, showToast }} />}
      </main>

      {selected && (
        <TicketDetail
          ticket={tickets.find((x) => x.id === selected) || selected}
          {...{ t, lang, user, users, userById, updateTicket, showToast, onClose: () => setSelected(null) }}
        />
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg"
          style={{ transform: "translateX(-50%)", background: C.ink, color: "#fff" }}>
          {toast}
        </div>
      )}
    </div>
  );
}

/* ============================ NOTIFICATIONS ============================ */
function buildNotifs(list, user, t) {
  const now = new Date().toISOString();
  const out = [];
  const overdue = (x) => x.status !== "done" && hoursBetween(x.createdAt, now) > findPri(x.priority).sla;
  if (user.role === "technician") {
    list.filter((x) => x.status === "new").forEach((x) =>
      out.push({ id: x.id, icon: PlusCircle, color: "#2563EB", text: t("nNewJob"), sub: `${x.code} · ${x.title}` }));
    list.filter((x) => x.status === "rejected").forEach((x) =>
      out.push({ id: x.id, icon: RotateCcw, color: "#B45309", text: t("nReturned"), sub: `${x.code} · ${x.title}` }));
  } else if (user.role === "supervisor") {
    list.filter((x) => x.status === "review").forEach((x) =>
      out.push({ id: x.id, icon: CheckCircle2, color: "#7C3AED", text: t("nApproval"), sub: `${x.code} · ${x.title}` }));
  } else if (user.role === "reporter") {
    list.filter((x) => x.status === "done" && !x.rating).forEach((x) =>
      out.push({ id: x.id, icon: Star, color: "#E8A33D", text: t("nRate"), sub: `${x.code} · ${x.title}` }));
  } else {
    list.filter(overdue).forEach((x) =>
      out.push({ id: x.id, icon: AlertTriangle, color: "#DC2626", text: t("nOverdue"), sub: `${x.code} · ${x.title}` }));
  }
  return out;
}

/* ============================ NAV ============================ */
function navFor(role) {
  const D = { key: "dashboard", icon: LayoutDashboard };
  const N = { key: "newTicket", icon: PlusCircle };
  const M = { key: "myTickets", icon: ClipboardList };
  const Q = { key: "queue", icon: Wrench, badge: (l, u) => l.filter(x => ["new", "accepted", "in_progress", "pending", "rejected"].includes(x.status)).length };
  const A = { key: "approvals", icon: CheckCircle2, badge: (l) => l.filter(x => x.status === "review").length };
  const R = { key: "reports", icon: BarChart3 };
  const AD = { key: "admin", icon: Shield };
  switch (role) {
    case "reporter": return [D, N, M];
    case "technician": return [D, Q, R];
    case "supervisor": return [D, A, Q, R];
    case "manager": return [D, R];
    case "admin": return [D, R, AD];
    default: return [D];
  }
}

/* ============================ LOGIN ============================ */
function Login({ lang, setLang, t, users, onLogin }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const quick = ["front1", "house1", "tech1", "it1", "sup1", "supit1", "gm1", "admin"];
  const submit = () => {
    const found = users.find((x) => x.username === u.trim() && x.password === p);
    if (found) onLogin(found); else setErr(t("wrongLogin"));
  };
  return (
    <div style={{ background: C.primary, minHeight: "100vh", fontFamily: "'IBM Plex Sans Thai','IBM Plex Sans',system-ui,sans-serif" }} className="flex items-center justify-center p-4">
      <FontStyle />
      <div className="w-full max-w-sm">
        <div className="text-center mb-6 text-white">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: C.accent, color: C.primaryDark }}>
            <Wrench size={32} />
          </div>
          <h1 className="text-2xl font-bold">{t("appName")}</h1>
          <p className="opacity-80 text-sm">{t("tagline")}</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: "#fff" }}>
          <div className="space-y-3">
            <Field label={t("username")}>
              <input className={inputCls} style={inputStyle} value={u} onChange={(e) => { setU(e.target.value); setErr(""); }}
                onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="front1" />
            </Field>
            <Field label={t("password")}>
              <input type="password" className={inputCls} style={inputStyle} value={p} onChange={(e) => { setP(e.target.value); setErr(""); }}
                onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="1234" />
            </Field>
            {err && <div className="text-sm font-semibold" style={{ color: "#DC2626" }}>{err}</div>}
            <button onClick={submit} className="w-full rounded-xl py-3 font-bold text-white" style={{ background: C.primary }}>
              {t("login")}
            </button>
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${C.line}` }}>
            <div className="text-xs font-semibold mb-2" style={{ color: C.sub }}>{t("quickLogin")}</div>
            <div className="flex flex-wrap gap-1.5">
              {quick.map((q) => (
                <button key={q} onClick={() => onLogin(users.find((x) => x.username === q))}
                  className="text-xs rounded-lg px-2 py-1 font-semibold" style={{ background: C.primarySoft, color: C.primary }}>
                  {q}
                </button>
              ))}
            </div>
            <div className="text-xs mt-2" style={{ color: C.sub }}>รหัสผ่านทุกบัญชี: <b>1234</b></div>
          </div>
        </div>
        <button onClick={() => setLang(lang === "th" ? "en" : "th")} className="w-full text-center text-white text-sm mt-4 opacity-80">
          <Globe size={13} className="inline mr-1" /> {lang === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
        </button>
      </div>
    </div>
  );
}

/* ============================ DASHBOARD ============================ */
function Dashboard({ t, lang, tickets, user, setScreen, setSelected, userById }) {
  const today = new Date();
  const total = tickets.length;
  const open = tickets.filter((x) => !["done"].includes(x.status)).length;
  const reportedToday = tickets.filter((x) => sameDay(x.createdAt, today)).length;
  const doneToday = tickets.filter((x) => sameDay(x.approvedAt, today)).length;
  const overdue = tickets.filter((x) => {
    if (x.status === "done") return false;
    const sla = findPri(x.priority).sla;
    return hoursBetween(x.createdAt, new Date().toISOString()) > sla;
  }).length;

  const holdData = HOLD_REASONS.map((r) => ({
    name: lbl(r, lang),
    value: tickets.filter((x) => x.status === "pending" && x.holdReason === r.id).length,
  })).filter((d) => d.value > 0);

  const branchData = BRANCHES.map((b) => ({
    name: b.code,
    value: tickets.filter((x) => x.branch === b.code).length,
  })).filter((d) => d.value > 0);

  const recent = [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={ClipboardList} label={t("total")} value={total} color={C.primary} />
        <Stat icon={Clock} label={t("openWork")} value={open} color="#D97706" />
        <Stat icon={Bell} label={t("reportedToday")} value={reportedToday} color="#2563EB" />
        <Stat icon={AlertTriangle} label={t("overdue")} value={overdue} color="#DC2626" />
      </div>

      {/* Daily report */}
      <Card title={t("dailyReport") + " · " + today.toLocaleDateString(lang === "th" ? "th-TH" : "en-GB")}>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { l: t("reportedToday"), v: reportedToday, c: "#2563EB" },
            { l: t("doneToday"), v: doneToday, c: "#059669" },
            { l: t("stillOpen"), v: open, c: "#D97706" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl py-3" style={{ background: s.c + "12" }}>
              <div className="text-3xl font-bold" style={{ color: s.c }}>{s.v}</div>
              <div className="text-xs mt-1" style={{ color: C.sub }}>{s.l}</div>
            </div>
          ))}
        </div>
        {holdData.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-semibold mb-2" style={{ color: C.ink }}>{t("holdBreakdown")}</div>
            <div className="space-y-1.5">
              {holdData.map((h) => (
                <div key={h.name} className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full" style={{ background: "#DC2626" }} />
                  <span className="flex-1" style={{ color: C.sub }}>{h.name}</span>
                  <b>{h.value}</b>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className="grid lg:grid-cols-2 gap-5">
        {branchData.length > 0 && (
          <Card title={t("byBranch")}>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={branchData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.line} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: C.sub }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: C.sub }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={C.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
        <Card title={t("byStatus")}>
          <div className="space-y-2">
            {Object.keys(STATUSES).map((s) => {
              const n = tickets.filter((x) => x.status === s).length;
              if (!n) return null;
              return (
                <div key={s} className="flex items-center gap-2">
                  <Badge status={s} lang={lang} />
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: C.line }}>
                    <div className="h-full" style={{ width: `${(n / Math.max(total, 1)) * 100}%`, background: STATUSES[s].color }} />
                  </div>
                  <b className="text-sm w-6 text-right">{n}</b>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card title={t("createdAt")}>
        <div className="space-y-2">
          {recent.length === 0 && <Empty t={t} />}
          {recent.map((x) => (
            <Row key={x.id} ticket={x} lang={lang} t={t} userById={userById} onClick={() => setSelected(x.id)} />
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ============================ NEW TICKET ============================ */
function NewTicket({ t, lang, user, addTicket, showToast, setSelected, setScreen }) {
  const [dept, setDept] = useState("maintenance");
  const [form, setForm] = useState({
    branch: user.branch || "BV", category: CATEGORIES.maintenance[0].id,
    priority: "normal", title: "", location: "", description: "", photo: null,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const onPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => set("photo", r.result);
    r.readAsDataURL(file);
  };
  const submit = () => {
    if (!form.title.trim() || !form.location.trim()) return;
    const tk = addTicket({ ...form, dept, reporterId: user.id });
    showToast(t("submitted") + " " + tk.code);
    setSelected(tk.id);
    setScreen("myTickets");
  };
  const cats = CATEGORIES[dept];

  return (
    <Card title={t("newTicket")}>
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t("department")} required>
            <div className="flex gap-2">
              {Object.entries(DEPTS).map(([k, d]) => (
                <button key={k} onClick={() => { setDept(k); set("category", CATEGORIES[k][0].id); }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold"
                  style={{ background: dept === k ? C.primary : "#fff", color: dept === k ? "#fff" : C.sub, border: `1px solid ${dept === k ? C.primary : C.line}` }}>
                  <d.icon size={16} /> {lbl(d, lang)}
                </button>
              ))}
            </div>
          </Field>
          <Field label={t("branch")} required>
            <select className={inputCls} style={inputStyle} value={form.branch} onChange={(e) => set("branch", e.target.value)}>
              {BRANCHES.map((b) => <option key={b.code} value={b.code}>{b.code} — {lbl(b, lang)}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t("category")} required>
            <select className={inputCls} style={inputStyle} value={form.category} onChange={(e) => set("category", e.target.value)}>
              {cats.map((c) => <option key={c.id} value={c.id}>{lbl(c, lang)}</option>)}
            </select>
          </Field>
          <Field label={t("priority")} required>
            <select className={inputCls} style={inputStyle} value={form.priority} onChange={(e) => set("priority", e.target.value)}>
              {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{lbl(p, lang)} · SLA {p.sla}{t("hours")}</option>)}
            </select>
          </Field>
        </div>

        <Field label={t("title")} required>
          <input className={inputCls} style={inputStyle} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder={t("titlePh")} />
        </Field>
        <Field label={t("location")} required>
          <input className={inputCls} style={inputStyle} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder={t("locationPh")} />
        </Field>
        <Field label={t("description")}>
          <textarea rows={3} className={inputCls} style={inputStyle} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder={t("descPh")} />
        </Field>

        <Field label={t("photo")}>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer"
              style={{ background: C.primarySoft, color: C.primary }}>
              <Camera size={16} /> {t("attachPhoto")}
              <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
            </label>
            {form.photo && <img src={form.photo} alt="" className="w-16 h-16 rounded-lg object-cover" style={{ border: `1px solid ${C.line}` }} />}
          </div>
        </Field>

        <button onClick={submit} disabled={!form.title.trim() || !form.location.trim()}
          className="w-full rounded-xl py-3 font-bold text-white flex items-center justify-center gap-2"
          style={{ background: (!form.title.trim() || !form.location.trim()) ? "#9CA8AB" : C.primary }}>
          <Send size={18} /> {t("submit")}
        </button>
      </div>
    </Card>
  );
}

/* ============================ TICKET LIST ============================ */
function TicketList({ t, lang, tickets, user, setSelected, userById, title }) {
  const [q, setQ] = useState("");
  const [sf, setSf] = useState("all");
  const filtered = tickets
    .filter((x) => sf === "all" || x.status === sf)
    .filter((x) => {
      if (!q.trim()) return true;
      const s = (x.code + x.title + x.location).toLowerCase();
      return s.includes(q.toLowerCase());
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <Card title={title}>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex items-center gap-2 rounded-xl px-3 flex-1" style={{ border: `1px solid ${C.line}`, background: "#fff" }}>
          <Search size={16} style={{ color: C.sub }} />
          <input className="flex-1 py-2.5 text-sm outline-none bg-transparent" placeholder={t("searchPh")} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select value={sf} onChange={(e) => setSf(e.target.value)} className="rounded-xl px-3 py-2.5 text-sm" style={inputStyle}>
          <option value="all">{t("filterStatus")}: {t("all")}</option>
          {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{lbl(v, lang)}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        {filtered.length === 0 && <Empty t={t} />}
        {filtered.map((x) => <Row key={x.id} ticket={x} lang={lang} t={t} userById={userById} onClick={() => setSelected(x.id)} />)}
      </div>
    </Card>
  );
}

function Row({ ticket: x, lang, t, userById, onClick }) {
  const cat = findCat(x.dept, x.category);
  const overdue = x.status !== "done" && hoursBetween(x.createdAt, new Date().toISOString()) > findPri(x.priority).sla;
  return (
    <button onClick={onClick} className="w-full text-left rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition"
      style={{ border: `1px solid ${C.line}`, background: "#fff" }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: (x.dept === "it" ? "#2563EB" : C.primary) + "14", color: x.dept === "it" ? "#2563EB" : C.primary }}>
        {x.dept === "it" ? <Monitor size={18} /> : <Wrench size={18} />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <PriDot id={x.priority} />
          <span className="text-xs font-bold" style={{ color: C.sub }}>{x.code}</span>
          <span className="text-xs" style={{ color: C.sub }}>· {x.branch}</span>
          {overdue && <AlertTriangle size={13} style={{ color: "#DC2626" }} />}
        </div>
        <div className="font-semibold truncate" style={{ color: C.ink }}>{x.title}</div>
        <div className="text-xs truncate" style={{ color: C.sub }}>{x.location} · {lbl(cat, lang)} · {fmtDate(x.createdAt, lang)}</div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <Badge status={x.status} lang={lang} />
        <ChevronRight size={16} style={{ color: C.sub }} />
      </div>
    </button>
  );
}

/* ============================ TICKET DETAIL + ACTIONS ============================ */
function TicketDetail({ ticket: x, t, lang, user, users, userById, updateTicket, showToast, onClose }) {
  const [holdReason, setHoldReason] = useState(x.holdReason || "parts");
  const [note, setNote] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [afterPhoto, setAfterPhoto] = useState(null);
  const cat = findCat(x.dept, x.category);
  const pri = findPri(x.priority);
  const reporter = userById(x.reporterId);
  const assignee = userById(x.assigneeId);
  const now = new Date().toISOString();

  const canAccept = user.role === "technician" && x.dept === user.dept && x.branch === user.branch && ["new", "rejected"].includes(x.status);
  const isMine = user.role === "technician" && x.assigneeId === user.id;
  const canApprove = user.role === "supervisor" && x.dept === user.dept && x.status === "review";
  const canAssign = user.role === "supervisor" && x.dept === user.dept && !x.assigneeId && ["new"].includes(x.status);
  const canRate = user.role === "reporter" && x.reporterId === user.id && x.status === "done" && !x.rating;

  const act = (patch, msg) => { updateTicket(x.id, patch); showToast(msg); };

  const teammates = users.filter((u) => u.role === "technician" && u.dept === x.dept && u.branch === x.branch);

  const copyText = () => {
    const txt = [
      `[${t("ticketNo")}] ${x.code}`,
      `${t("branch")}: ${x.branch} · ${lbl(DEPTS[x.dept], lang)}`,
      `${t("title")}: ${x.title}`,
      `${t("location")}: ${x.location}`,
      `${t("category")}: ${lbl(cat, lang)} · ${t("priority")}: ${lbl(pri, lang)}`,
      `${t("status")}: ${lbl(STATUSES[x.status], lang)}`,
      `${t("reporter")}: ${reporter?.name || "-"}`,
      `${t("createdAt")}: ${fmtDate(x.createdAt, lang)}`,
      x.description ? `${t("description")}: ${x.description}` : "",
    ].filter(Boolean).join("\n");
    try {
      navigator.clipboard.writeText(txt);
      showToast(t("copied"));
    } catch (e) { showToast(t("copied")); }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: "rgba(8,20,24,.55)" }} onClick={onClose}>
      <div className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl" style={{ background: "#fff" }} onClick={(e) => e.stopPropagation()}>
        {/* header */}
        <div className="sticky top-0 px-5 py-4 flex items-center gap-3" style={{ background: C.primary, color: "#fff" }} id="print-head">
          <div className="flex-1 min-w-0">
            <div className="text-xs opacity-80">{t("ticketNo")}</div>
            <div className="font-bold text-lg">{x.code}</div>
          </div>
          <Badge status={x.status} lang={lang} />
          <button onClick={onClose} className="p-1.5 rounded-lg no-print" style={{ background: C.primaryDark }}><X size={18} /></button>
        </div>

        <div id="print-area" className="p-5 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PriDot id={x.priority} />
              <span className="text-xs font-semibold" style={{ color: pri.color }}>{lbl(pri, lang)} · SLA {pri.sla}{t("hours")}</span>
            </div>
            <h3 className="text-xl font-bold" style={{ color: C.ink }}>{x.title}</h3>
            {x.description && <p className="text-sm mt-1" style={{ color: C.sub }}>{x.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label={t("branch")} value={`${x.branch}`} />
            <Info label={t("department")} value={lbl(DEPTS[x.dept], lang)} />
            <Info label={t("category")} value={lbl(cat, lang)} />
            <Info label={t("location")} value={x.location} />
            <Info label={t("reporter")} value={reporter?.name || "-"} />
            <Info label={t("assignee")} value={assignee?.name || t("unassigned")} />
            <Info label={t("createdAt")} value={fmtDate(x.createdAt, lang)} />
            <Info label={t("completedOn")} value={x.approvedAt ? fmtDate(x.approvedAt, lang) : "-"} />
          </div>

          {x.photo && <div><div className="text-xs font-semibold mb-1" style={{ color: C.sub }}>{t("photo")}</div><img src={x.photo} className="w-full rounded-xl object-cover max-h-48" /></div>}
          {x.afterPhoto && <div><div className="text-xs font-semibold mb-1" style={{ color: C.sub }}>{t("afterPhoto")}</div><img src={x.afterPhoto} className="w-full rounded-xl object-cover max-h-48" /></div>}

          {x.holdReason && x.status === "pending" && (
            <div className="rounded-xl p-3 text-sm" style={{ background: "#DC26260F", color: "#B91C1C" }}>
              <b>{t("holdReason")}:</b> {lbl(HOLD_REASONS.find((r) => r.id === x.holdReason), lang)}{x.workNote ? ` — ${x.workNote}` : ""}
            </div>
          )}
          {x.workNote && x.status !== "pending" && (
            <div className="rounded-xl p-3 text-sm" style={{ background: C.primarySoft, color: C.primary }}>
              <b>{t("workNote")}:</b> {x.workNote}
            </div>
          )}
          {x.approvalNote && (
            <div className="rounded-xl p-3 text-sm" style={{ background: "#B4530912", color: "#B45309" }}>
              <b>{t("returnFix")}:</b> {x.approvalNote}
            </div>
          )}

          <div className="text-xs italic no-print" style={{ color: C.sub }}>{t("phoneSlip")}</div>
        </div>

        {/* actions */}
        <div className="px-5 pb-5 space-y-3 no-print">
          {/* share */}
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold" style={{ background: C.primarySoft, color: C.primary }}>
              <Printer size={16} /> {t("print")}
            </button>
            <button onClick={copyText} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold" style={{ background: C.primarySoft, color: C.primary }}>
              <Copy size={16} /> {t("copy")}
            </button>
          </div>

          {/* technician accept */}
          {canAccept && (
            <div className="space-y-2">
              <button onClick={() => act({ status: "accepted", assigneeId: user.id, acceptedAt: now, approvalNote: null }, t("accept"))}
                className="w-full rounded-xl py-3 font-bold text-white flex items-center justify-center gap-2" style={{ background: C.primary }}>
                <ThumbsUp size={18} /> {t("accept")}
              </button>
              <button onClick={() => act({ status: "new", assigneeId: null, dept: x.dept === "maintenance" ? "it" : "maintenance" }, t("decline"))}
                className="w-full rounded-xl py-2.5 font-semibold text-sm" style={{ border: `1px solid ${C.line}`, color: C.sub }}>
                <RotateCcw size={15} className="inline mr-1" /> {t("decline")}
              </button>
            </div>
          )}

          {/* technician working actions */}
          {isMine && ["accepted", "in_progress", "pending"].includes(x.status) && (
            <div className="space-y-3">
              {x.status === "accepted" && (
                <button onClick={() => act({ status: "in_progress", startedAt: now }, t("start"))}
                  className="w-full rounded-xl py-2.5 font-semibold text-white flex items-center justify-center gap-2" style={{ background: "#D97706" }}>
                  <Play size={16} /> {t("start")}
                </button>
              )}
              {/* hold */}
              <div className="rounded-xl p-3 space-y-2" style={{ border: `1px solid ${C.line}` }}>
                <div className="text-xs font-semibold" style={{ color: C.sub }}>{t("hold")} — {t("holdReason")}</div>
                <select className={inputCls} style={inputStyle} value={holdReason} onChange={(e) => setHoldReason(e.target.value)}>
                  {HOLD_REASONS.map((r) => <option key={r.id} value={r.id}>{lbl(r, lang)}</option>)}
                </select>
                <button onClick={() => act({ status: "pending", holdReason, workNote: note || x.workNote }, t("hold"))}
                  className="w-full rounded-lg py-2 font-semibold text-sm text-white" style={{ background: "#DC2626" }}>
                  <Pause size={14} className="inline mr-1" /> {t("hold")}
                </button>
              </div>
              {/* work note + after photo + complete */}
              <Field label={`${t("workNote")} (${t("optional")})`}>
                <textarea rows={2} className={inputCls} style={inputStyle} value={note} onChange={(e) => setNote(e.target.value)} />
              </Field>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer"
                  style={{ background: C.primarySoft, color: C.primary }}>
                  <Camera size={16} /> {t("addAfterPhoto")}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0]; if (!f) return;
                    const r = new FileReader(); r.onload = () => setAfterPhoto(r.result); r.readAsDataURL(f);
                  }} />
                </label>
                {afterPhoto && <img src={afterPhoto} alt="" className="w-12 h-12 rounded-lg object-cover" style={{ border: `1px solid ${C.line}` }} />}
              </div>
              <button onClick={() => act({ status: "review", completedAt: now, workNote: note || x.workNote, afterPhoto: afterPhoto || x.afterPhoto }, t("complete"))}
                className="w-full rounded-xl py-3 font-bold text-white flex items-center justify-center gap-2" style={{ background: "#7C3AED" }}>
                <Send size={18} /> {t("complete")}
              </button>
            </div>
          )}

          {/* supervisor assignment */}
          {canAssign && teammates.length > 0 && (
            <div className="rounded-xl p-3 space-y-2" style={{ border: `1px solid ${C.line}` }}>
              <div className="text-xs font-semibold" style={{ color: C.sub }}>{t("assignNow")}</div>
              <select className={inputCls} style={inputStyle} value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
                <option value="">{t("selectAssignee")}</option>
                {teammates.map((tm) => <option key={tm.id} value={tm.id}>{tm.name}</option>)}
              </select>
              <button disabled={!assignTo}
                onClick={() => act({ status: "accepted", assigneeId: assignTo, acceptedAt: now }, t("assignNow"))}
                className="w-full rounded-lg py-2 font-semibold text-sm text-white" style={{ background: assignTo ? C.primary : "#9CA8AB" }}>
                <Users size={14} className="inline mr-1" /> {t("assignNow")}
              </button>
            </div>
          )}

          {/* supervisor approval */}
          {canApprove && (
            <div className="space-y-2">
              <button onClick={() => act({ status: "done", approvedAt: now }, t("approve"))}
                className="w-full rounded-xl py-3 font-bold text-white flex items-center justify-center gap-2" style={{ background: "#059669" }}>
                <CheckCircle2 size={18} /> {t("approve")}
              </button>
              <Field label={`${t("returnFix")} (${t("note")})`}>
                <input className={inputCls} style={inputStyle} value={note} onChange={(e) => setNote(e.target.value)} />
              </Field>
              <button onClick={() => act({ status: "rejected", approvalNote: note || "—", completedAt: null, rejectCount: (x.rejectCount || 0) + 1 }, t("returnFix"))}
                className="w-full rounded-xl py-2.5 font-semibold text-sm text-white" style={{ background: "#B45309" }}>
                <RotateCcw size={15} className="inline mr-1" /> {t("returnFix")}
              </button>
            </div>
          )}

          {/* reporter rating */}
          {canRate && (
            <div className="rounded-xl p-3 text-center" style={{ background: C.primarySoft }}>
              <div className="text-sm font-semibold mb-2" style={{ color: C.primary }}>{t("rate")}</div>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => act({ rating: n }, t("rated"))}>
                    <Star size={28} style={{ color: C.accent }} />
                  </button>
                ))}
              </div>
            </div>
          )}
          {x.rating && (
            <div className="flex items-center justify-center gap-1 text-sm" style={{ color: C.accentDark }}>
              {Array.from({ length: x.rating }).map((_, i) => <Star key={i} size={16} fill={C.accent} style={{ color: C.accent }} />)}
              <span className="ml-1">{x.rating}/5</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function Info({ label, value }) {
  return (
    <div>
      <div className="text-xs" style={{ color: C.sub }}>{label}</div>
      <div className="font-semibold" style={{ color: C.ink }}>{value}</div>
    </div>
  );
}

/* ============================ REPORTS / KPI ============================ */
function Reports({ t, lang, tickets, userById, users }) {
  const techs = users.filter((u) => u.role === "technician");
  const kpi = techs.map((tech) => {
    const mine = tickets.filter((x) => x.assigneeId === tech.id);
    const done = mine.filter((x) => x.status === "done");
    const accepts = mine.map((x) => hoursBetween(x.createdAt, x.acceptedAt)).filter((v) => v != null);
    const resolves = done.map((x) => hoursBetween(x.createdAt, x.approvedAt)).filter((v) => v != null);
    const onTime = done.filter((x) => hoursBetween(x.createdAt, x.approvedAt) <= findPri(x.priority).sla).length;
    const ratings = done.map((x) => x.rating).filter(Boolean);
    const rejected = mine.reduce((s, x) => s + (x.rejectCount || 0), 0);
    const avg = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : null);
    return {
      tech, completed: done.length,
      avgAccept: avg(accepts), avgResolve: avg(resolves),
      onTime: done.length ? Math.round((onTime / done.length) * 100) : null,
      rejected, rating: ratings.length ? (ratings.reduce((s, v) => s + v, 0) / ratings.length) : null,
    };
  }).filter((k) => tickets.some((x) => x.assigneeId === k.tech.id));

  const chart = kpi.map((k) => ({ name: k.tech.name.split(" ")[0], value: k.completed }));

  return (
    <div className="space-y-5">
      <Card title={t("kpiTitle")}>
        {chart.length > 0 && (
          <div style={{ height: 200 }} className="mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.line} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: C.sub }} />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12, fill: C.sub }} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} fill={C.accent} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: 560 }}>
            <thead>
              <tr style={{ color: C.sub }} className="text-left">
                <th className="py-2 font-semibold">{t("staff")}</th>
                <th className="py-2 font-semibold text-center">{t("kpiCompleted")}</th>
                <th className="py-2 font-semibold text-center">{t("kpiAvgAccept")}</th>
                <th className="py-2 font-semibold text-center">{t("kpiAvgResolve")}</th>
                <th className="py-2 font-semibold text-center">{t("kpiOnTime")}</th>
                <th className="py-2 font-semibold text-center">{t("kpiReject")}</th>
                <th className="py-2 font-semibold text-center">{t("kpiRating")}</th>
              </tr>
            </thead>
            <tbody>
              {kpi.length === 0 && <tr><td colSpan={7} className="py-6 text-center" style={{ color: C.sub }}>{t("noData")}</td></tr>}
              {kpi.map((k) => (
                <tr key={k.tech.id} style={{ borderTop: `1px solid ${C.line}` }}>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: (k.tech.dept === "it" ? "#2563EB" : C.primary) + "18", color: k.tech.dept === "it" ? "#2563EB" : C.primary }}>
                        {k.tech.dept === "it" ? <Monitor size={14} /> : <Wrench size={14} />}
                      </span>
                      <div>
                        <div className="font-semibold" style={{ color: C.ink }}>{k.tech.name}</div>
                        <div className="text-xs" style={{ color: C.sub }}>{k.tech.branch}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center font-bold">{k.completed}</td>
                  <td className="text-center">{fmtH(k.avgAccept)}{k.avgAccept != null && <span style={{ color: C.sub }}> {t("hours")}</span>}</td>
                  <td className="text-center">{fmtH(k.avgResolve)}{k.avgResolve != null && <span style={{ color: C.sub }}> {t("hours")}</span>}</td>
                  <td className="text-center">
                    {k.onTime == null ? "-" : <span className="font-semibold" style={{ color: k.onTime >= 80 ? "#059669" : k.onTime >= 50 ? "#D97706" : "#DC2626" }}>{k.onTime}%</span>}
                  </td>
                  <td className="text-center" style={{ color: k.rejected ? "#B45309" : C.sub }}>{k.rejected}</td>
                  <td className="text-center">
                    {k.rating == null ? "-" : <span className="font-semibold" style={{ color: C.accentDark }}>★ {k.rating.toFixed(1)}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ============================ ADMIN ============================ */
function Admin({ t, lang, users, tickets, setTickets, showToast }) {
  return (
    <div className="space-y-5">
      <Card title={t("users")}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: 480 }}>
            <thead><tr className="text-left" style={{ color: C.sub }}>
              <th className="py-2 font-semibold">{t("username")}</th>
              <th className="py-2 font-semibold">ชื่อ</th>
              <th className="py-2 font-semibold">บทบาท</th>
              <th className="py-2 font-semibold">{t("branch")}</th>
            </tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderTop: `1px solid ${C.line}` }}>
                  <td className="py-2 font-mono">{u.username}</td>
                  <td>{u.name}</td>
                  <td>{t("role_" + u.role)}{u.dept ? ` (${lbl(DEPTS[u.dept], lang)})` : ""}</td>
                  <td>{u.branch || t("allBranches")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card title={t("branch")}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BRANCHES.map((b) => (
            <div key={b.code} className="rounded-xl p-3" style={{ border: `1px solid ${C.line}` }}>
              <div className="font-bold" style={{ color: C.primary }}>{b.code}</div>
              <div className="text-xs" style={{ color: C.sub }}>{lbl(b, lang)}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card title={t("resetDemo")}>
        <button onClick={() => { if (confirm(t("resetConfirm"))) { setTickets(buildSeedTickets()); showToast("OK"); } }}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white" style={{ background: C.primary }}>
          <RefreshCw size={16} /> {t("resetDemo")}
        </button>
      </Card>
    </div>
  );
}

/* ============================ SHARED ============================ */
function Card({ title, children }) {
  return (
    <section className="rounded-2xl p-4 sm:p-5" style={{ background: C.card, border: `1px solid ${C.line}` }}>
      {title && <h2 className="text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: C.sub, letterSpacing: ".04em" }}>{title}</h2>}
      {children}
    </section>
  );
}
function Empty({ t }) {
  return (
    <div className="text-center py-10" style={{ color: C.sub }}>
      <ClipboardList size={32} className="mx-auto mb-2 opacity-50" />
      <div className="text-sm">{t("empty")}</div>
    </div>
  );
}
function FontStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
      * { -webkit-tap-highlight-color: transparent; }
      button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 1px; }
      @media print {
        body * { visibility: hidden !important; }
        #print-area, #print-area *, #print-head, #print-head * { visibility: visible !important; }
        #print-head { position: fixed; top: 0; left: 0; right: 0; }
        #print-area { position: absolute; top: 70px; left: 0; right: 0; padding: 24px; }
        .no-print { display: none !important; }
      }
    `}</style>
  );
}
