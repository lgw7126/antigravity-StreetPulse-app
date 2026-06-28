import { NextRequest, NextResponse } from "next/server";
import { analyzeYouTubeData } from "@/services/youtube";
import { calculateRadarTemperature } from "@/services/radar";
import { generateClaudeReport } from "@/services/claude";
import { getPublicCommercialData } from "@/services/publicData";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const district = searchParams.get("district");

  if (!district) {
    return NextResponse.json(
      { error: "동네 이름(district)이 필요합니다." },
      { status: 400 }
    );
  }

  // 1. 요청 수신 및 환경 변수 디버그 로그 출력
  console.log("\n==================================================");
  console.log(`[📡 골목 레이더 API] 분석 요청 수신: "${district}"`);
  console.log(`[디버그 - 환경 변수 로드 검증]`);
  console.log(`- YOUTUBE_API_KEY: ${process.env.YOUTUBE_API_KEY ? `✅ 로드됨 (길이: ${process.env.YOUTUBE_API_KEY.length}자)` : "❌ 누락됨 (Mock 모드 실행)"}`);
  console.log(`- ANTHROPIC_API_KEY: ${process.env.ANTHROPIC_API_KEY ? `✅ 로드됨 (길이: ${process.env.ANTHROPIC_API_KEY.length}자)` : "❌ 누락됨 (Mock 모드 실행)"}`);
  console.log("--------------------------------------------------");

  try {
    // 2. YouTube 데이터 수집 및 가공
    const ytStartTime = Date.now();
    const youtubeResult = await analyzeYouTubeData(district);
    const ytElapsed = Date.now() - ytStartTime;
    console.log(`[로그 - YouTube API 호출 완료]`);
    console.log(`- 소요 시간: ${ytElapsed}ms`);
    console.log(`- 영상 개수: ${youtubeResult.videoCount}개 (전월비 성장률: ${youtubeResult.viewCountGrowth}%)`);
    console.log(`- 총 조회수: ${youtubeResult.totalViewCount.toLocaleString()}회`);
    console.log(`- 신규 창작자 채널 유입수: ${youtubeResult.newChannelsCount}개`);
    console.log("--------------------------------------------------");

    // 3. 상권 온도 계산
    const radarReport = calculateRadarTemperature({
      videoCount: youtubeResult.videoCount,
      viewCountGrowth: youtubeResult.viewCountGrowth,
      newChannelsCount: youtubeResult.newChannelsCount
    });
    console.log(`[로그 - 상권 온도 지수 연산 완료]`);
    console.log(`- 최종 온도: ${radarReport.score}℃`);
    console.log(`- 상태 등급: ${radarReport.statusText}`);
    console.log(`- 등급 설명: ${radarReport.statusDescription}`);
    console.log("--------------------------------------------------");

    // 4. Claude AI 리포트 생성
    const aiStartTime = Date.now();
    const aiReport = await generateClaudeReport(district, radarReport, youtubeResult);
    const aiElapsed = Date.now() - aiStartTime;
    console.log(`[로그 - Claude AI 분석 리포트 생성 완료]`);
    console.log(`- 소요 시간: ${aiElapsed}ms`);
    console.log(`- 요약 글자수: ${aiReport.summary.length}자`);
    console.log(`- 추천 업종 전략: ${aiReport.recommendation}`);
    console.log("--------------------------------------------------");

    // 5. 공공 상권 데이터 대조군 조회
    const pbStartTime = Date.now();
    const publicData = getPublicCommercialData(district, radarReport.score);
    console.log(`[로그 - 공공 상권 데이터 대조군 조회 완료]`);
    console.log(`- 소요 시간: ${Date.now() - pbStartTime}ms`);
    console.log(`- 월평균 F&B 매출: ${(publicData.averageMonthlySales / 10000).toFixed(0)}만 원`);
    console.log(`- 분기 개업률: ${publicData.openingRate}% vs 폐업률: ${publicData.closingRate}%`);
    console.log(`- 3개년 점포 생존율: ${publicData.threeYearSurvivalRate}%`);
    console.log("==================================================");
    console.log(`[📡 분석 완수] 전체 분석 소요 시간: ${Date.now() - startTime}ms\n`);

    // 6. 통합 결과 리턴
    return NextResponse.json({
      success: true,
      district,
      radar: radarReport,
      youtube: youtubeResult,
      ai: aiReport,
      public: publicData, // 공공 데이터 병합
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("\n[❌ API Route Error 발생]:", error);
    console.log("==================================================\n");
    return NextResponse.json(
      { success: false, error: error.message || "상권을 분석하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
