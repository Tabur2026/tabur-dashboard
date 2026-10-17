import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Minimize2,
  Search,
} from "lucide-react";

// بعد كم ساعة نعتبر البيانات قديمة (النقطة تتحول للأحمر)
const STALE_HOURS = 24;
// مدة اختفاء الشريط بعد آخر حركة (ملي ثانية)
const IDLE_MS = 3000;

export default function FullscreenDock({
  groups,          // allowedMenuGroups
  pagePath,
  lastUpdate,      // النص المنسّق
  lastUpdateAt,    // Date أو null
  spin,
  onRefresh,
  onExit,
}) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const [q, setQ] = useState("");
  const idleRef = useRef(null);
  const inputRef = useRef(null);

  // كل الصفحات بالترتيب (للسابق / التالي)
  const flat = useMemo(
    () => groups.flatMap((g) => g.pages.map((p) => ({ ...p, group: g.title }))),
    [groups]
  );
  const idx = flat.findIndex((p) => p.path === pagePath);
  const current = flat[idx];

  const isStale =
    lastUpdateAt && Date.now() - lastUpdateAt.getTime() > STALE_HOURS * 3600 * 1000;

  // إظهار الشريط ثم إخفاؤه بعد فترة سكون
  const wake = () => {
    setVisible(true);
    clearTimeout(idleRef.current);
    idleRef.current = setTimeout(() => setVisible(false), IDLE_MS);
  };

  useEffect(() => {
    wake();
    const onMove = () => wake();
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      wake();
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", onKey);
      clearTimeout(idleRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // الشريط يبقى ظاهر طول ما اللوحة مفتوحة
  useEffect(() => {
    if (open) {
      clearTimeout(idleRef.current);
      setVisible(true);
      setQ("");
      setOpenGroup(current?.group || null);
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      wake();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  const step = (d) => {
    if (!flat.length) return;
    const next = flat[(idx + d + flat.length) % flat.length];
    navigate(next.path);
  };

  const query = q.trim();
  const filtered = groups
    .map((g) => {
      if (!query) return g;
      const groupHit = g.title.includes(query);
      const pages = g.pages.filter((p) => groupHit || p.title.includes(query));
      return { ...g, pages };
    })
    .filter((g) => g.pages.length > 0);

  return (
    <>
      {/* شريط حسّاس أسفل الشاشة: لأن الماوس فوق التقرير لا يرسل حركة للبوابة */}
      <div className="dock-hotzone" onMouseEnter={wake} />

      {open && <div className="dock-scrim" onClick={() => setOpen(false)} />}

      <div className={`dock-panel${open ? " open" : ""}`} role="dialog" aria-label="التنقل بين الإدارات">
        <div className="dock-search">
          <Search size={16} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن إدارة أو صفحة…"
          />
          <kbd>Esc</kbd>
        </div>

        <div className="dock-groups">
          {filtered.map((g) => {
            const expandedGroup = query || openGroup === g.title;
            const active = current?.group === g.title;
            return (
              <div className={`dock-group${active ? " active" : ""}`} key={g.title}>
                <button
                  type="button"
                  className="dock-group-head"
                  onClick={() =>
                    g.pages.length === 1
                      ? go(g.pages[0].path)
                      : setOpenGroup(openGroup === g.title ? null : g.title)
                  }
                >
                  <span className="dock-group-ico">{g.icon}</span>
                  <span className="dock-group-meta">
                    <b>{g.title}</b>
                    <small>{g.pages.length} {g.pages.length > 2 ? "صفحات" : "صفحة"}</small>
                  </span>
                </button>

                {expandedGroup && g.pages.length > 1 && (
                  <div className="dock-pages">
                    {g.pages.map((p) => (
                      <button
                        type="button"
                        key={p.path}
                        className={`dock-page${p.path === pagePath ? " on" : ""}`}
                        onClick={() => go(p.path)}
                      >
                        {p.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && <p className="dock-empty">لا توجد نتائج</p>}
        </div>
      </div>

      <div className={`dock${visible || open ? "" : " hide"}`} onMouseEnter={wake}>
        <button
          type="button"
          className={`dock-btn main${open ? " on" : ""}`}
          onClick={() => setOpen((v) => !v)}
        >
          <LayoutGrid size={17} />
          الإدارات
        </button>

        <div className="dock-cur">
          <small>{current?.group}</small>
          <span>{current?.title}</span>
        </div>

        {lastUpdate && (
          <>
            <span className="dock-sep" />
            <div
              className={`dock-upd${isStale ? " stale" : ""}`}
              title={isStale ? "البيانات لم تُحدَّث منذ أكثر من يوم" : "البيانات محدّثة"}
            >
              <span className="dock-dot" />
              آخر تحديث: <bdi>{lastUpdate}</bdi>
            </div>
          </>
        )}

        <span className="dock-sep" />

        <button type="button" className="dock-btn ico" onClick={() => step(-1)} aria-label="الصفحة السابقة">
          <ChevronRight size={17} />
        </button>
        <button type="button" className="dock-btn ico" onClick={() => step(1)} aria-label="الصفحة التالية">
          <ChevronLeft size={17} />
        </button>
        <button type="button" className="dock-btn ico" onClick={onRefresh} aria-label="تحديث التقرير">
          <RefreshCw size={16} className={spin ? "spin" : undefined} />
        </button>
        <button type="button" className="dock-btn ico" onClick={onExit} aria-label="إنهاء ملء الشاشة">
          <Minimize2 size={16} />
        </button>
      </div>
    </>
  );
}
