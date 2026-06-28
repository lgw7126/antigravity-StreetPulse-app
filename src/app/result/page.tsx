"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, Compass, Sparkles, CheckCircle2, AlertTriangle, 
  Lightbulb, Calendar, Eye, Play, Plus, X, BarChart3, TrendingUp, Users,
  RefreshCw
} from "lucide-react";
import styles from "./page.module.css";

interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: number;
  thumbnailUrl: string;
  videoUrl: string;
}

interface YouTubeAnalysisResult {
  videos: YouTubeVideo[];
  videoCount: number;
  viewCountGrowth: number;
  newChannelsCount: number;
  totalViewCount: number;
  topChannels: Array<{ name: string; count: number; subscriberRating: number }>;
  risingCategories: Array<{ category: string; count: number; percentage: number }>;
}

interface RadarReport {
  score: number;
  status: string;
  statusText: string;
  statusColor: string;
  statusDescription: string;
  metrics: {
    volume: { value: number; score: number; contribution: number };
    momentum: { value: number; score: number; contribution: number };
    diffusion: { value: number; score: number; contribution: number };
  };
}

interface ClaudeReportResult {
  summary: string;
  pros: string[];
  cons: string[];
  recommendation: string;
}

interface PublicCommercialData {
  averageMonthlySales: number;
  openingRate: number;
  closingRate: number;
  threeYearSurvivalRate: number;
  source: string;
}

