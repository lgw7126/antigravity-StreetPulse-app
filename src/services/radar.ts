export interface RadarMetrics {
  videoCount: number;         // 최근 1개월 영상 수
  viewCountGrowth: number;    // 전월 대비 조회수 증가율 (%)
  newChannelsCount: number;   // 신규 언급 채널 수
}

export type RadarStatus = 'HOT' | 'RISING' | 'STABLE' | 'COOLING' | 'COLD';

export interface RadarReport {
  score: number;
  status: RadarStatus;
  statusText: string;
  statusColor: string;
  statusDescription: string;
  metrics: {
    volume: { value: number; score: number; contribution: number };
    momentum: { value: number; score: number; contribution: number };
    diffusion: { value: number; score: number; contribution: number };
  };
}

/**
 * 상권 온도 계산기
 * 공식: 상권 온도 = (최근 1개월 영상 수 가중치 30%) + (조회수 증가율 가중치 50%) + (신규 채널 언급 수 가중치 20%)
 */
export function calculateRadarTemperature(metrics: RadarMetrics): RadarReport {
  // 1. 볼륨 신호 (최대 50개 영상을 100점으로 정규화)
  const volumeScore = Math.min((metrics.videoCount / 50) * 100, 100);
  const volumeContrib = volumeScore * 0.3;

  // 2. 모멘텀 신호 (조회수 증가율: -50% ~ +100% 범위를 0 ~ 100점으로 정규화)
  // -50% 이하는 0점, 100% 이상은 100점, 0%는 50점
  let momentumScore = 50;
  if (metrics.viewCountGrowth >= 100) {
    momentumScore = 100;
  } else if (metrics.viewCountGrowth <= -50) {
    momentumScore = 0;
  } else {
    // 선형 변환
    momentumScore = ((metrics.viewCountGrowth + 50) / 150) * 100;
  }
  const momentumContrib = momentumScore * 0.5;

  // 3. 확산 신호 (신규 채널 수: 최대 10개 채널을 100점으로 정규화)
  const diffusionScore = Math.min((metrics.newChannelsCount / 10) * 100, 100);
  const diffusionContrib = diffusionScore * 0.2;

  // 최종 온도 계산 (반올림)
  const rawScore = volumeContrib + momentumContrib + diffusionContrib;
  const score = Math.round(Math.max(0, Math.min(rawScore, 100)));

  // 상권 등급 해석
  let status: RadarStatus = 'STABLE';
  let statusText = '안정기';
  let statusColor = '#EAB308'; // yellow
  let statusDescription = '안정적인 상권입니다. 검증된 곳이지만 경쟁이 심할 수 있습니다.';

  if (score >= 80) {
    status = 'HOT';
    statusText = '🔥 HOT (활성)';
    statusColor = '#EF4444'; // red
    statusDescription = '폭발적으로 언급량이 증가하고 있습니다. 창업 진입 직전의 최적 타이밍입니다.';
  } else if (score >= 60) {
    status = 'RISING';
    statusText = '📈 RISING (상승)';
    statusColor = '#F97316'; // orange
    statusDescription = '꾸준히 상승세를 타고 있습니다. 과열되기 전 창업 적기입니다.';
  } else if (score >= 40) {
    status = 'STABLE';
    statusText = '⚖️ STABLE (안정)';
    statusColor = '#10B981'; // emerald green
    statusDescription = '안정적인 상권입니다. 검증된 상태이나 신규 진입 시 철저한 차별화가 필요합니다.';
  } else if (score >= 20) {
    status = 'COOLING';
    statusText = '📉 COOLING (정체)';
    statusColor = '#3B82F6'; // blue
    statusDescription = '소비자 관심이 감소하는 추세입니다. 기존 사업자는 리포지셔닝을 고려해야 합니다.';
  } else {
    status = 'COLD';
    statusText = '❄️ COLD (침체)';
    statusColor = '#6B7280'; // gray
    statusDescription = '유튜브 언급이 매우 저조합니다. 신규 진입 시 리스크가 매우 높은 지역입니다.';
  }

  return {
    score,
    status,
    statusText,
    statusColor,
    statusDescription,
    metrics: {
      volume: {
        value: metrics.videoCount,
        score: Math.round(volumeScore),
        contribution: Math.round(volumeContrib * 10) / 10
      },
      momentum: {
        value: metrics.viewCountGrowth,
        score: Math.round(momentumScore),
        contribution: Math.round(momentumContrib * 10) / 10
      },
      diffusion: {
        value: metrics.newChannelsCount,
        score: Math.round(diffusionScore),
        contribution: Math.round(diffusionContrib * 10) / 10
      }
    }
  };
}
