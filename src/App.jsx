import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, NavLink } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
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
  FileSearch,
  MessageSquareWarning,
  ShieldCheck,
  FileText,
  Receipt,
} from "lucide-react";

const pageTitles = {
  "/dashboard": {
    title: "اللوحة التنفيذية",
    subtitle: "نظرة شاملة على مؤشرات الأداء الرئيسية",
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
      "تحليل تفصيلي للطلبات حسب الفروع وقنوات البيع وحالة الطلبات لدعم متابعة الأداء التشغيلي",
  },
  "/apps-details": {
    title: "تفاصيل التطبيقات",
    subtitle: "متابعة أداء تطبيقات التوصيل وتحليل المبيعات والطلبات حسب كل منصة",
  },
  "/workforce-productivity": {
    title: "إنتاجية القوى العاملة",
    subtitle:
      "قياس إنتاجية الموظفين والفروع وربط الأداء التشغيلي بساعات العمل وحجم الطلبات",
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
  "/quality-notes": {
    title: "تحليل ملاحظات الجودة",
    subtitle: "تحليل الملاحظات وحالة الإغلاق ونسب المعالجة",
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
  "/lab": {
    title: "لوحة معلومات المعمل المركزي",
    subtitle: "عرض شامل لمبيعات الفروع والأصناف وتحليل الأداء لدعم اتخاذ القرار",
  },
};

const menuGroups = [
  {
    title: "الرئيسية",
    icon: <Home size={20} />,
    path: "/dashboard",
    pages: [],
  },

  {
    title: "الإدارة المالية",
    icon: <Wallet size={20} />,
    pages: [
      { title: "لوحة المالية", path: "/finance", icon: <Wallet size={16} /> },
      { title: "مؤشرات المالية", path: "/finance-kpis", icon: <BarChart3 size={16} /> },
      { title: "حركة النقد اليومية", path: "/finance-cash", icon: <Landmark size={16} /> },
      { title: "عقود الإيجار", path: "/rent-contracts", icon: <FileText size={16} /> },
    ],
  },

  {
    title: "إدارة التشغيل",
    icon: <Settings size={20} />,
    pages: [
      { title: "لوحة التشغيل", path: "/operations", icon: <Settings size={16} /> },
      { title: "تفاصيل الطلبات", path: "/orders-details", icon: <ShoppingCart size={16} /> },
      { title: "تفاصيل التطبيقات", path: "/apps-details", icon: <Smartphone size={16} /> },
      { title: "إنتاجية القوى العاملة", path: "/workforce-productivity", icon: <Briefcase size={16} /> },
      { title: "تقييمات جوجل ماب", path: "/google-rating", icon: <MapPinned size={16} /> },
      { title: "شكاوى العملاء", path: "/operations-complaints", icon: <MessageSquareWarning size={16} /> },
    ],
  },

  {
    title: "إدارة الجودة",
    icon: <Star size={20} />,
    pages: [
      { title: "لوحة الجودة", path: "/quality", icon: <Star size={16} /> },
      { title: "تقييم جودة الفروع", path: "/quality-score", icon: <ClipboardCheck size={16} /> },
      { title: "تحليل ملاحظات الجودة", path: "/quality-notes", icon: <FileSearch size={16} /> },
      { title: "شكاوى العملاء", path: "/customer-complaints", icon: <MessageSquareWarning size={16} /> },
    ],
  },

  {
    title: "إدارة الموارد البشرية",
    icon: <Users size={20} />,
    pages: [
      { title: "لوحة الموارد البشرية", path: "/hr", icon: <Users size={16} /> },
      { title: "امتثال القوى العاملة", path: "/hr-workforce", icon: <Briefcase size={16} /> },
      { title: "الامتثال الحكومي", path: "/hr-compliance", icon: <ShieldCheck size={16} /> },
      { title: "عقود الإيجار", path: "/rents-contracts", icon: <FileText size={16} /> },
    ],
  },

  {
    title: "إدارة الامتياز التجاري",
    icon: <Handshake size={20} />,
    pages: [
      { title: "لوحة الامتياز", path: "/franchise", icon: <Handshake size={16} /> },
      { title: "سجل الممنوحين", path: "/franchise-compliance", icon: <ClipboardCheck size={16} /> },
      { title: "فواتير المنح التجاري", path: "/franchise-payments", icon: <Receipt size={16} /> },
    ],
  },

  {
    title: "إدارة التسويق",
    icon: <Megaphone size={20} />,
    pages: [
      { title: "لوحة التسويق", path: "/marketing", icon: <Megaphone size={16} /> },
    ],
  },

  {
    title: "المعمل المركزي",
    icon: <FlaskConical size={20} />,
    pages: [
      { title: "المعمل المركزي", path: "/lab", icon: <FlaskConical size={16} /> },
    ],
  },
];
const userPermissions = {
  "coordinated@tabur.sa": [
      "/dashboard",

  "/finance",
  "/finance-kpis",
  "/finance-cash",
  "/rent-contracts",
  "/operations",
  "/orders-details",
  "/apps-details",
  "/workforce-productivity",
  "/google-rating",
  "/quality",
  "/quality-score",
  "/quality-notes",
  "/operations-complaints",
  "/hr",
  "/hr-workforce",
  "/hr-compliance",

  "/marketing",

  "/franchise",
  "/franchise-compliance",
  "/franchise-payments",

  "/lab",
  ],
  "abdullah@tabur.sa": [
      "/dashboard",

  "/finance",
  "/finance-kpis",
  "/finance-cash",
  "/rent-contracts",
  "/operations",
  "/orders-details",
  "/apps-details",
  "/workforce-productivity",
  "/google-rating",
  "/quality",
  "/quality-score",
  "/quality-notes",
  "/operations-complaints",
  "/hr",
  "/hr-workforce",
  "/hr-compliance",

  "/marketing",

  "/franchise",
  "/franchise-compliance",
  "/franchise-payments",

  "/lab",
  ],
  "finance@tabur.sa": [
    "/finance",
    "/finance-kpis",
    "/finance-cash",
    "/rent-contracts",
  ],
  "quality@tabur.sa": [
    "/quality",
    "/quality-score",
    "/quality-notes",
    "/customer-complaints",
  ],
  "khaled@tabur.sa": [
    "/operations",
    "/orders-details",
    "/apps-details",
    "/workforce-productivity",
    "/google-rating",
    "/operations-complaints",
  ],
  "hr@tabur.sa": [
    "/hr",
    "/hr-workforce",
    "/hr-compliance",
    "/rents-contracts",
  ],
  "marketing@tabur.sa": ["/marketing"],
  "franchise@tabur.sa": [
    "/franchise",
    "/franchise-compliance",
    "/franchise-payments",
  ],
};

const reportSections = {
  "/dashboard": "4e5c3fa6c4754ee7def8",
  "/finance": "c38620a696b6fc62d0f5",
  "/finance-kpis": "744ea543b00dc4c146f7",
  "/finance-cash": "9ad4e769c14a39ca268e",
  "/rent-contracts": "b4ecc3263114ac9c84e7",
  "/operations": "e2d2ca579db275a86208",
  "/orders-details": "27ddec1409873965ab4b",
  "/apps-details": "957703b4c99da1359cdf",
  "/workforce-productivity": "41adb7b772af79309837",
  "/google-rating": "17eb8cc1e4276dc5a1e4",
  "/operations-complaints" : "fc185d48dcafe56011c9",
  "/quality": "af65b321dcbe2c7b97b4",
  "/quality-score": "60cfe719a0a02a551b5b",
  "/quality-notes": "0b634162624cb758127d",
  "/customer-complaints": "fc185d48dcafe56011c9",
  "/hr": "2166af69dc744c28aa25",
  "/hr-workforce": "c0864ba9da2756782168",
  "/hr-compliance": "0a59daa9acfe550f378b",
  "/marketing": "52aadd0237e569b006aa",
  "/franchise": "0cd007a5f80637a22be2",
  "/franchise-compliance": "110577a68d5b4ded0c6a",
  "/franchise-payments": "7858c1fe7d2c37adb721",
  "/lab": "a9e228f6ed216e03cb4d",
};

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
        <main className="login-page" dir="rtl">
          <section className="login-card">
            <img src="/profile_tabur2022.png" alt="طابور" className="logo" />
            <h1>لا توجد صلاحيات لهذا الحساب</h1>
            <p>{userEmail}</p>
            <button
              className="login-button"
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
    <main className="login-page" dir="rtl">
      <section className="login-card">
        <img src="/profile_tabur2022.png" alt="طابور" className="logo" />
        <h1>بـوابــة طـابــور الــذكــيــة</h1>
        <p>تسجيل الدخول لعرض لوحة البيانات</p>
        <div className="divider"></div>

        <button className="login-button" onClick={handleLogin}>
          تسجيل الدخول بحساب الشركة
        </button>

        <p className="security-note">يستخدم Microsoft Entra ID لتأمين الدخول</p>
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
  const [openGroup, setOpenGroup] = useState(null);

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
  .filter((group) => allowedPages.includes(group.path) || group.pages.length > 0);

  const currentPage = pageTitles[pagePath] || pageTitles["/dashboard"];
  const sectionId = reportSections[pagePath] || reportSections["/dashboard"];

  const powerBiUrl =
    `https://app.powerbi.com/reportEmbed?reportId=63993055-b8ca-4fa3-b07c-2a359e95abaa` +
    `&autoAuth=true` +
    `&ctid=ab79833e-417a-460e-9da3-37a526b866f1` +
    `&navContentPaneEnabled=false` +
    `&filterPaneEnabled=false` +
    `&pageView=fitToWidth` +
    `&pageName=${sectionId}`;

  return (
    <div className="portal-page" dir="rtl">
      <aside className="portal-sidebar">
        <div className="sidebar-logo">
          <img src="/profile_tabur2022.png" alt="Tabur" />
        </div>

        <nav className="sidebar-menu">
          {allowedMenuGroups.map((group) => {
            const isOpen =
              openGroup === group.title ||
              group.pages.some((page) => page.path === pagePath);
              if (group.path) {
  return (
    <NavLink
      key={group.path}
      to={group.path}
      className={({ isActive }) =>
        `menu-group-btn single ${isActive ? "active" : ""}`
      }
    >
      <span className="group-icon">{group.icon}</span>
      <span className="group-title">{group.title}</span>
    </NavLink>
  );
}

            return (
              <div
                className={`menu-group ${isOpen ? "open" : ""}`}
                key={group.title}
              >
                <button
                  type="button"
                  className={`menu-group-btn ${isOpen ? "active" : ""}`}
                  onClick={() => setOpenGroup(isOpen ? null : group.title)}
                >
                  <span className="group-icon">{group.icon}</span>
                  <span className="group-title">{group.title}</span>
                  <ChevronDown size={16} className="chevron" />
                </button>

                <div className="submenu">
                  {group.pages.map((page) => (
                    <NavLink
                      key={page.path}
                      to={page.path}
                      className={({ isActive }) =>
                        `submenu-item ${isActive ? "active" : ""}`
                      }
                    >
                      {page.title}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <button
          className="sidebar-logout"
          onClick={() => instance.logoutRedirect()}
        >
          تسجيل الخروج
        </button>
      </aside>

      <main className="portal-main">
        <header className="portal-header">
          <div className="header-title">
            <h3>{currentPage.title}</h3>
            <p>{currentPage.subtitle}</p>
          </div>

          <div className="user-box">
            <div className="avatar">{userName.charAt(0)}</div>
            <div className="user-info">
              <span>مرحباً</span>
              <strong>{userName}</strong>
            </div>
          </div>
        </header>

        <section className="report-card">
          <iframe
            key={pagePath}
            title={currentPage.title}
            src={powerBiUrl}
            className="powerbi-frame"
            allowFullScreen
          />
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
