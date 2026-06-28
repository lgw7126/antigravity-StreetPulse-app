export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: number;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface YouTubeAnalysisResult {
  videos: YouTubeVideo[];
  videoCount: number;
  viewCountGrowth: number;    // 전월 대비 조회수 증가율 (%)
  newChannelsCount: number;   // 신규 언급 채널 수
  totalViewCount: number;
  topChannels: Array<{ name: string; count: number; subscriberRating: number }>;
  risingCategories: Array<{ category: string; count: number; percentage: number }>;
}

// 인기 지역에 대한 미리 정의된 정교한 Mock 데이터베이스
const MOCK_DISTRICTS: Record<string, Partial<YouTubeAnalysisResult>> = {
  "성수동": {
    videoCount: 48,
    viewCountGrowth: 78.4,
    newChannelsCount: 9,
    totalViewCount: 2450000,
    topChannels: [
      { name: "맛상무", count: 8, subscriberRating: 9.2 },
      { name: "서울맛집 투어", count: 6, subscriberRating: 7.8 },
      { name: "부동산 읽어주는 남자", count: 4, subscriberRating: 8.5 },
      { name: "카페로드 CafeRoad", count: 4, subscriberRating: 6.9 },
      { name: "트렌드서칭", count: 3, subscriberRating: 8.0 }
    ],
    risingCategories: [
      { category: "팝업스토어/전시", count: 18, percentage: 38 },
      { category: "베이커리/디저트 카페", count: 14, percentage: 29 },
      { category: "편집숍/패션 쇼룸", count: 8, percentage: 17 },
      { category: "퓨전 일식/다이닝", count: 5, percentage: 10 },
      { category: "기타", count: 3, percentage: 6 }
    ],
    videos: [
      {
        id: "ss_vid_1",
        title: "[성수동 핫플] 주말에 무조건 웨이팅 서야 하는 성수동 팝업스토어 TOP5 완벽 정리!",
        channelTitle: "트렌드서칭",
        publishedAt: "2026-06-20T10:00:00Z",
        viewCount: 154000,
        thumbnailUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80",
        videoUrl: "https://www.youtube.com/watch?v=mock_ss1"
      },
      {
        id: "ss_vid_2",
        title: "지금 성수동에서 가장 핫한 디저트 카페! 크루아상 맛집 솔직 후기 🥐",
        channelTitle: "카페로드 CafeRoad",
        publishedAt: "2026-06-15T09:00:00Z",
        viewCount: 89000,
        thumbnailUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80",
        videoUrl: "https://www.youtube.com/watch?v=mock_ss2"
      },
      {
        id: "ss_vid_3",
        title: "성수동 골목길 상권 분석: 팝업스토어가 만드는 거대한 임대료 상승과 미래는?",
        channelTitle: "부동산 읽어주는 남자",
        publishedAt: "2026-06-10T12:00:00Z",
        viewCount: 220000,
        thumbnailUrl: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=300&q=80",
        videoUrl: "https://www.youtube.com/watch?v=mock_ss3"
      },
      {
        id: "ss_vid_4",
        title: "조용히 소문난 성수 퓨전 일식 맛집, 웨이팅 없이 먹는 꿀팁 전수합니다",
        channelTitle: "서울맛집 투어",
        publishedAt: "2026-06-05T18:30:00Z",
        viewCount: 45000,
        thumbnailUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=300&q=80",
        videoUrl: "https://www.youtube.com/watch?v=mock_ss4"
      }
    ]
  },
  "망원동": {
    videoCount: 32,
    viewCountGrowth: 41.2,
    newChannelsCount: 5,
    totalViewCount: 980000,
    topChannels: [
      { name: "망원동 주민", count: 7, subscriberRating: 6.2 },
      { name: "하루한끼 맛슐랭", count: 5, subscriberRating: 8.0 },
      { name: "비건 라이프", count: 4, subscriberRating: 5.5 },
      { name: "디저트 사냥꾼", count: 3, subscriberRating: 7.1 }
    ],
    risingCategories: [
      { category: "소품숍/잡화", count: 12, percentage: 38 },
      { category: "비건 푸드/친환경 레스토랑", count: 8, percentage: 25 },
      { category: "전통 시장 푸드/간식", count: 6, percentage: 19 },
      { category: "독립 서점/북카페", count: 4, percentage: 12 },
      { category: "기타", count: 2, percentage: 6 }
    ],
    videos: [
      {
        id: "mw_vid_1",
        title: "망원시장 먹거리 정복기! 닭강정부터 고추튀김까지 배 터지게 먹는 날 🤤",
        channelTitle: "하루한끼 맛슐랭",
        publishedAt: "2026-06-22T08:00:00Z",
        viewCount: 112000,
        thumbnailUrl: "https://images.unsplash.com/photo-1563379971899-660589a01cd3?auto=format&fit=crop&w=300&q=80",
        videoUrl: "https://www.youtube.com/watch?v=mock_mw1"
      },
      {
        id: "mw_vid_2",
        title: "소품숍 좋아하는 사람 주목! 망원동 감성 가득한 문구/소품숍 투어 코스 추천",
        channelTitle: "망원동 주민",
        publishedAt: "2026-06-18T10:30:00Z",
        viewCount: 54000,
        thumbnailUrl: "https://images.unsplash.com/photo-1459257831348-f9323e4400b6?auto=format&fit=crop&w=300&q=80",
        videoUrl: "https://www.youtube.com/watch?v=mock_mw2"
      },
      {
        id: "mw_vid_3",
        title: "비건도 맛있게! 망원동에서 난리 난 글루텐프리 쌀 베이커리 빵지순례",
        channelTitle: "비건 라이프",
        publishedAt: "2026-06-12T15:00:00Z",
        viewCount: 32000,
        thumbnailUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80",
        videoUrl: "https://www.youtube.com/watch?v=mock_mw3"
      }
    ]
  },
  "을지로": {
    videoCount: 26,
    viewCountGrowth: -15.4, // 언급량이 살지 못하고 정체/쿨링 단계로 예상됨
    newChannelsCount: 2,
    totalViewCount: 650000,
    topChannels: [
      { name: "노포 사냥꾼", count: 8, subscriberRating: 7.9 },
      { name: "을지로 직장인", count: 5, subscriberRating: 5.2 },
      { name: "힙플레이스 탐험기", count: 3, subscriberRating: 6.8 }
    ],
    risingCategories: [
      { category: "노포/노가리 골목", count: 12, percentage: 46 },
      { category: "레트로 와인바/LP바", count: 6, percentage: 23 },
      { category: "에스프레소 바", count: 4, percentage: 15 },
      { category: "기타", count: 4, percentage: 16 }
    ],
    videos: [
      {
        id: "uj_vid_1",
        title: "아직도 핫할까? 힙지로 노가리 골목 야외 노포 감성 최근 분위기 공유",
        channelTitle: "노포 사냥꾼",
        publishedAt: "2026-06-25T17:00:00Z",
        viewCount: 42000,
        thumbnailUrl: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=300&q=80",
        videoUrl: "https://www.youtube.com/watch?v=mock_uj1"
      },
      {
        id: "uj_vid_2",
        title: "을지로 인쇄소 골목 3층 구석에 숨겨진 비밀스러운 LP바 솔직 탐방기 🎵",
        channelTitle: "힙플레이스 탐험기",
        publishedAt: "2026-06-14T11:00:00Z",
        viewCount: 28000,
        thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80",
        videoUrl: "https://www.youtube.com/watch?v=mock_uj2"
      }
    ]
  }
};

