import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "골목 레이더 | 유튜브 데이터 기반 실시간 상권 분석",
  description: "유튜브 데이터와 AI를 활용하여 대한민국 주요 상권의 현재 온도를 실시간으로 감지하고 미래 성장 동력을 진단하는 서비스입니다.",
  keywords: ["상권분석", "골목상권", "유튜브데이터", "창업아이템", "AI리포트", "골목레이더", "AlleyRadar"],
  authors: [{ name: "Antigravity Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {/* 뒷배경 격자 및 네온 빛 효과 */}
        <div className="bg-grid"></div>
        <div className="ambient-glow-1"></div>
        <div className="ambient-glow-2"></div>
        
        {/* 메인 컨테이너 */}
        <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
