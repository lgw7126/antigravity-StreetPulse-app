"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Flame, TrendingUp, Compass, ArrowRight, BarChart3, MessageSquare, Zap } from "lucide-react";
import styles from "./page.module.css";

interface TrendingDistrict {
  name: string;
  temp: number;
  status: "HOT" | "RISING" | "STABLE";
  statusText: string;
}

const TRENDING_LIST: TrendingDistrict[] = [
  { name: "성수동", temp: 92, status: "HOT", statusText: "HOT 🔥" },
  { name: "망원동", temp: 73, status: "RISING", statusText: "RISING 📈" },
  { name: "을지로", temp: 51, status: "STABLE", statusText: "STABLE ⚖️" },
  { name: "익선동", temp: 79, status: "RISING", statusText: "RISING 📈" },
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/analyze?district=${encodeURIComponent(query.trim())}`);
  };

  const handleChipClick = (districtName: string) => {
    router.push(`/analyze?district=${encodeURIComponent(districtName)}`);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* 헤더 히어로 영역 */}
        <section className={styles.hero}>
          <div className={styles.radarIconContainer}>
            <div className={styles.radarPulse}></div>
            <div className={styles.radarPulseSecond}></div>
            <Compass size={38} color="#8b5cf6" style={{ transform: "rotate(15deg)" }} />
          </div>
          <h1 className={styles.title}>골목 레이더</h1>
          <p className={styles.subtitle}>
            유튜브 데이터와 Claude AI가 실시간으로 분석하는 우리 동네 상권 실시간 온도 지도
          </p>
        </section>

        {/* 검색 폼 */}
        <section className={styles.searchBox}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="관심 상권이나 동네명을 입력하세요 (예: 성수동, 망원동)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={styles.input}
              />
              <Search className={styles.inputIcon} size={20} />
            </div>
            <button type="submit" className={styles.submitBtn}>
              <span>레이더 가동</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </section>

        {/* 인기 상권 리스트 */}
        <section className={styles.trending}>
          <h2 className={styles.trendingTitle}>
            <Flame size={16} color="#ef4444" />
            <span>실시간 감지 트렌딩 상권</span>
          </h2>
          <div className={styles.trendingList}>
            {TRENDING_LIST.map((item, index) => (
              <button
                key={index}
                onClick={() => handleChipClick(item.name)}
                className={styles.trendChip}
              >
                <span className={styles.trendName}>{item.name}</span>
                <span className={`${styles.trendMeta} ${
                  item.status === "HOT" ? styles.tagHot : item.status === "RISING" ? styles.tagRising : styles.tagStable
                }`}>
                  {item.statusText} • {item.temp}°C
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 기능 특징 소개 */}
        <section className={styles.features}>
          <div className={`${styles.featureCard} glass-card`}>
            <div className={styles.featureIcon}>
              <BarChart3 size={20} />
            </div>
            <h3>유튜브 시그널 분석</h3>
            <p>언급 비디오 볼륨, 전월 대비 조회수 증가율, 언급 채널 다변화를 종합하여 상권의 선행 온도를 계산합니다.</p>
          </div>
          
          <div className={`${styles.featureCard} glass-card`}>
            <div className={styles.featureIcon}>
              <MessageSquare size={20} />
            </div>
            <h3>Claude AI 상권 리포트</h3>
            <p>유튜브 반응을 바탕으로 해당 골목의 강약점을 추출하여 리스크 극복 전략과 맞춤 업종을 추천합니다.</p>
          </div>

          <div className={`${styles.featureCard} glass-card`}>
            <div className={styles.featureIcon}>
              <Zap size={20} />
            </div>
            <h3>실시간 온도 등급</h3>
            <p>0~100 스케일의 지수를 기반으로 HOT, RISING, STABLE, COOLING, COLD 5단계 해석을 제공합니다.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
