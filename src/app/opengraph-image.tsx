import { ImageResponse } from "next/og";
import { site } from "@/content";

export const alt = `${site.name} · ${site.role} · ${site.brand}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(900px 500px at 90% 0%, #5a1a2b 0%, transparent 70%), #080f1d",
          color: "#efe9e2",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#dbad96", fontSize: 24, letterSpacing: 6 }}>
          <div style={{ width: 48, height: 2, background: "#c9967e" }} />
          {site.brand.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, lineHeight: 1, color: "#f8f4ef" }}>{site.name}</div>
          <div style={{ marginTop: 24, fontSize: 36, color: "#e8c6b3" }}>{site.role}</div>
          <div style={{ marginTop: 12, fontSize: 28, color: "#b9c0ce" }}>
            Senior SDET · Test Automation Lead · AI-Powered Quality Engineering
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#939db1" }}>
          <span>karthik.qatechlabs.com</span>
          <span>Playwright · TypeScript · APIs · Kafka · CI/CD</span>
        </div>
      </div>
    ),
    size,
  );
}