// YouTube API 연동 혹은 Mock 데이터 리턴 함수
export async function analyzeYouTubeData(districtName: string): Promise<YouTubeAnalysisResult> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (apiKey) {
    try {
      // 1. YouTube Data API v3 호출 수행
      // "districtName 맛집", "districtName 카페" 등의 검색어로 최근 3개월 데이터 쿼리
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const publishedAfter = threeMonthsAgo.toISOString();

      const searchQuery = encodeURIComponent(`${districtName} 맛집`);
      let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${searchQuery}&order=relevance&type=video&publishedAfter=${publishedAfter}&key=${apiKey}`;
      
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.statusText}`);
      }
      
      let data = await response.json();
      let items = data.items || [];

      // 만약 최근 3개월 데이터가 3개 미만으로 너무 적다면 필터를 최근 1년으로 확장하여 결과 노출 보장
      if (items.length < 3) {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const publishedAfter1Yr = oneYearAgo.toISOString();
        url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${searchQuery}&order=relevance&type=video&publishedAfter=${publishedAfter1Yr}&key=${apiKey}`;
        
        const backupResponse = await fetch(url);
        if (backupResponse.ok) {
          const backupData = await backupResponse.json();
          if (backupData.items && backupData.items.length > 0) {
            data = backupData;
            items = backupData.items;
          }
        }
      }
      
      // 영상 정보 매핑
      const videos: YouTubeVideo[] = items.map((item: any, index: number) => {
        const id = item.id.videoId;
        const snippet = item.snippet || {};
        return {
          id,
          title: snippet.title || "",
          channelTitle: snippet.channelTitle || "",
          publishedAt: snippet.publishedAt || new Date().toISOString(),
          viewCount: Math.round(150000 / (index + 1) + Math.random() * 20000), // 무료 검색 API는 조회수를 따로 받아야 하므로 모의 조회수 계산
          thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || "",
          videoUrl: `https://www.youtube.com/watch?v=${id}`
        };
      });

      // API를 성공적으로 받았을 때, 일부 데이터 통계 수치 시뮬레이션
      const videoCount = Math.max(5, Math.round(10 + Math.random() * 30));
      const viewCountGrowth = Math.round((Math.random() * 150 - 40) * 10) / 10;
      const newChannelsCount = Math.max(1, Math.round(1 + Math.random() * 8));
      const totalViewCount = videos.reduce((acc, v) => acc + v.viewCount, 0);

      // 리스트 가공
      const uniqueChannels = Array.from(new Set(videos.map(v => v.channelTitle)));
      const topChannels = uniqueChannels.slice(0, 4).map((name, idx) => ({
        name,
        count: Math.max(1, Math.round(3 - idx + Math.random())),
        subscriberRating: Math.round((6 + Math.random() * 3.5) * 10) / 10
      }));

      const risingCategories = [
        { category: "베이커리/디저트", count: Math.round(videoCount * 0.4), percentage: 40 },
        { category: "퓨전 요리/일식", count: Math.round(videoCount * 0.3), percentage: 30 },
        { category: "팝업스토어/전시", count: Math.round(videoCount * 0.2), percentage: 20 },
        { category: "기타", count: Math.round(videoCount * 0.1), percentage: 10 }
      ];

      return {
        videos,
        videoCount,
        viewCountGrowth,
        newChannelsCount,
        totalViewCount,
        topChannels,
        risingCategories
      };

    } catch (e) {
      console.error("YouTube API 호출 에러 발생, Mock 데이터로 전환합니다:", e);
      // 에러 시 Mock 데이터 폴백
    }
  }

  // API 키가 없거나 에러난 경우 정교한 Mock 로직 처리
  // 1초 인위적인 딜레이를 주어 분석 애니메이션이 돋보이도록 유도
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const cleanName = districtName.replace(/(동|길|상권)$/, ""); // '성수동' -> '성수', '망원동' -> '망원'
  
  // 키 매칭
  const matchedKey = Object.keys(MOCK_DISTRICTS).find(key => 
    key.includes(cleanName) || cleanName.includes(key)
  );

  if (matchedKey && MOCK_DISTRICTS[matchedKey]) {
    const data = MOCK_DISTRICTS[matchedKey];
    return {
      videos: data.videos || [],
      videoCount: data.videoCount || 20,
      viewCountGrowth: data.viewCountGrowth || 0,
      newChannelsCount: data.newChannelsCount || 2,
      totalViewCount: data.totalViewCount || 500000,
      topChannels: data.topChannels || [],
      risingCategories: data.risingCategories || []
    };
  }

  // 데이터베이스에 없는 새로운 지역에 대한 동적 시드 생성 (일관성 유지를 위해 해시 기반)
  let hash = 0;
  for (let i = 0; i < districtName.length; i++) {
    hash = districtName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const videoCount = Math.abs((hash % 35) + 8); // 8 ~ 43개
  const viewCountGrowth = Math.round(((hash % 120) - 20) * 10) / 10; // -20% ~ 100%
  const newChannelsCount = Math.abs((hash % 8) + 1); // 1 ~ 8개
  const totalViewCount = Math.abs((hash % 150) + 20) * 10000; // 20만 ~ 170만

  const categories = ["카페/디저트", "일식/이자카야", "퓨전 양식", "소품숍/라이프스타일", "한식 노포/주점", "와인바/펍"];
  const selectedCats = [
    categories[Math.abs(hash) % categories.length],
    categories[Math.abs(hash + 1) % categories.length],
    "기타"
  ];

  const risingCategories = [
    { category: selectedCats[0], count: Math.round(videoCount * 0.5), percentage: 50 },
    { category: selectedCats[1], count: Math.round(videoCount * 0.3), percentage: 30 },
    { category: selectedCats[2], count: Math.round(videoCount * 0.2), percentage: 20 }
  ];

  const topChannels = [
    { name: `핵인싸_${districtName}`, count: Math.round(videoCount * 0.2) + 1, subscriberRating: 8.2 },
    { name: `${districtName} 가이드`, count: Math.round(videoCount * 0.1) + 1, subscriberRating: 7.1 },
    { name: "전국 맛집 로드", count: 1, subscriberRating: 6.5 }
  ];

  const videos: YouTubeVideo[] = [
    {
      id: `dyn_vid_${Math.abs(hash)}_1`,
      title: `요즘 대세로 떠오르는 ${districtName} 골목 숨겨진 감성 핫플레이스 리뷰!`,
      channelTitle: `핵인싸_${districtName}`,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      viewCount: Math.round(totalViewCount * 0.6),
      thumbnailUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80",
      videoUrl: "https://www.youtube.com/watch?v=dyn1"
    },
    {
      id: `dyn_vid_${Math.abs(hash)}_2`,
      title: `${districtName} 로컬 주민이 직접 뽑은 절대 후회 없는 맛집 리스트 TOP3`,
      channelTitle: `${districtName} 가이드`,
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      viewCount: Math.round(totalViewCount * 0.3),
      thumbnailUrl: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=300&q=80",
      videoUrl: "https://www.youtube.com/watch?v=dyn2"
    }
  ];

  return {
    videos,
    videoCount,
    viewCountGrowth,
    newChannelsCount,
    totalViewCount,
    topChannels,
    risingCategories
  };
}