interface AnalyzeApiResponse {
  success: boolean;
  district: string;
  radar: RadarReport;
  youtube: YouTubeAnalysisResult;
  ai: ClaudeReportResult;
  public: PublicCommercialData;
  timestamp: string;
}

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const districtName = searchParams.get("district") || "";

  const [data, setData] = useState<AnalyzeApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 비교 분석 상태들
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareDistrict, setCompareDistrict] = useState("");
  const [compareData, setCompareData] = useState<AnalyzeApiResponse | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);

  useEffect(() => {
    if (!districtName) {
      router.replace("/");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      // 1. 우선 세션스토리지에 캐시된 분석 정보가 있는지 조회
      try {
        const cached = sessionStorage.getItem(`radar_result_${districtName}`);
        if (cached) {
          setData(JSON.parse(cached));
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn("세션스토리지 읽기 에러:", e);
      }

      // 2. 캐시가 없으면(새로고침 등) 직접 API 호출
      try {
        const res = await fetch(`/api/analyze?district=${encodeURIComponent(districtName)}`);
        const json = await res.json();
        
        if (!res.ok || !json.success) {
          throw new Error(json.error || "상권 정보 조회에 실패했습니다.");
        }
        
        setData(json);
        // 향후 편의를 위해 세션 저장
        try {
          sessionStorage.setItem(`radar_result_${districtName}`, JSON.stringify(json));
        } catch (e) {}
      } catch (err: any) {
        setError(err.message || "연동 과정에서 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [districtName, router]);

  // 비교용 데이터 가져오기
  const handleCompareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compareDistrict.trim()) return;

    setCompareLoading(true);
    setCompareError(null);
    setCompareData(null);

    try {
      const res = await fetch(`/api/analyze?district=${encodeURIComponent(compareDistrict.trim())}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "비교 대상 상권 분석에 실패했습니다.");
      }

      setCompareData(json);
    } catch (err: any) {
      setCompareError(err.message || "API 호출 오류");
    } finally {
      setCompareLoading(false);
    }
  };

  // 날짜 가공 헬퍼
  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
    } catch (e) {
      return isoStr;
    }
  };

  // 숫자 천단위 컴마 헬퍼
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginTop: "10vh" }}>
          <div className="radarPulse" style={{ width: "60px", height: "60px", border: "3px dashed var(--primary)" }}></div>
          <p style={{ color: "#a1a1aa", fontSize: "0.95rem" }}>상권 리포트를 분석 가공 중입니다...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.container}>
        <div className="glass-card" style={{ maxWidth: "480px", textAlign: "center", padding: "3rem 2rem", marginTop: "10vh" }}>
          <AlertTriangle size={48} color="var(--hot)" style={{ marginBottom: "1rem", display: "inline-block" }} />
          <h2 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>리포트 조회 실패</h2>
          <p style={{ color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "1.5rem" }}>{error || "데이터를 불러올 수 없습니다."}</p>
          <button
            onClick={() => router.replace("/")}
            style={{
              padding: "0.65rem 1.25rem",
              background: "var(--primary)",
              border: "none",
              borderRadius: "8px",
              color: "#ffffff",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            다시 검색하기
          </button>
        </div>
      </div>
    );
  }

  const { radar, youtube, ai, public: publicData } = data;

  // SVG 게이지 치수 변수 계산
  const radius = 80;
  const circumference = radius * Math.PI; // 약 251.3
  const strokeDashoffset = circumference - (circumference * radar.score) / 100;
  const needleRotation = (radar.score / 100) * 180 - 90;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* 상단 네비게이션 헤더 */}
        <section className={styles.navHeader}>
          <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
            <button onClick={() => router.push("/")} className={styles.backBtn}>
              <ArrowLeft size={16} />
              <span>상권 다시 검색</span>
            </button>
            
            <button 
              onClick={() => {
                sessionStorage.removeItem(`radar_result_${districtName}`);
                router.replace(`/analyze?district=${encodeURIComponent(districtName)}`);
              }} 
              className={styles.backBtn}
              style={{ 
                borderLeft: "1px solid var(--border)", 
                paddingLeft: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <RefreshCw size={14} />
              <span>실시간 데이터 갱신</span>
            </button>
          </div>
          
          <h1 className={styles.reportTitle}>
            <span>{districtName}</span> 골목 상권 레이더 리포트
          </h1>

          <button onClick={() => { setIsCompareOpen(true); setCompareDistrict(""); setCompareData(null); setCompareError(null); }} className={styles.compareTriggerBtn}>
            <Plus size={16} />
            <span>다른 상권과 비교</span>
          </button>
        </section>

        {/* 1층: 온도계 및 AI 진단 카드 */}
        <section className={styles.topRow}>
          {/* 게이지 카드 */}
          <div className={`${styles.gaugeCard} glass-card`}>
            <div className={styles.gaugeWrapper}>
              <svg className={styles.gaugeSvg} viewBox="0 0 200 120">
                <path
                  d="M 20 110 A 80 80 0 0 1 180 110"
                  className={styles.gaugeTrack}
                />
                <path
                  d="M 20 110 A 80 80 0 0 1 180 110"
                  className={styles.gaugeFill}
                  style={{
                    stroke: radar.statusColor,
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset
                  }}
                />
              </svg>
              {/* 게이지 내부 바늘 회전 */}
              <div 
                className={styles.gaugeNeedle} 
                style={{ transform: `translate(-50%, 0) rotate(${needleRotation}deg)` }}
              />
              <div className={styles.gaugeCenterDot} />
              <div className={styles.scoreValue}>
                {radar.score}
                <span className={styles.scoreUnit}>°C</span>
              </div>
            </div>
            
            <div 
              className={styles.statusBadge}
              style={{ backgroundColor: radar.statusColor }}
            >
              {radar.statusText}
            </div>
            <p className={styles.statusDesc}>{radar.statusDescription}</p>
          </div>

          {/* Claude AI 종합 리포트 카드 */}
          <div className={`${styles.aiReportCard} glass-card`}>
            <div className={styles.aiHeader}>
              <div className={styles.aiIconWrapper}>
                <Sparkles size={20} />
              </div>
              <h2>Claude AI 핵심 상권 처방전</h2>
            </div>

            <div className={styles.aiSummary}>
              {ai.summary}
            </div>

            <div className={styles.aiProsCons}>
              <div className={styles.aiPros}>
                <h3>
                  <CheckCircle2 size={15} />
                  <span>상권 기회 요인 (Strengths)</span>
                </h3>
                <ul className={styles.aiList}>
                  {ai.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                </ul>
              </div>

              <div className={styles.aiCons}>
                <h3>
                  <AlertTriangle size={15} />
                  <span>진입 장벽 및 위협 (Risks)</span>
                </h3>
                <ul className={styles.aiList}>
                  {ai.cons.map((con, i) => <li key={i}>{con}</li>)}
                </ul>
              </div>
            </div>

            <div className={styles.aiRecommendation}>
              <h3>
                <Lightbulb size={16} />
                <span>AI 창업 추천 로드맵</span>
              </h3>
              <p>{ai.recommendation}</p>
            </div>
          </div>
        </section>

        {/* 2층: 3대 신호 상세 지표 */}
        <section className={styles.signalsSection}>
          <h2 className={styles.sectionTitle}>
            <Compass size={18} color="var(--primary)" />
            <span>상권 온도 구성 3대 레이더 신호</span>
          </h2>
          
          <div className={styles.signalsGrid}>
            {/* 볼륨 카드 */}
            <div className={`${styles.signalCard} glass-card`}>
              <div className={styles.signalHeader}>
                <span className={styles.signalLabel}>볼륨 신호 (가중치 30%)</span>
                <BarChart3 size={16} className={styles.signalIcon} />
              </div>
              <div className={styles.signalValue}>
                {youtube.videoCount}
                <span style={{ fontSize: "0.9rem", color: "#a1a1aa", marginLeft: "0.15rem" }}>개 영상</span>
              </div>
              <div className={styles.signalProgressWrapper}>
                <div 
                  className={styles.signalProgressFill}
                  style={{ width: `${radar.metrics.volume.score}%`, backgroundColor: "var(--primary)" }}
                />
              </div>
              <div className={styles.signalFootnote}>
                점수 환산: {radar.metrics.volume.score}점 (기여도 +{radar.metrics.volume.contribution}℃)
              </div>
            </div>

            {/* 모멘텀 카드 */}
            <div className={`${styles.signalCard} glass-card`}>
              <div className={styles.signalHeader}>
                <span className={styles.signalLabel}>모멘텀 신호 (가중치 50%)</span>
                <TrendingUp size={16} className={styles.signalIcon} />
              </div>
              <div className={styles.signalValue} style={{ color: youtube.viewCountGrowth >= 0 ? "var(--hot)" : "var(--cooling)" }}>
                {youtube.viewCountGrowth >= 0 ? "+" : ""}{youtube.viewCountGrowth}%
              </div>
              <div className={styles.signalProgressWrapper}>
                <div 
                  className={styles.signalProgressFill}
                  style={{ 
                    width: `${radar.metrics.momentum.score}%`, 
                    backgroundColor: youtube.viewCountGrowth >= 0 ? "var(--hot)" : "var(--cooling)" 
                  }}
                />
              </div>
              <div className={styles.signalFootnote}>
                점수 환산: {radar.metrics.momentum.score}점 (기여도 +{radar.metrics.momentum.contribution}℃)
              </div>
            </div>

            {/* 확산 카드 */}
            <div className={`${styles.signalCard} glass-card`}>
              <div className={styles.signalHeader}>
                <span className={styles.signalLabel}>채널 확산도 (가중치 20%)</span>
                <Users size={16} className={styles.signalIcon} />
              </div>
              <div className={styles.signalValue}>
                {youtube.newChannelsCount}
                <span style={{ fontSize: "0.9rem", color: "#a1a1aa", marginLeft: "0.15rem" }}>개 신규 채널</span>
              </div>
              <div className={styles.signalProgressWrapper}>
                <div 
                  className={styles.signalProgressFill}
                  style={{ width: `${radar.metrics.diffusion.score}%`, backgroundColor: "var(--stable)" }}
                />
              </div>
              <div className={styles.signalFootnote}>
                점수 환산: {radar.metrics.diffusion.score}점 (기여도 +{radar.metrics.diffusion.contribution}℃)
              </div>
            </div>
          </div>
        </section>

        {/* 공공 데이터 대조 섹션 */}
        {publicData && (
          <section className={styles.publicSection}>
            <h2 className={styles.sectionTitle}>
              <BarChart3 size={18} color="var(--primary)" />
              <span>정부 공공 데이터 상권 실태 대조군 (소진공/서울시 기준)</span>
            </h2>
            
            <div className={`${styles.publicCard} glass-card`}>
              <div className={styles.publicMainGrid}>
                {/* 평균 매출 */}
                <div className={styles.publicMetricBlock}>
                  <span className={styles.publicMetricLabel}>월평균 F&B 매출액</span>
                  <div className={styles.publicMetricValue}>
                    {formatNumber(Math.round(publicData.averageMonthlySales / 10000))}
                    <span style={{ fontSize: "1.1rem", color: "#a1a1aa", marginLeft: "0.2rem" }}>만 원</span>
                  </div>
                  <span className={styles.publicMetricFootnote}>점포당 카드 결제 및 현금영수증 집계 추정치</span>
                </div>
                
                {/* 개업률 vs 폐업률 */}
                <div className={styles.publicMetricBlock} style={{ borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
                  <span className={styles.publicMetricLabel}>최근 분기 진입동향 (개업률 vs 폐업률)</span>
                  <div className={styles.rateComparisonRow}>
                    <div className={styles.rateCol}>
                      <span style={{ color: "var(--primary)", fontWeight: 700 }}>개업률 {publicData.openingRate}%</span>
                      <div className={styles.rateBarTrack}>
                        <div className={styles.rateBarFill} style={{ width: `${(publicData.openingRate / 20) * 100}%`, backgroundColor: "var(--primary)" }} />
                      </div>
                    </div>
                    <div className={styles.rateCol}>
                      <span style={{ color: "var(--hot)", fontWeight: 700 }}>폐업률 {publicData.closingRate}%</span>
                      <div className={styles.rateBarTrack}>
                        <div className={styles.rateBarFill} style={{ width: `${(publicData.closingRate / 20) * 100}%`, backgroundColor: "var(--hot)" }} />
                      </div>
                    </div>
                  </div>
                  <span className={styles.publicMetricFootnote}>최근 3개월 내 신규 인허가 점포 및 폐업 신고율</span>
                </div>

                {/* 3년 생존율 */}
                <div className={styles.publicMetricBlock} style={{ paddingLeft: "1.5rem" }}>
                  <span className={styles.publicMetricLabel}>3개년 F&B 점포 생존율</span>
                  <div className={styles.survivalValueRow}>
                    <span className={styles.survivalValue} style={{ color: publicData.threeYearSurvivalRate >= 50 ? "var(--stable)" : "var(--rising)" }}>
                      {publicData.threeYearSurvivalRate}%
                    </span>
                    <div className={styles.survivalGaugeBar}>
                      <div 
                        className={styles.survivalGaugeFill} 
                        style={{ 
                          width: `${publicData.threeYearSurvivalRate}%`, 
                          backgroundColor: publicData.threeYearSurvivalRate >= 50 ? "var(--stable)" : "var(--rising)" 
                        }} 
                      />
                    </div>
                  </div>
                  <span className={styles.publicMetricFootnote}>해당 상권 내 외식업소의 3년차 영업 유지 비중</span>
                </div>
              </div>
              
              <div className={styles.publicSourceText}>
                ℹ️ {publicData.source}
              </div>
            </div>
          </section>
        )}

        {/* 3층: 뜨는 업종 TOP5 & 주요 채널 */}
        <section className={styles.midRow}>
          {/* 뜨는 업종 카드 */}
          <div className="glass-card">
            <h2 className={styles.sectionTitle} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
              <TrendingUp size={18} color="var(--primary)" />
              <span>유튜브 언급 상권 상승 카테고리 TOP 5</span>
            </h2>
            <div className={styles.categoryList}>
              {youtube.risingCategories.map((item, index) => (
                <div key={index} className={styles.categoryItem}>
                  <div className={styles.categoryMeta}>
                    <span className={styles.categoryName}>{index + 1}. {item.category}</span>
                    <span className={styles.categoryStat}>{item.count}개 영상 ({item.percentage}%)</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 주요 영향력 채널 카드 */}
          <div className="glass-card">
            <h2 className={styles.sectionTitle} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
              <Users size={18} color="var(--primary)" />
              <span>동네 바이럴 주도 핵심 인플루언서</span>
            </h2>
            <div className={styles.channelList}>
              {youtube.topChannels.map((chan, index) => (
                <div key={index} className={styles.channelItem}>
                  <div className={styles.channelInfo}>
                    <span className={styles.channelName}>{chan.name}</span>
                    <span className={styles.channelCount}>최근 언급 영상 수: {chan.count}개</span>
                  </div>
                  <div className={styles.channelRating}>
                    <span>영향력 지수 {chan.subscriberRating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4층: 유튜브 포착 핵심 영상 리스트 */}
        <section className={styles.videosSection}>
          <h2 className={styles.sectionTitle}>
            <Play size={18} color="var(--primary)" />
            <span>상권 온도 산출에 반영된 유튜브 소스 비디오</span>
          </h2>
          
          <div className={styles.videosGrid}>
            {youtube.videos.map((vid) => (
              <a 
                key={vid.id} 
                href={vid.videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${styles.videoCard} glass-card`}
              >
                <div className={styles.thumbnailWrapper}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={vid.thumbnailUrl} 
                    alt={vid.title} 
                    className={styles.thumbnail}
                  />
                  <div className={styles.videoDuration}>LIVE</div>
                </div>
                <div className={styles.videoBody}>
                  <h3 className={styles.videoTitle}>{vid.title}</h3>
                  <div className={styles.videoMeta}>
                    <span>{vid.channelTitle}</span>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.15rem" }}>
                        <Eye size={12} />
                        {formatNumber(vid.viewCount)}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.15rem" }}>
                        <Calendar size={12} />
                        {formatDate(vid.publishedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* 비교 분석 모달창 */}
      {isCompareOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} glass-card`}>
            <button className={styles.closeBtn} onClick={() => setIsCompareOpen(false)}>
              <X size={22} />
            </button>
            
            <h2 className={styles.modalTitle}>📊 상권 비교 분석 대시보드</h2>

            {/* 비교 입력창 */}
            <form onSubmit={handleCompareSubmit} className={styles.compareInputSection}>
              <input
                type="text"
                placeholder="비교할 다른 동네명을 입력하세요 (예: 성수동)"
                value={compareDistrict}
                onChange={(e) => setCompareDistrict(e.target.value)}
                className={styles.compareInput}
              />
              <button type="submit" className={styles.compareBtn}>
                <span>상대 대조 스캔</span>
              </button>
            </form>

            {compareError && (
              <div style={{ color: "var(--hot)", fontSize: "0.85rem", marginBottom: "1rem" }}>
                ⚠️ {compareError}
              </div>
            )}

            {compareLoading && (
              <div className={styles.compareLoading}>
                <div className="radarPulse" style={{ width: "40px", height: "40px", border: "2px dashed var(--primary)" }}></div>
                <span>비교 대상 상권을 분석 데이터 레이징 중...</span>
              </div>
            )}

            {/* 비교 분석 대조표 */}
            {compareData && (
              <div className={styles.compareTableWrapper}>
                <table className={styles.compareTable}>
                  <thead>
                    <tr>
                      <th className={styles.rowHeader}>비교 카테고리</th>
                      <th className={styles.colDistrict} style={{ color: "var(--primary)" }}>{districtName} (기준)</th>
                      <th className={styles.colDistrict} style={{ color: "#a78bfa" }}>{compareData.district} (대조)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={styles.rowHeader}>상권 온도 지수</td>
                      <td className={styles.colScore} style={{ color: radar.statusColor }}>{radar.score}℃</td>
                      <td className={styles.colScore} style={{ color: compareData.radar.statusColor }}>{compareData.radar.score}℃</td>
                    </tr>
                    <tr>
                      <td className={styles.rowHeader}>온도 상태 해석</td>
                      <td style={{ color: radar.statusColor, fontWeight: 700 }}>{radar.statusText}</td>
                      <td style={{ color: compareData.radar.statusColor, fontWeight: 700 }}>{compareData.radar.statusText}</td>
                    </tr>
                    <tr>
                      <td className={styles.rowHeader}>최근 영상 게시수</td>
                      <td>{youtube.videoCount}개</td>
                      <td>{compareData.youtube.videoCount}개</td>
                    </tr>
                    <tr>
                      <td className={styles.rowHeader}>전월대비 조회 증가</td>
                      <td style={{ color: youtube.viewCountGrowth >= 0 ? "var(--hot)" : "var(--cooling)", fontWeight: 600 }}>
                        {youtube.viewCountGrowth >= 0 ? "+" : ""}{youtube.viewCountGrowth}%
                      </td>
                      <td style={{ color: compareData.youtube.viewCountGrowth >= 0 ? "var(--hot)" : "var(--cooling)", fontWeight: 600 }}>
                        {compareData.youtube.viewCountGrowth >= 0 ? "+" : ""}{compareData.youtube.viewCountGrowth}%
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.rowHeader}>핵심 상승 업종</td>
                      <td>{youtube.risingCategories[0]?.category} ({youtube.risingCategories[0]?.percentage}%)</td>
                      <td>{compareData.youtube.risingCategories[0]?.category} ({compareData.youtube.risingCategories[0]?.percentage}%)</td>
                    </tr>
                    {publicData && compareData.public && (
                      <>
                        <tr>
                          <td className={styles.rowHeader}>월평균 F&B 매출</td>
                          <td style={{ fontWeight: 700 }}>{(publicData.averageMonthlySales / 10000).toFixed(0)}만 원</td>
                          <td style={{ fontWeight: 700 }}>{(compareData.public.averageMonthlySales / 10000).toFixed(0)}만 원</td>
                        </tr>
                        <tr>
                          <td className={styles.rowHeader}>분기 개업률 / 폐업률</td>
                          <td>개업: {publicData.openingRate}% / 폐업: {publicData.closingRate}%</td>
                          <td>개업: {compareData.public.openingRate}% / 폐업: {compareData.public.closingRate}%</td>
                        </tr>
                        <tr>
                          <td className={styles.rowHeader}>3년 평균 생존율</td>
                          <td>{publicData.threeYearSurvivalRate}%</td>
                          <td>{compareData.public.threeYearSurvivalRate}%</td>
                        </tr>
                      </>
                    )}
                    <tr>
                      <td className={styles.rowHeader}>AI 기회 요인(Pros)</td>
                      <td>
                        <ul className={styles.compList}>
                          {ai.pros.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      </td>
                      <td>
                        <ul className={styles.compList}>
                          {compareData.ai.pros.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.rowHeader}>AI 리스크(Cons)</td>
                      <td>
                        <ul className={styles.compList}>
                          {ai.cons.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      </td>
                      <td>
                        <ul className={styles.compList}>
                          {compareData.ai.cons.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.rowHeader}>AI 추천 창업 전략</td>
                      <td style={{ fontSize: "0.8rem", color: "#d4d4d8", lineHeight: 1.5 }}>{ai.recommendation}</td>
                      <td style={{ fontSize: "0.8rem", color: "#d4d4d8", lineHeight: 1.5 }}>{compareData.ai.recommendation}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Suspense 에러 방지를 위한 래퍼 컴포넌트
export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginTop: "10vh" }}>
            <p style={{ color: "#a1a1aa", fontSize: "0.95rem" }}>상권 리포트 모듈 로딩 중...</p>
          </div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
