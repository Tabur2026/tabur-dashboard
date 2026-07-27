import { useEffect, useRef } from "react";
import { useMsal } from "@azure/msal-react";
import { models, service, factories } from "powerbi-client";

// خدمة Power BI (تُنشأ مرة واحدة)
const powerbi = new service.Service(
  factories.hpmFactory,
  factories.wpmpFactory,
  factories.routerFactory
);

// نفس المعرّفات الموجودة في App.jsx
const REPORT_ID = "63993055-b8ca-4fa3-b07c-2a359e95abaa";
const GROUP_ID = "6bcc7dd2-30e5-4078-a153-d73ee1aee36f";

// صلاحية التضمين (delegated) — لازم تكون مضافة على تطبيق Azure
const PBI_SCOPE = "https://analysis.windows.net/powerbi/api/Report.Read.All";

/**
 * يعرض تقرير Power BI باستخدام توكن المستخدم من MSAL مباشرةً.
 * لا يعتمد على جلسة المتصفح ولا على كوكيز الطرف الثالث،
 * لذلك لا تظهر شاشة "تسجيل الدخول" داخل الـ iframe.
 *
 * pageName: معرّف صفحة التقرير (نفس قيم reportSections).
 */
export default function ReportEmbed({ pageName }) {
  const { instance, accounts } = useMsal();
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function embed() {
      const container = containerRef.current;
      if (!container || !accounts[0]) return;

      // نجلب التوكن بصمت، وإن فشل نطلب موافقة تفاعلية مرة واحدة
      const request = { scopes: [PBI_SCOPE], account: accounts[0] };
      let token;
      try {
        token = await instance.acquireTokenSilent(request);
      } catch {
        token = await instance.acquireTokenPopup(request);
      }
      if (cancelled) return;

      // ننظّف أي تضمين سابق قبل إعادة التضمين
      powerbi.reset(container);

      powerbi.embed(container, {
        type: "report",
        id: REPORT_ID,
        embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${REPORT_ID}&groupId=${GROUP_ID}`,
        accessToken: token.accessToken,
        tokenType: models.TokenType.Aad, // توكن مستخدم Entra — user owns data
        ...(pageName ? { pageName } : {}),
        settings: {
          panes: {
            nav: { visible: false },
            filters: { visible: false },
          },
          layoutType: models.LayoutType.Custom,
          customLayout: {
            displayOption: models.DisplayOption.FitToPage,
          },
          background: models.BackgroundType.Transparent,
        },
      });
    }

    embed();

    return () => {
      cancelled = true;
      if (containerRef.current) powerbi.reset(containerRef.current);
    };
  }, [instance, accounts, pageName]);

  return <div ref={containerRef} className="report-frame" />;
}
