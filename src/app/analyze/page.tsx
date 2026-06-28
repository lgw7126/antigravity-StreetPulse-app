"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import styles from "./page.module.css";

// 캡슐화된 분석 로직 콘텐츠 컴포넌트
function AnalyzeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const districtName = searchParams.get("district") || "";

  const [progress, setProgress] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const statusMessages = [
    "유튜브 데이터베이스 접속 중...",
    "동네 F&B 관련 최근 3개월 영상 목록 스캔 중...",
    "월간 영상 업로드 개수 및 가중치 집계 중...",
    "조회수 성장성(Momentum) 변화량 계산 중...",
    "신규 크리에이터 채널 유입 비중 연산 중...",
    "상권 종합 온도 0-100 지표 도출 완료!",
    "Claude AI가 맞춤형 상권 전략 보고서를 집필하는 중...",
    "보고서 패키징 및 최종 출력 디자인 구성 중..."
  ];

  useEffect(() => {
    if (!districtName) {
      router.replace("/");
      return;
    }

    let isMounted = true;
    let timer: NodeJS.Timeout;
    
    // 최소 애니메이션 진행을 보장하기 위한 3초 진행 시뮬레이션
    const startTime = Date.now();
    
    // API 호출
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/analyze?district=${encodeURIComponent(districtName)}`);
        const json = await res.json();

        if (!isMounted) return;

        if (!res.ok || !json.success) {
          throw new Error(json.error || "분석 정보를 가져오는 중 에러가 발생했습니다.");
        }

        // 최소 3.5초 대기를 보장하여 사용자가 게이지 분석 애니메이션을 충분히 볼 수 있도록 함
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 3500 - elapsedTime);

        timer = setTimeout(() => {
          if (!isMounted) return;
          setProgress(100);
          setStatusIdx(statusMessages.length - 1);
          
          // 임시 세션스토리지에 저장하여 결과화면에서 네트워크 리다이렉션 없이 즉각 노출
          try {
            sessionStorage.setItem(`radar_result_${districtName}`, JSON.stringify(json));
          } catch (e) {
            console.error("세션스토리지 저장 실패:", e);
          }

          // 결과 화면으로 이동
          router.replace(`/result?district=${encodeURIComponent(districtName)}`);
        }, remainingTime);

      } catch (err: any) {
        if (!isMounted) return;
        setErrorMsg(err.message || "연동 과정에서 오류가 발생했습니다.");
      }
    };

    fetchData();

    // 상태 메세지 및 진행률 증가 애니메이션 타이머
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95; // API 완료 전까진 95%에서 대기
        return prev + Math.round(Math.random() * 8 + 2);
      });
      
      setStatusIdx((prev) => {
        if (prev >= statusMessages.length - 3) return statusMessages.length - 3;
        return prev + 1;
      });
    }, 450);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [districtName, router]);

  if (errorMsg) {
    return (
      <div className={styles.container}>
        <div className={`${styles.main} glass-card`} style={{ padding: "3rem 2rem" }}>
          <AlertCircle size={48} color="var(--hot)" style={{ marginBottom: "1rem" }} />
          <h2 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>분석 실패</h2>
          <p style={{ color: "#a1a1aa", fontSize: "0.95rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            {errorMsg}
          </p>
          <button
            onClick={() => router.replace("/")}
            style={{
              padding: "0.75rem 1.5rem",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "#ffffff",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            홈으로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* 상단 텍스트 */}
        <section className={styles.header}>
          <h1>
            <span className={styles.districtName}>‘{districtName}’</span> 상권 분석 중
          </h1>
          <p>유튜브 언급 신호와 인플루언서 트렌드를 실시간 수집하고 있습니다.</p>
        </section>

        {/* 회전 레이더 시뮬레이터 */}
        <section className={styles.radarContainer}>
          <div className={styles.radarSweepLine}></div>
          <div className={styles.radarCenter}></div>
          <div className={`${styles.radarTarget} ${styles.target1}`}></div>
          <div className={`${styles.radarTarget} ${styles.target2}`}></div>
          <div className={`${styles.radarTarget} ${styles.target3}`}></div>
        </section>

        {/* 상태 메시지 및 프로그레스 바 */}
        <section className={styles.statusBox}>
          <div className={styles.statusText}>{statusMessages[statusIdx]}</div>
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </section>
      </main>
    </div>
  );
}

// 최종 배포용 기본 컴포넌트 (Suspense 적용)
export default function AnalyzePage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <main className={styles.main}>
            <div className={styles.statusText}>분석 모듈 로딩 중...</div>
          </main>
        </div>
      }
    >
      <AnalyzeContent />
    </Suspense>
  );
}
