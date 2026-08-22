import { createServerFn } from "@tanstack/react-start";

const KOREAEXIM_AUTH_KEY = "mMYcaufToxlSOSYZU8b8e5QND4nmLeXl";
const MAX_LOOKBACK_DAYS = 7;

// koreaexim fields, for reference: ttb/tts = 전신환 매입/매도율, bkpr = 장부가, deal_bas_r = 매매기준율(고시환율).
// Only deal_bas_r is the official reference rate we want to display.
export type ExchangeRateItem = {
  result: number;
  cur_unit: string;
  deal_bas_r: string;
};

// The API's searchdate is a KST calendar date, so compute "today" in Asia/Seoul rather than the server's local/UTC time.
function formatSearchDate(daysAgo: number) {
  const kstNow = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(kstNow);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}${get("month")}${get("day")}`;
}

// Runs on the server only, so the koreaexim.go.kr call never hits browser CORS.
// The API has no data on weekends/holidays, so we walk backwards until we find a business day.
async function findLatestRate(startOffset: number): Promise<{ rate: number; offset: number } | null> {
  for (let offset = startOffset; offset < startOffset + MAX_LOOKBACK_DAYS; offset++) {
    const url = `https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${KOREAEXIM_AUTH_KEY}&searchdate=${formatSearchDate(offset)}&data=AP01`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`koreaexim API request failed: ${response.status}`);
    }
    const data = (await response.json()) as ExchangeRateItem[];
    if (!Array.isArray(data) || data.length === 0) continue;

    const usd = data.find((item) => item.cur_unit === "USD" && item.result === 1);
    if (usd) return { rate: Number(usd.deal_bas_r.replace(/,/g, "")), offset };
  }
  return null;
}

export const getUsdKrwRate = createServerFn({ method: "GET" }).handler(async () => {
  const latest = await findLatestRate(0);
  if (!latest) throw new Error("USD rate not found in koreaexim response");

  const previous = await findLatestRate(latest.offset + 1);
  const changePercent = previous ? ((latest.rate - previous.rate) / previous.rate) * 100 : 0;

  return {
    value: latest.rate.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    changePercent,
  };
});


