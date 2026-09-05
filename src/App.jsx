import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate, NavLink } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import ReportEmbed from "./ReportEmbed";
import "./App.css";

import {
  Home,
  Wallet,
  Settings,
  Star,
  Users,
  Megaphone,
  Handshake,
  FlaskConical,
  ChevronDown,
  BarChart3,
  Landmark,
  ShoppingCart,
  Smartphone,
  Briefcase,
  MapPinned,
  ClipboardCheck,
  MessageSquareWarning,
  ShieldCheck,
  FileText,
  Receipt,
  CalendarCheck,
  ListTodo,
  RefreshCw,
  Maximize2,
  Minimize2,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const pageTitles = {
  "/dashboard": {
    title: "اللوحة التنفيذية",
    subtitle: "نظرة شاملة على مؤشرات الأداء الرئيسية",
  },
    "/tasks": {
    title: "لوحة أداء المهام ",
    subtitle: "نظرة شاملة على أداء الادارات ومؤشرات إنجاز المهام ",
  },
  "/meeting": {
    title: "متابعة الاجتماعات الدورية ",
    subtitle: "نلوحة مؤشرات التزام الفريق الاداري بالية الاجتماعات الدوية ",
  },
  "/finance": {
    title: "لوحة معلومات الإدارة المالية",
    subtitle: "لوحة مؤشرات الأداء المالي والتدفقات النقدية",
  },
  "/finance-kpis": {
    title: "مؤشرات المالية",
    subtitle: "مؤشرات الإيرادات والتكاليف والربحية والانحرافات المالية",
  },
  "/finance-cash": {
    title: "متابعة حركة النقد اليومية",
    subtitle:
      "متابعة التدفقات النقدية اليومية للبنوك والصناديق وتحليل الأرصدة والمتحصلات والمصروفات لدعم الرقابة المالية.",
  },
  "/rent-contracts": {
    title: "العقود الإيجارية",
    subtitle: "تحليل ومتابعة الالتزام بسداد المستحقات الإيجارية وحالة العقود",
  },
  "/operations": {
    title: "لوحة معلومات إدارة التشغيل",
    subtitle: "لوحة متابعة أداء الفروع والعمليات اليومية",
  },
  "/orders-details": {
    title: "تفاصيل الطلبات",
    subtitle:
      "تحليل تفصيلي للطلبات حسب الفروع لدعم متابعة الأداء التشغيلي",
  },
  "/apps-details": {
    title: "تفاصيل التطبيقات",
    subtitle: "متابعة أداء تطبيقات التوصيل وتحليل المبيعات حسب كل منصة",
  },
    "/daily_operations": {
    title: "لوحة أداء التشغيل اليومي",
    subtitle: "متابعة يومية لأداء الفروع والعمليات ",
  },
  "/workforce-productivity": {
    title: "إنتاجية القوى العاملة",
    subtitle:
      "قياس الإنتاجية وربطها بالطلبات وساعات العمل",
  },
  "/google-rating": {
    title: "تقييمات جوجل ماب",
    subtitle: "متابعة تقييمات العملاء على Google Maps وتحليل رضا العملاء حسب الفروع",
  },
  "/operations-complaints": {
    title: "شكاوى العملاء",
    subtitle: "متابعة شكاوى العملاء وتحليل أسبابها ومؤشرات الأداء",
  },
  "/quality": {
    title: "لوحة معلومات إدارة الجودة",
    subtitle: "لوحة مؤشرات رضا العملاء وجودة الخدمة المقدمة",
  },
  "/quality-score": {
    title: "تقييم جودة الفروع",
    subtitle: "متابعة نتائج الزيارات وتقييم أداء الفروع",
  },
  "/customer-complaints": {
    title: "شكاوى العملاء",
    subtitle: "متابعة شكاوى العملاء وتحليل أسبابها ومؤشرات الأداء",
  },
  "/hr": {
    title: "لوحة معلومات إدارة الموارد البشرية",
    subtitle: "لوحة مؤشرات الموظفين والحضور والموارد البشرية",
  },
  "/hr-workforce": {
    title: "امتثال القوى العاملة",
    subtitle: "متابعة بيانات القوى العاملة وحالة الامتثال التشغيلي للموظفين",
  },
  "/hr-compliance": {
    title: "الامتثال الحكومي",
    subtitle: "متابعة حالة الإقامات ورخص العمل والتنبيهات الحكومية الخاصة بالموظفين",
  },
  "/rents-contracts": {
    title: "العقود الإيجارية",
    subtitle: "تحليل ومتابعة الالتزام بسداد المستحقات الإيجارية وحالة العقود",
  },
  "/marketing": {
    title: "لوحة معلومات إدارة التسويق",
    subtitle: "لوحة مؤشرات الحملات والتفاعل ونمو العملاء",
  },
    "/marketing-plan": {
    title: "الخطة التسويقية والإنجاز",
    subtitle: "متابعة الأنشطة التسويقية المخططة شهرياً وسنوياً ونسب الإنجاز مقابل المستهدف",
  },
  "/mk-budget": {
    title: "الميزانية التسويقية",
    subtitle: "متابعة الميزانية المعتمدة مقابل المصروف الفعلي والانحرافات حسب البند والقناة",
  },
    "/mk-monthly_budget": {
    title: "الميزانية الشهرية",
    subtitle: "المتابعة الشهرية للميزانية، مقارنة الفعلي بالمخطط، وتحليل الأداء المالي الشهري",
  },
  "/franchise": {
    title: "لوحة معلومات إدارة الامتياز التجاري",
    subtitle: "لوحة متابعة مراحل الامتياز التجاري والتوسع",
  },
  "/franchise-compliance": {
    title: "نسبة التزام المانح والممنوح",
    subtitle: "متابعة مؤشرات الالتزام بين المانح والممنوح وتحليل نسب الإنجاز",
  },
  "/franchise-payments": {
    title: "فواتير المنح التجاري",
    subtitle: "متابعة سداد الرسوم والدفعات المستحقة لعقود الامتياز التجاري",
  },
    "/franchise-dpayments": {
    title: "كشف حساب الممنوح ",
    subtitle: "متابعة سداد الرسوم والدفعات المستحقة لعقود الامتياز التجاري",
  },
  "/cheque": {
    title: "سند المطالبة",
    subtitle: "مبلغ مطالبة الممنوح",
  },
  "/lab": {
    title: "لوحة معلومات المعمل المركزي",
    subtitle: "عرض شامل لمبيعات الفروع والأصناف وتحليل الأداء لدعم اتخاذ القرار",
  },
  "/lab-details": {
    title: "اللوحة التفصيلية لمبيعات المعمل المركزي",
    subtitle: "عرض تفصيلي لمبيعات الفروع والأصناف وتحليل الأداء لدعم اتخاذ القرار",
  },
};

const menuGroups = [
    {
    title: "الرئيسية",
    icon: <Home size={19} />,
    pages: [
      { title: "الرئيسية", path: "/dashboard", icon: <ListTodo size={16} /> },
      { title: "لوحة مهام الفريق الإداري", path: "/tasks", icon: <ListTodo size={16} /> },
      { title: "مؤشرات الاجتماعات الدورية", path: "/meeting", icon: <CalendarCheck size={16} /> },
    ],
  },

  {
    title: "الإدارة المالية",
    icon: <Wallet size={19} />,
    pages: [
      { title: "لوحة المالية", path: "/finance", icon: <Wallet size={16} /> },
      { title: "مؤشرات المالية", path: "/finance-kpis", icon: <BarChart3 size={16} /> },
      { title: "حركة النقد اليومية", path: "/finance-cash", icon: <Landmark size={16} /> },
      { title: "عقود الإيجار", path: "/rent-contracts", icon: <FileText size={16} /> },
    ],
  },

  {
    title: "إدارة التشغيل",
    icon: <Settings size={19} />,
    pages: [
      { title: "لوحة التشغيل", path: "/operations", icon: <Settings size={16} /> },
      { title: "تفاصيل الطلبات", path: "/orders-details", icon: <ShoppingCart size={16} /> },
      { title: "تفاصيل التطبيقات", path: "/apps-details", icon: <Smartphone size={16} /> }, 
       { title: "الأداء اليومي", path: "/daily_operations", icon: <Settings size={16} /> },
      { title: "إنتاجية القوى العاملة", path: "/workforce-productivity", icon: <Briefcase size={16} /> },
      { title: "تقييمات جوجل ماب", path: "/google-rating", icon: <MapPinned size={16} /> },
      { title: "شكاوى العملاء", path: "/operations-complaints", icon: <MessageSquareWarning size={16} /> },
    ],
  },

  {
    title: "إدارة الجودة",
    icon: <Star size={19} />,
    pages: [
      { title: "لوحة الجودة", path: "/quality", icon: <Star size={16} /> },
      { title: "تقييم جودة الفروع", path: "/quality-score", icon: <ClipboardCheck size={16} /> },
      { title: "شكاوى العملاء", path: "/customer-complaints", icon: <MessageSquareWarning size={16} /> },
    ],
  },

  {
    title: "إدارة الموارد البشرية",
    icon: <Users size={19} />,
    pages: [
      { title: "لوحة الموارد البشرية", path: "/hr", icon: <Users size={16} /> },
      { title: "امتثال القوى العاملة", path: "/hr-workforce", icon: <Briefcase size={16} /> },
      { title: "الامتثال الحكومي", path: "/hr-compliance", icon: <ShieldCheck size={16} /> },
      { title: "عقود الإيجار", path: "/rents-contracts", icon: <FileText size={16} /> },
    ],
  },

  {  
    title: "إدارة الامتياز التجاري",
    icon: <Handshake size={19} />,
    pages: [
      { title: "لوحة الامتياز", path: "/franchise", icon: <Handshake size={16} /> },
      { title: "سجل الممنوحين", path: "/franchise-compliance", icon: <ClipboardCheck size={16} /> },
      { title: "فواتير المنح التجاري", path: "/franchise-payments", icon: <Receipt size={16} /> },
      { title: "كشف حساب الممنوحين", path: "/franchise-dpayments", icon: <Receipt size={16} /> },
    ],
  },

  {
    title: "إدارة التسويق",
    icon: <Megaphone size={19} />,
    pages: [
      { title: "لوحة التسويق", path: "/marketing", icon: <Megaphone size={16} /> },
       { title: "الخطة التسويقية والإنجاز", path: "/marketing-plan", icon: <Megaphone size={16} /> },
       { title: "الميزانية التسويقية", path: "/mk-budget", icon: <Megaphone size={16} /> }, 
       { title: " المتابعة الشهرية ", path: "/mk-monthly_budget", icon: <Megaphone size={16} /> },

    ],
  },

  {
    title: "المعمل المركزي",
    icon: <FlaskConical size={19} />,
    pages: [
      { title: "المعمل المركزي", path: "/lab", icon: <FlaskConical size={16} /> },
      { title: "تفاصيل مبيعات المعمل", path: "/lab-details", icon: <FlaskConical size={16} /> },
    ],
  },
];

const userPermissions = {
  "coordinated@tabur.sa": [
    "/dashboard", "/tasks","/meeting",
    "/finance", "/finance-kpis", "/finance-cash", "/rent-contracts",
    "/operations", "/orders-details", "/apps-details",  "/daily_operations","/workforce-productivity",
    "/google-rating", "/quality", "/quality-score", "/quality-notes",
    "/operations-complaints", "/hr", "/hr-workforce", "/hr-compliance",
    "/marketing", "/marketing-plan", "/mk-budget", "/mk-monthly_budget","/franchise", "/franchise-compliance", "/franchise-payments","/franchise-dpayments",
    "/lab", "/lab-details", "/cheque",
  ],
  "abdullah@tabur.sa": [
    "/dashboard", "/meeting","/tasks"
    "/finance", "/finance-kpis", "/finance-cash", "/rent-contracts",
    "/operations", "/orders-details", "/apps-details", "/daily_operations", "/workforce-productivity",
    "/google-rating", "/quality", "/quality-score", "/quality-notes",
    "/operations-complaints", "/hr", "/hr-workforce", "/hr-compliance",
    "/marketing", "/marketing-plan", "/mk-budget", "/mk-monthly_budget","/franchise", "/franchise-compliance", "/franchise-payments","/franchise-dpayments",
    "/lab", "/lab-details", "/cheque",
  ],
  "finance@tabur.sa": [
   "/tasks", "/meeting",
    "/finance", "/finance-kpis", "/finance-cash", "/rent-contracts",
  ],
  "quality@tabur.sa": [
   "/tasks", "/meeting",
    "/quality", "/quality-score", "/quality-notes", "/customer-complaints",
  ],
  "khaled@tabur.sa": [
   "/tasks", "/meeting",
    "/operations", "/orders-details", "/apps-details", "/daily_operations",
    "/workforce-productivity", "/google-rating", "/operations-complaints",
  ],
  "hr@tabur.sa": [
    "/tasks", "/meeting",
    "/hr", "/hr-workforce", "/hr-compliance", "/rents-contracts",
  ],
  "marketing@tabur.sa": ["/tasks", "/meeting", "/marketing", "/marketing-plan", "/mk-budget" , "/mk-monthly_budget", ],
  "franchise@tabur.sa": [
    "/tasks", "/meeting",
    "/franchise", "/franchise-compliance", "/franchise-payments","/franchise-dpayments","/cheque",
  ],
};

const reportSections = {
  "/dashboard": "b9e2e9efdf1360d7d4de",
  "/tasks": "4e5c3fa6c4754ee7def8",
  "/meeting": "aeafd3221d78f0bb37eb",
  "/finance": "c38620a696b6fc62d0f5",
  "/finance-kpis": "744ea543b00dc4c146f7",
  "/finance-cash": "9ad4e769c14a39ca268e",
  "/rent-contracts": "b4ecc3263114ac9c84e7",
  "/operations": "e2d2ca579db275a86208",
  "/orders-details": "27ddec1409873965ab4b",
  "/apps-details": "957703b4c99da1359cdf",
  "/workforce-productivity": "41adb7b772af79309837",
  "/google-rating": "17eb8cc1e4276dc5a1e4",
   "/daily_operations": "1db5be54953e7ae50a32",
  "/operations-complaints": "fc185d48dcafe56011c9",
  "/quality": "af65b321dcbe2c7b97b4",
  "/quality-score": "60cfe719a0a02a551b5b",
  "/customer-complaints": "fc185d48dcafe56011c9",
  "/hr": "2166af69dc744c28aa25",
  "/hr-workforce": "c0864ba9da2756782168",
  "/hr-compliance": "0a59daa9acfe550f378b",
  "/marketing": "52aadd0237e569b006aa",
  "/marketing-plan":"987e8acc33788e40b343",
  "/mk-budget": "b8a620672c8d5a03b8a7",
  "/mk-monthly_budget": "2818242fe45dd6704766",
  "/franchise": "0cd007a5f80637a22be2",
  "/franchise-compliance": "93f9ca943d246723deb2",
  "/franchise-payments": "6ab321362024cbd77e10",
  "/franchise-dpayments" : "19f46731208546d8b798",
  "/cheque":"4eed24906408c10eab55",
  "/lab": "a9e228f6ed216e03cb4d",
  "/lab-details": "17008c6744d05798cd94",
};

// ====== معرّفات Power BI ======
const POWERBI_GROUP_ID = "6bcc7dd2-30e5-4078-a153-d73ee1aee36f";   // معرّف الـ Workspace / Group
const POWERBI_DATASET_ID = "f3f3ba1d-efed-4054-bc33-167a12e56491";   // معرّف الـ Dataset
// ==================================================

/* الإدارة (المجموعة) التي تحتوي المسار الحالي */
function findGroupTitle(path) {
  const g = menuGroups.find((grp) => grp.pages.some((p) => p.path === path));
  return g ? g.title : null;
}
function LoginPage() {
  const { instance, accounts } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  if (accounts.length > 0) {
    const userEmail =
      accounts[0]?.username?.toLowerCase() ||
      accounts[0]?.idTokenClaims?.preferred_username?.toLowerCase() ||
      "";

    const allowedPages = userPermissions[userEmail] || [];

    if (allowedPages.length === 0) {
      return (
        <main className="auth" dir="rtl">
          <section className="auth-card">
            <img src="/profile_tabur2022.png" alt="طابور" className="auth-logo" />
            <h1 className="auth-title">لا توجد صلاحيات لهذا الحساب</h1>
            <p className="auth-sub">{userEmail}</p>
            <button
              className="btn-primary"
              onClick={() => instance.logoutRedirect()}
            >
              تسجيل الخروج
            </button>
          </section>
        </main>
      );
    }

    return <Navigate to={allowedPages[0]} replace />;
  }

  return (
    <main className="auth" dir="rtl">
      <section className="auth-card">
        <img src="/profile_tabur2022.png" alt="طابور" className="auth-logo" />
        <h1 className="auth-title">بـوابــة طـابــور الــذكــيــة</h1>
        <p className="auth-sub">منصة القيادة التنفيذية لمؤشرات الأداء</p>

        <span className="auth-divider" />

        <button className="btn-primary" onClick={handleLogin}>
          تسجيل الدخول بحساب الشركة
        </button>

        <p className="auth-note">يستخدم Microsoft Entra ID لتأمين الدخول</p>
      </section>
    </main>
  );
}

function ProtectedRoute({ children }) {
  const { accounts } = useMsal();

  if (accounts.length === 0) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function PortalLayout({ pagePath }) {
  const { instance, accounts } = useMsal();
  const [openGroup, setOpenGroup] = useState(() => findGroupTitle(pagePath));
  const [lastUpdate, setLastUpdate] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [nonce, setNonce] = useState(0);
  const [spin, setSpin] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef(null);

  // فتح إدارة الصفحة الحالية تلقائياً عند التنقل
  useEffect(() => {
    setOpenGroup(findGroupTitle(pagePath));
    setDrawer(false);
  }, [pagePath]);

  // خروج من ملء الشاشة بمفتاح Esc + إغلاق قائمة المستخدم
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") {
        setExpanded(false);
        setUserOpen(false);
      }
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  // إغلاق قائمة المستخدم عند الضغط خارجها
  useEffect(() => {
    const onClick = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // جلب وقت آخر تحديث ناجح من Power BI REST API
  // يعمل عند فتح الصفحة، وعند الضغط على زر التحديث (nonce)
  useEffect(() => {
    let cancelled = false;

    async function fetchLastRefresh() {
      try {
        if (!accounts[0]) return;

        // نجلب التوكن بصمت، وإن فشل نطلب موافقة تفاعلية (مرة واحدة)
        const request = {
          scopes: ["https://analysis.windows.net/powerbi/api/Dataset.Read.All"],
          account: accounts[0],
        };
        let token;
        try {
          token = await instance.acquireTokenSilent(request);
        } catch {
          token = await instance.acquireTokenPopup(request);
        }
        if (cancelled) return;

        // نجلب آخر عدّة عمليات تحديث ونختار آخر عملية ناجحة فعلاً
        const res = await fetch(
          `https://api.powerbi.com/v1.0/myorg/groups/${POWERBI_GROUP_ID}/datasets/${POWERBI_DATASET_ID}/refreshes?$top=10`,
          { headers: { Authorization: `Bearer ${token.accessToken}` } }
        );
        if (!res.ok) return;

        const json = await res.json();
        const history = json.value || [];

        // آخر عملية مكتملة (Completed) ولها وقت انتهاء
        const lastOk = history.find(
          (r) => r.status === "Completed" && r.endTime
        );
        if (cancelled || !lastOk) return;

        // تنسيق بتوقيت السعودية صراحةً (مستقل عن جهاز المستخدم)
        const text = new Date(lastOk.endTime).toLocaleString("en-GB", {
          timeZone: "Asia/Riyadh",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        setLastUpdate(text);
      } catch (e) {
        console.warn("تعذّر جلب وقت التحديث:", e);
      }
    }

    fetchLastRefresh();
    return () => {
      cancelled = true;
    };
  }, [instance, accounts, nonce]);

  const userName = accounts[0]?.name || "مستخدم طابور";

  const userEmail =
    accounts[0]?.username?.toLowerCase() ||
    accounts[0]?.idTokenClaims?.preferred_username?.toLowerCase() ||
    "";

  const allowedPages = userPermissions[userEmail] || [];

  if (allowedPages.length === 0) {
    return <Navigate to="/" replace />;
  }

  if (!allowedPages.includes(pagePath)) {
    return <Navigate to={allowedPages[0]} replace />;
  }

  const allowedMenuGroups = menuGroups
    .map((group) => ({
      ...group,
      pages: group.pages?.filter((page) => allowedPages.includes(page.path)) || [],
    }))
    .filter((group) => group.pages.length > 0);

  const currentPage = pageTitles[pagePath] || pageTitles["/dashboard"];
  const sectionId = reportSections[pagePath] || reportSections["/dashboard"];
  const activeGroup = findGroupTitle(pagePath);

  const refresh = () => {
    setSpin(true);
    setNonce((n) => n + 1);
    window.setTimeout(() => setSpin(false), 900);
  };

  return (
    <div className={`shell${expanded ? " is-expanded" : ""}`} dir="rtl">
      {/* ستارة الجوال */}
      <div
        className={`scrim${drawer ? " show" : ""}`}
        onClick={() => setDrawer(false)}
      />

      {/* ============ الشريط الجانبي ============ */}
      <aside className={`rail${drawer ? " show" : ""}`}>
        <div className="rail-top">
          <div className="rail-brand">
            <img src="/profile_tabur2022.png" alt="Tabur" />
          </div>
          <button
            className="rail-close"
            onClick={() => setDrawer(false)}
            aria-label="إغلاق القائمة"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="rail-nav" aria-label="أقسام اللوحة">
          {allowedMenuGroups.map((group) => {
            const isOpen = openGroup === group.title;
            const isActive = activeGroup === group.title;

            return (
              <div className={`nav-group${isOpen ? " open" : ""}`} key={group.title}>
                <button
                  type="button"
                  className={`nav-head${isActive ? " active" : ""}`}
                  onClick={() => setOpenGroup(isOpen ? null : group.title)}
                  aria-expanded={isOpen}
                >
                  <span className="nav-ico">{group.icon}</span>
                  <span className="nav-label">{group.title}</span>
                  <ChevronDown size={15} className="nav-chev" />
                </button>

                <div className="nav-sub">
                  <div className="nav-sub-inner">
                    {group.pages.map((page) => (
                      <NavLink
                        key={page.path}
                        to={page.path}
                        className={({ isActive }) =>
                          `nav-link${isActive ? " active" : ""}`
                        }
                      >
                        <span className="nav-link-ico">{page.icon}</span>
                        <span>{page.title}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* ============ مساحة العمل ============ */}
      <main className="work">
        <header className="work-head">
          <div className="work-head-start">
            <button
              className="work-burger"
              onClick={() => setDrawer(true)}
              aria-label="فتح القائمة"
            >
              <Menu size={19} />
            </button>
            <div className="work-titles">
              <h1 className="work-title">{currentPage.title}</h1>
              <p className="work-sub">{currentPage.subtitle}</p>
            </div>
          </div>

          <div className="work-tools">
            <div className="tools-row">
              <button
                className="tool"
                onClick={() => setExpanded((v) => !v)}
                aria-label={expanded ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
              >
                {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              <button className="tool" onClick={refresh} aria-label="تحديث التقرير">
                <RefreshCw size={16} className={spin ? "spin" : undefined} />
              </button>

              <div className={`user${userOpen ? " open" : ""}`} ref={userRef}>
                <button
                  type="button"
                  className="user-btn"
                  onClick={() => setUserOpen((v) => !v)}
                  aria-expanded={userOpen}
                >
                  <span className="user-avatar">{userName.charAt(0)}</span>
                  <span className="user-name">{userName}</span>
                  <ChevronDown size={15} className="user-chev" />
                </button>

                <div className="user-menu">
                  <div className="user-menu-head">
                    <span className="user-menu-avatar">{userName.charAt(0)}</span>
                    <div className="user-menu-meta">
                      <strong>{userName}</strong>
                      <span>{userEmail}</span>
                    </div>
                  </div>
                  <div className="user-menu-body">
                    <button
                      type="button"
                      className="user-menu-logout"
                      onClick={() => instance.logoutRedirect()}
                    >
                      <LogOut size={17} />
                      تسجيل الخروج
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {lastUpdate && (
              <span className="stamp">
                آخر تحديث للبيانات · <bdi>{lastUpdate}</bdi>
              </span>
            )}
          </div>
        </header>

        <section className="report">
          <ReportEmbed key={`${pagePath}-${nonce}`} pageName={sectionId} />
        </section>
      </main>
    </div>
  );
}

function App() {
  const portalRoutes = Object.keys(pageTitles);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {portalRoutes.map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <PortalLayout pagePath={path} />
              </ProtectedRoute>
            }
          />
        ))}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
