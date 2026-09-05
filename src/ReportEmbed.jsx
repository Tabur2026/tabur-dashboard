import { useEffect, useRef } from "react";
import { useMsal } from "@azure/msal-react";
import { models, service, factories } from "powerbi-client";

const powerbi = new service.Service(
  factories.hpmFactory,
  factories.wpmpFactory,
  factories.routerFactory
);

const REPORT_ID = "63993055-b8ca-4fa3-b07c-2a359e95abaa";
const GROUP_ID = "6bcc7dd2-30e5-4078-a153-d73ee1aee36f";
const PBI_SCOPE = "https://analysis.windows.net/powerbi/api/Report.Read.All";

export default function ReportEmbed({ pageName }) {
  const { instance, accounts } = useMsal();
  const containerRef = useRef(null);
  const reportRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function embed() {
      const container = containerRef.current;
      if (!container || !accounts[0]) return;

      const request = { scopes: [PBI_SCOPE], account: accounts[0] };
      let token;
      try {
        token = await instance.acquireTokenSilent(request);
      } catch {
        token = await instance.acquireTokenPopup(request);
      }
      if (cancelled) return;

      powerbi.reset(container);

      const report = powerbi.embed(container, {
        type: "report",
        id: REPORT_ID,
        embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${REPORT_ID}&groupId=${GROUP_ID}`,
        accessToken: token.accessToken,
        tokenType: models.TokenType.Aad,
        ...(pageName ? { pageName } : {}),
        settings: {
          panes: {
            nav: { visible: false },
            pageNavigation: { visible: false },
            filters: { visible: false },
          },
          layoutType: models.LayoutType.Custom,
          customLayout: {
            displayOption: models.DisplayOption.FitToWidth, // ← بدل FitToPage
          },
          background: models.BackgroundType.Transparent,
        },
      });

      reportRef.current = report;

      if (pageName) {
        report.on("loaded", async () => {
          try {
            await report.setPage(pageName);
          } catch (e) {
            console.warn("تعذّر ضبط الصفحة:", e);
          }
        });
      }
    }

    embed();

    return () => {
      cancelled = true;
      const container = containerRef.current;
      if (container) {
        try {
          const existing = powerbi.get(container);
          if (existing) existing.off("loaded");
        } catch { /* تجاهل */ }
        powerbi.reset(container);
      }
      reportRef.current = null;
    };
  }, [instance, accounts, pageName]);

  // إعادة الضبط كل ما تغيّر حجم الحاوية (طي/فتح القائمة، ملء الشاشة، تغيير حجم النافذة)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      const report = reportRef.current;
      if (!report) return;
      report
        .updateSettings({
          layoutType: models.LayoutType.Custom,
          customLayout: { displayOption: models.DisplayOption.FitToWidth },
        })
        .catch(() => {});
    });

    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  return <div ref={containerRef} className="report-frame" />;
}
