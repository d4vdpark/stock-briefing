import { createServerFn } from "@tanstack/react-start";

// Unofficial but public, no-auth-key endpoint used by Naver Finance's own site.
const NAVER_INDEX_URL = "https://polling.finance.naver.com/api/realtime/domestic/index/KOSPI,KOSDAQ";

type NaverIndexItem = {
  itemCode: "KOSPI" | "KOSDAQ";
  closePriceRaw: string;
  fluctuationsRatioRaw: string;
  compareToPreviousPrice: { code: string };
};

type NaverIndexResponse = {
  datas: NaverIndexItem[];
};

export type MarketIndexQuote = {
  value: string;
  changePercent: number;
  isUp: boolean;
};

// Runs on the server only, so the polling.finance.naver.com call never hits browser CORS.
export const getKospiKosdaq = createServerFn({ method: "GET" }).handler(async () => {
  const response = await fetch(NAVER_INDEX_URL, {
    headers: { Referer: "https://finance.naver.com/" },
  });
  if (!response.ok) {
    throw new Error(`Naver index API request failed: ${response.status}`);
  }
  const data = (await response.json()) as NaverIndexResponse;

  const toQuote = (item: NaverIndexItem | undefined): MarketIndexQuote | null => {
    if (!item) return null;
    // compareToPreviousPrice.code: 2 = 상승, 3 = 보합, 5 = 하락. fluctuationsRatioRaw is already signed.
    const isUp = item.compareToPreviousPrice.code !== "5";
    const changePercent = Number(item.fluctuationsRatioRaw);
    return {
      value: Number(item.closePriceRaw).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      changePercent,
      isUp,
    };
  };

  const kospi = toQuote(data.datas.find((d) => d.itemCode === "KOSPI"));
  const kosdaq = toQuote(data.datas.find((d) => d.itemCode === "KOSDAQ"));
  if (!kospi || !kosdaq) throw new Error("KOSPI/KOSDAQ data not found in Naver response");

  return { kospi, kosdaq };
});
