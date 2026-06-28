import { RadarReport } from "./radar";
import { YouTubeAnalysisResult } from "./youtube";

export interface ClaudeReportResult {
  summary: string;     // AI 총평 요약
  pros: string[];      // 강점 / 기회 요인 3가지
  cons: string[];      // 약점 / 위협 요인 3가지
  recommendation: string; // 창업/경영 전략 제안
}

// Claude API 호출 혹은 Mock 보고서 생성 함수
export async function generateClaudeReport(
  districtName: string,
  radar: RadarReport,
  youtube: YouTubeAnalysisResult
): Promise<ClaudeReportResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey) {
    try {
      const topCatText = youtube.risingCategories.map(c => `${c.category}(${c.percentage}%)`).join(", ");
      const systemPrompt = "너는 상업용 부동산 분석 전문가이자 전문 창업 컨설턴트인 '골목 레이더 AI'이다. 유튜브 데이터 통계를 바탕으로 해당 상권의 특징, 장단점, 창업 전략을 명확하고 신뢰성 있게 설명해야 한다.";
      
      const userPrompt = `
지역명: ${districtName}
상권 온도 점수: ${radar.score}/100 (${radar.statusText} 단계)
최근 1개월 유튜브 영상 수: ${youtube.videoCount}개 (전월 대비 조회수 증가율: ${youtube.viewCountGrowth}%)
신규 유입 채널 수: ${youtube.newChannelsCount}개
주요 강세 업종 트렌드: ${topCatText}

위 데이터를 분석하여 JSON 형식으로만 응답해라. 마크다운 기호(\`\`\`json) 없이 순수 JSON 중괄호로만 반환해야 한다.
JSON 필드 구조는 다음과 같다:
{
  "summary": "상권의 현재 분위기와 유튜브 관심도를 요약한 한 문단 총평 (한글 200자 내외)",
  "pros": ["강점 및 기회 요인 1", "강점 및 기회 요인 2", "강점 및 기회 요인 3"],
  "cons": ["약점 및 위협 요인 1", "약점 및 위협 요인 2", "약점 및 위협 요인 3"],
  "recommendation": "이 상권에 진입하려는 예비 창업자나 기존 자영업자를 위한 핵심 업종 제안 및 실행 전략 (한글 150자 내외)"
}
`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 800,
          messages: [{ role: "user", content: userPrompt }],
          system: systemPrompt,
          temperature: 0.2
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }

      const responseData = await response.json();
      const text = responseData.content?.[0]?.text || "";
      
      // JSON 파싱 시도
      try {
        const parsed: ClaudeReportResult = JSON.parse(text.trim());
        if (parsed.summary && parsed.pros && parsed.cons && parsed.recommendation) {
          return parsed;
        }
      } catch (err) {
        console.warn("Claude API 응답 파싱 실패, 정규식으로 복구 시도:", err);
        // JSON 파싱이 안 되었을 때를 위한 백업 파싱 로직
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed: ClaudeReportResult = JSON.parse(match[0]);
          return parsed;
        }
      }

    } catch (e) {
      console.error("Claude API 호출 에러 발생, Mock AI 리포트로 전환합니다:", e);
    }
  }

  // API 키가 없거나 에러 시 고품질의 동적 Mock 리포트 리턴
  // 1초 인위적인 딜레이를 주어 AI 연산 효과 극대화
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const mainCategory = youtube.risingCategories[0]?.category || "베이커리/디저트";
  
  if (radar.score >= 80) {
    // HOT 상권
    return {
      summary: `${districtName} 상권은 최근 유튜브 조회수가 폭증하며 전국에서 가장 주목받는 '초고열 상권'으로 등극했습니다. 특히 인플루언서 채널들이 앞다투어 신규 핫플레이스를 다루며 젊은 층의 유입량이 수직 상승 중입니다.`,
      pros: [
        "유튜브 및 SNS 바이럴 효과 극대화로 초기 고객 유치 용이",
        "트렌드에 민감한 2030 유동 인구의 압도적인 비중",
        "신규 유입 채널의 지속적인 증가로 상권 홍보 지속성 확보"
      ],
      cons: [
        "상권 인지도 급상승에 따른 급격한 임대료 상승(젠트리피케이션) 리스크",
        "동종 업계의 과도한 경쟁 및 유행 주기가 매우 짧음",
        "피크타임 대기 수요 분산으로 인한 단골 고객 확보의 어려움"
      ],
      recommendation: `강세를 띠고 있는 [${mainCategory}] 분야로 진입하되, 단순 모방이 아닌 독창적인 비주얼 요소와 한정판 메뉴 전략이 필수적입니다. 임대료 부담이 높은 메인 거리보다는 이면 도로(골목 깊은 곳)를 공략하는 '목적형 매장' 창업을 적극 권장합니다.`
    };
  } else if (radar.score >= 60) {
    // RISING 상권
    return {
      summary: `${districtName} 상권은 대형 인플루언서 노출을 기점으로 꾸준한 상승 곡선을 그리고 있는 '성장형 상권'입니다. 아직 임대료 과열 단계는 아니지만, 점진적으로 유동 인구와 소비 규모가 확장되고 있습니다.`,
      pros: [
        "성장 초입 단계로 상대적으로 합리적인 보증금 및 권리금 수준",
        "꾸준히 유입되는 신규 채널 및 언급량으로 인한 인지도 우상향",
        "고정 단골 고객층과 외지 방문객의 균형 잡힌 배합 가능"
      ],
      cons: [
        "상권 성숙도가 다소 미흡하여 평일과 주말의 매출 격차 존재 가능",
        "프랜차이즈 및 경쟁 업종이 슬슬 진입 준비를 마친 상태",
        "대중교통 접근성이 다소 아쉽거나 주차 공간 확보가 어려움"
      ],
      recommendation: `상승 흐름을 타고 있는 [${mainCategory}] 관련 트렌디한 감성의 숍 브랜딩을 시도하기에 최고의 타이밍입니다. 인접 유명 상권의 유입 경로 상에 입점하여 낙수 효과를 노리고, 평일 직장인 혹은 거주민을 잡을 수 있는 서브 메뉴 개발을 곁들여 리스크를 낮추십시오.`
    };
  } else if (radar.score >= 40) {
    // STABLE 상권
    return {
      summary: `${districtName} 상권은 오랫동안 자리를 지켜온 탄탄한 기본 수요 기반의 '안정형 상권'입니다. 급격한 유튜브 조회수 증가나 폭발적인 신규 유입은 없지만, 충성도 높은 단골 고객층을 기반으로 매출 변동 폭이 적습니다.`,
      pros: [
        "계절이나 유행 타지 않는 안정적이고 검증된 소비 매출 기대",
        "오피스 상권 혹은 배후 주거지가 튼튼해 평일 매출 방어가 우수",
        "소셜 미디어 유행이 꺾여도 큰 타격을 받지 않는 묵직한 상권 체력"
      ],
      cons: [
        "기존 선점 업체들의 텃세와 높은 권리금 진입 장벽",
        "신규 인플루언서들이 노출을 유도할 만한 새로운 화제성 결여",
        "혁신적인 시도보다는 기존 틀에 갇히기 쉬운 보수적 상권 분위기"
      ],
      recommendation: `신규 창업의 경우, 이미 포화 상태인 전통 업종보다는 레트로 감성이나 이색 콜라보레이션 등 '을지로식 힙플레이스' 요소를 가미해야 승산이 있습니다. 홍보 방식 역시 정밀한 로컬 타겟 마케팅(네이버 스마트플레이스, 동네 광고)에 무게를 두는 것이 현명합니다.`
    };
  } else if (radar.score >= 20) {
    // COOLING 상권
    return {
      summary: `${districtName} 상권은 한때 뜨거웠던 미디어 노출 및 관심도가 점차 가라앉는 '정체/감퇴 상권'입니다. 유입 인구보다는 이탈 인구가 늘어나기 시작했으며, 유튜브 언급량 또한 하향 안정 추세를 보입니다.`,
      pros: [
        "높았던 권리금과 보증금이 점차 조정을 받으며 협상력 우위 확보 가능",
        "오랫동안 영업하며 지역 주민들에게 각인된 인지도를 가진 브랜드 매장들 잔존",
        "복잡함에서 벗어나 고즈넉하고 여유로운 분위기를 선호하는 틈새 수요"
      ],
      cons: [
        "주요 소비층의 타 지역 이탈로 상권 내 전반적인 객단가 감소",
        "신규 채널 유입의 급감으로 인한 자생적 온라인 홍보 기회 상실",
        "임대 문의 현수막이 늘어나는 등 상권 침체 징후 포착"
      ],
      recommendation: `이 상권에서의 신규 창업은 매우 신중하게 접근해야 합니다. 오프라인 집객에만 의존하는 업종은 피하고, 전국 배송이 가능한 [${mainCategory}] 택배 비즈니스나 스마트 스토어 판매 등 온라인 거점을 병행하는 전략이 필수적입니다. 보증금 협상 시 렌트프리 혜택을 유도하십시오.`
    };
  } else {
    // COLD 상권
    return {
      summary: `${districtName} 상권은 유튜브 등 온라인상에서 바이럴 언급을 거의 찾을 수 없는 '침체/미발달 상권'입니다. 대중적인 관심과 젊은 유동인구 유입이 단절되어 창업 시 리스크가 다소 높습니다.`,
      pros: [
        "매우 저렴한 월세 및 권리금 제로 형태의 부담 없는 초기 투자 비용",
        "독점적 입지를 구축할 경우 근거리 배후 수요를 완전히 독차지할 가능성",
        "관리가 수월하고 고정 운영비 절감에 용이"
      ],
      cons: [
        "인구 밀집도가 낮고 외부 방문객 유인 요소가 거의 없음",
        "온라인 노출을 하더라도 지역적 한계 때문에 매장 방문까지 유도가 어려움",
        "신규 매장 홍보를 위해 더 많은 로컬 마케팅 리소스가 소모됨"
      ],
      recommendation: `유튜브 등의 선행 지표가 완전히 침묵하고 있으므로, 트렌디한 F&B보다는 지역 밀착형 생활 밀착 업종(세탁, 반찬가게, 배달전문점 등) 위주로 초점을 맞추는 것이 맞습니다. 임대차 계약 조건은 최소화하고 고정 인건비가 나가지 않는 1인 운영 체제에 적합합니다.`
    };
  }
}
