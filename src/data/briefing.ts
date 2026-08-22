export type Category =
  | "all"
  | "semiconductor"
  | "energy"
  | "bio"
  | "quantum"
  | "auto"
  | "steel";

export const categories: { id: Category; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "semiconductor", label: "IT/반도체" },
  { id: "energy", label: "에너지/소재" },
  { id: "bio", label: "바이오" },
  { id: "quantum", label: "양자컴퓨터" },
  { id: "auto", label: "자동차/기계" },
  { id: "steel", label: "철강/소재" },
];

export type NewsItem = {
  headline: string;
  url: string;
  source: string;
};

export type Stock = {
  code: string;
  name: string;
  change: number;
  summary: string[];
  tags: string[];
  category: Category;
  news?: NewsItem[];
};

export const initialStocks: Stock[] = [
  {
    code: "005930",
    name: "삼성전자",
    change: 3.42,
    summary: [
      "엔비디아향 차세대 HBM3E 공급 계약 체결 소식이 전해졌습니다.",
      "외국인 매수세가 장 초반부터 집중되며 거래대금 1위를 기록했습니다.",
      "반도체 부문 영업이익 개선 전망이 뚜렷해지며 강세를 이어갔습니다.",
    ],
    tags: ["#반도체", "#공급계약", "#호재"],
    category: "semiconductor",
    news: [
      { headline: "삼성전자, 엔비디아향 HBM3E 공급 계약 체결", source: "네이버 금융", url: "https://finance.naver.com/item/main.naver?code=005930" },
      { headline: "외국인 매수세 집중, 거래대금 1위 기록", source: "네이버 금융", url: "https://finance.naver.com/item/main.naver?code=005930" },
    ],
  },
  {
    code: "373220",
    name: "LG에너지솔루션",
    change: -2.15,
    summary: [
      "북미 전기차 수요 둔화 우려가 다시 부각되었습니다.",
      "테슬라의 실적 부진 여파가 배터리 셀 업체 전반으로 확산됐습니다.",
      "완성차 업체들의 전동화 전략 수정 가능성에 투자심리가 위축됐습니다.",
    ],
    tags: ["#이차전지", "#수요둔화"],
    category: "energy",
    news: [
      { headline: "북미 전기차 수요 둔화 우려 재부각", source: "네이버 금융", url: "https://finance.naver.com/item/main.naver?code=373220" },
      { headline: "테슬라 실적 부진, 배터리 셀 업체로 여파 확산", source: "네이버 금융", url: "https://finance.naver.com/item/main.naver?code=373220" },
    ],
  },
  {
    code: "035420",
    name: "NAVER",
    change: 5.8,
    summary: [
      "자체 AI 모델 하이퍼클로바X의 B2B 유료화가 본격화됩니다.",
      "구독형 매출 전환으로 중장기 성장성이 재평가되고 있습니다.",
      "광고·커머스 부문의 수익성 개선도 긍정적으로 평가받았습니다.",
    ],
    tags: ["#인공지능", "#실적발표"],
    category: "semiconductor",
    news: [
      { headline: "네이버, 하이퍼클로바X B2B 유료화 본격화", source: "네이버 금융", url: "https://finance.naver.com/item/main.naver?code=035420" },
      { headline: "광고·커머스 부문 수익성 개선 긍정 평가", source: "네이버 금융", url: "https://finance.naver.com/item/main.naver?code=035420" },
    ],
  },
  {
    code: "000660",
    name: "SK하이닉스",
    change: 1.98,
    summary: [
      "고대역폭 메모리(HBM) 시장 점유율 1위 지위가 더욱 공고해졌습니다.",
      "기관 투자자의 순매수가 5거래일 연속 이어졌습니다.",
      "D램 가격 반등 사이클 진입 효과가 실적에 가시화되고 있습니다.",
    ],
    tags: ["#HBM", "#반도체업황"],
    category: "semiconductor",
    news: [
      { headline: "SK하이닉스, HBM 시장 점유율 1위 지위 공고", source: "네이버 금융", url: "https://finance.naver.com/item/main.naver?code=000660" },
      { headline: "기관 순매수 5거래일 연속 지속", source: "네이버 금융", url: "https://finance.naver.com/item/main.naver?code=000660" },
    ],
  },
  {
    code: "207940",
    name: "삼성바이오로직스",
    change: -0.45,
    summary: [
      "대규모 CMO 수주 계약 체결 소식이 발표되었습니다.",
      "다만 단기 급등에 따른 차익 실현 매물이 출회되며 소폭 하락했습니다.",
      "5공장 조기 가동 준비는 차질 없이 진행 중입니다.",
    ],
    tags: ["#바이오", "#수주현황"],
    category: "bio",
    news: [
      { headline: "삼성바이오로직스, 대규모 CMO 수주 계약 체결", source: "네이버 금융", url: "https://finance.naver.com/item/main.naver?code=207940" },
      { headline: "5공장 조기 가동 준비 차질 없이 진행", source: "네이버 금융", url: "https://finance.naver.com/item/main.naver?code=207940" },
    ],
  },
  {
    code: "005380",
    name: "현대자동차",
    change: 0.85,
    summary: [
      "고부가가치 차종 중심의 판매 믹스 개선이 이어지고 있습니다.",
      "역대 최대 분기 실적 달성 가능성이 증권가에서 제기됐습니다.",
      "주주 환원 정책 강화 기대감이 주가를 지지하고 있습니다.",
    ],
    tags: ["#자동차", "#주주환원"],
    category: "auto",
    news: [
      { headline: "현대차, 고부가가치 차종 중심 판매 믹스 개선", source: "네이버 금융", url: "https://finance.naver.com/item/main.naver?code=005380" },
      { headline: "역대 최대 분기 실적 달성 가능성 제기", source: "네이버 금융", url: "https://finance.naver.com/item/main.naver?code=005380" },
    ],
  },
  {
    code: "068270",
    name: "셀트리온",
    change: 2.3,
    summary: [
      "짐펜트라의 미국 처방목록 등재가 확대되고 있습니다.",
      "현지 판매 채널 확보로 매출 성장 기대감이 고조됐습니다.",
      "합병 법인 출범 이후 비용 절감 효과가 가시화되는 중입니다.",
    ],
    tags: ["#바이오시밀러", "#미국진출"],
    category: "bio",
    news: [
      { headline: "셀트리온, 짐펜트라 미국 처방목록 등재 확대", source: "네이버 금융", url: "https://finance.naver.com/item/main.naver?code=068270" },
      { headline: "합병 법인 출범 이후 비용 절감 효과 가시화", source: "네이버 금융", url: "https://finance.naver.com/item/main.naver?code=068270" },
    ],
  },
  {
    code: "005490",
    name: "POSCO홀딩스",
    change: -1.12,
    summary: [
      "글로벌 철강 수요 부진이 예상보다 길어지고 있습니다.",
      "리튬 가격 하락세가 지속되며 수익성 악화 우려가 반영됐습니다.",
      "2차전지 소재 부문의 중장기 성장 모멘텀은 유효한 상태입니다.",
    ],
    tags: ["#철강", "#원자재"],
    category: "steel",
    news: [
      { headline: "글로벌 철강 수요 부진 장기화 우려", source: "네이버 금융", url: "https://finance.naver.com/item/main.naver?code=005490" },
      { headline: "2차전지 소재 부문 중장기 성장 모멘텀 유효", source: "네이버 금융", url: "https://finance.naver.com/item/main.naver?code=005490" },
    ],
  },
  {
    code: "IONQ",
    name: "IONQ",
    change: 4.5,
    summary: [
      "양자컴퓨터 상용화 기술이 고성능 컴퓨팅 시장에서 주목받고 있습니다.",
      "주요 클라우드 파트너십 확대가 실적 성장 기대감을 높였습니다.",
      "정부 양자전략 투자 확정이 관련 기업에 긍정적 환경을 제공했습니다.",
    ],
    tags: ["#양자컴퓨터", "#성장주"],
    category: "quantum",
    news: [
      { headline: "IonQ, 주요 클라우드 파트너십 확대", source: "Naver Finance", url: "https://search.naver.com/search.naver?query=IONQ+주가" },
      { headline: "정부 양자전략 투자 확정, 관련 기업 수혜 기대", source: "Naver Finance", url: "https://search.naver.com/search.naver?query=IONQ+주가" },
    ],
  },
  {
        code: "IONQ",
    name: "IONQ",
    change: 4.5,
    summary: [
      "양자컴퓨터 상용화 기술이 고성능 컴퓨팅 시장에서 주목받고 있습니다.",
      "주요 클라우드 파트너십 확대가 실적 성장 기대감을 높였습니다.",
      "정부 양자전략 투자 확정이 관련 기업에 긍정적 환경을 제공했습니다.",
    ],
    tags: ["#양자컴퓨터", "#성장주"],
    category: "quantum",
    news: [
      { headline: "IonQ, 주요 클라우드 파트너십 확대", source: "Naver Finance", url: "https://search.naver.com/search.naver?query=IONQ+주가" },
      { headline: "정부 양자전략 투자 확정, 관련 기업 수혜 기대", source: "Naver Finance", url: "https://search.naver.com/search.naver?query=IONQ+주가" },
    ],
  },
  {
            code: "IONQ",
    name: "IONQ",
    change: 4.5,
    summary: [
      "양자컴퓨터 상용화 기술이 고성능 컴퓨팅 시장에서 주목받고 있습니다.",
      "주요 클라우드 파트너십 확대가 실적 성장 기대감을 높였습니다.",
      "정부 양자전략 투자 확정이 관련 기업에 긍정적 환경을 제공했습니다.",
    ],
    tags: ["#양자컴퓨터", "#성장주"],
    category: "quantum",
    news: [
      { headline: "IonQ, 주요 클라우드 파트너십 확대", source: "Naver Finance", url: "https://search.naver.com/search.naver?query=IONQ+주가" },
      { headline: "정부 양자전략 투자 확정, 관련 기업 수혜 기대", source: "Naver Finance", url: "https://search.naver.com/search.naver?query=IONQ+주가" },
    ],
    },
    {
                  code: "IONQ",
    name: "IONQ",
    change: 4.5,
    summary: [
      "양자컴퓨터 상용화 기술이 고성능 컴퓨팅 시장에서 주목받고 있습니다.",
      "주요 클라우드 파트너십 확대가 실적 성장 기대감을 높였습니다.",
      "정부 양자전략 투자 확정이 관련 기업에 긍정적 환경을 제공했습니다.",
    ],
    tags: ["#양자컴퓨터", "#성장주"],
    category: "quantum",
    news: [
      { headline: "IonQ, 주요 클라우드 파트너십 확대", source: "Naver Finance", url: "https://search.naver.com/search.naver?query=IONQ+주가" },
      { headline: "정부 양자전략 투자 확정, 관련 기업 수혜 기대", source: "Naver Finance", url: "https://search.naver.com/search.naver?query=IONQ+주가" },
    ],
    },
    {
                  code: "IONQ",
    name: "IONQ",
    change: 4.5,
    summary: [
      "양자컴퓨터 상용화 기술이 고성능 컴퓨팅 시장에서 주목받고 있습니다.",
      "주요 클라우드 파트너십 확대가 실적 성장 기대감을 높였습니다.",
      "정부 양자전략 투자 확정이 관련 기업에 긍정적 환경을 제공했습니다.",
    ],
    tags: ["#양자컴퓨터", "#성장주"],
    category: "quantum",
    news: [
      { headline: "IonQ, 주요 클라우드 파트너십 확대", source: "Naver Finance", url: "https://search.naver.com/search.naver?query=IONQ+주가" },
      { headline: "정부 양자전략 투자 확정, 관련 기업 수혜 기대", source: "Naver Finance", url: "https://search.naver.com/search.naver?query=IONQ+주가" },
    ],
    },
    {
                  code: "IONQ",
    name: "IONQ",
    change: 4.5,
    summary: [
      "양자컴퓨터 상용화 기술이 고성능 컴퓨팅 시장에서 주목받고 있습니다.",
      "주요 클라우드 파트너십 확대가 실적 성장 기대감을 높였습니다.",
      "정부 양자전략 투자 확정이 관련 기업에 긍정적 환경을 제공했습니다.",
    ],
    tags: ["#양자컴퓨터", "#성장주"],
    category: "quantum",
    news: [
      { headline: "IonQ, 주요 클라우드 파트너십 확대", source: "Naver Finance", url: "https://search.naver.com/search.naver?query=IONQ+주가" },
      { headline: "정부 양자전략 투자 확정, 관련 기업 수혜 기대", source: "Naver Finance", url: "https://search.naver.com/search.naver?query=IONQ+주가" },
    ],
    },
    {
                  code: "IONQ",
    name: "IONQ",
    change: 4.5,
    summary: [
      "양자컴퓨터 상용화 기술이 고성능 컴퓨팅 시장에서 주목받고 있습니다.",
      "주요 클라우드 파트너십 확대가 실적 성장 기대감을 높였습니다.",
      "정부 양자전략 투자 확정이 관련 기업에 긍정적 환경을 제공했습니다.",
    ],
    tags: ["#양자컴퓨터", "#성장주"],
    category: "quantum",
    news: [
      { headline: "IonQ, 주요 클라우드 파트너십 확대", source: "Naver Finance", url: "https://search.naver.com/search.naver?query=IONQ+주가" },
      { headline: "정부 양자전략 투자 확정, 관련 기업 수혜 기대", source: "Naver Finance", url: "https://search.naver.com/search.naver?query=IONQ+주가" },
    ],
    },
];

export async function getStocksData(): Promise<Stock[]> {
  try {
    return initialStocks;
  } catch (error) {
    console.error("Failed to fetch stocks data:", error);
    return initialStocks;
  }
}
