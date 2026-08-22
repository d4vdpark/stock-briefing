import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { categories, getStocksData, type Category, type Stock } from "@/data/briefing";
import { getUsdKrwRate } from "@/lib/exchange-rate";
import { getKospiKosdaq, type MarketIndexQuote } from "@/lib/market-index";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StockDashboard from "../Stockdashboard";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "오늘의 출근길 주식 핵심 브리핑" },
      {
        name: "description",
        content:
          "출근길 3분, 오늘 시장에서 움직인 종목과 그 이유를 한 페이지로 요약한 주식 이슈 브리핑 대시보드.",
      },
      { property: "og:title", content: "오늘의 출근길 주식 핵심 브리핑" },
      {
        property: "og:description",
        content: "오늘 오른 종목, 내린 종목과 그 이유를 3줄로 정리한 데일리 마켓 메모.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      
    ],
  }),
  component: Index,
});

function formatToday() {
  const now = new Date();
  const date = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(now);
  return `${date} · 오전 07:30 발행`;
}

function StockCard({ 
  stock, 
  onSelect 
}: { 
  stock: Stock; 
  onSelect: (stock: Stock) => void; 
}) {
  const isUp = stock.change >= 0;
  return (
    <article 
      onClick={() => onSelect(stock)}
      className="group relative rounded-xl bg-card p-5 ring-1 ring-border transition-all hover:ring-foreground/15 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <span className="block text-xs font-medium tracking-wider text-muted-foreground">
              {stock.code}
            </span>
            <h2 className="truncate text-lg font-semibold text-card-foreground">{stock.name}</h2>
          </div>
          <span
            className={cn(
              "shrink-0 text-2xl font-semibold leading-none tabular-nums",
              isUp ? "text-up" : "text-down"
            )}
          >
            {isUp ? `+${stock.change}%` : `${stock.change}%`}
          </span>
        </div>

        {/* 카드 내부 요약 리스트 */}
        <ul className="space-y-2 mb-4">
          {stock.summary.map((item, index) => (
            <li key={index} className="text-sm text-muted-foreground line-clamp-1">
              • {item}
            </li>
          ))}
        </ul>
      </div>

      {/* 태그 영역 */}
      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
        {stock.tags?.map((tag, index) => (
          <span key={index} className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs">
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}
function CategoryTabs({
  active,
  onSelect,
}: {
  active: Category;
  onSelect: (category: Category) => void;
}) {
  return (
    <nav aria-label="주식 카테고리" className="mb-6">
      <div
        role="tablist"
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      >
        {categories.map((category) => {
          const isActive = active === category.id;
          return (
            <button
              key={category.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(category.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Index() {
const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    getStocksData().then((data) => setStocks(data));
  }, []);
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [marketData, setMarketData] = useState({
    kospi: null as MarketIndexQuote | null,
    kosdaq: null as MarketIndexQuote | null,
    usdKrw: null as { value: string; change: string; isUp: boolean } | null,
  });
  const [isLoadingRate, setIsLoadingRate] = useState(true);
  const [rateError, setRateError] = useState(false);
  const [indexError, setIndexError] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchKoreanEximRate() {
      setIsLoadingRate(true);
      setRateError(false);
      try {
        // Calls a server function so the koreaexim.go.kr request runs server-side, avoiding browser CORS.
        const { value, changePercent } = await getUsdKrwRate();
        if (!cancelled) {
          const isUp = changePercent >= 0;
          setMarketData((prev) => ({
            ...prev,
            usdKrw: {
              value,
              change: `${isUp ? "+" : ""}${changePercent.toFixed(2)}%`,
              isUp,
            },
          }));
        }
      } catch (err) {
        console.error("API Error:", err);
        if (!cancelled) setRateError(true);
      } finally {
        if (!cancelled) setIsLoadingRate(false);
      }
    }

    async function fetchKospiKosdaq() {
      setIndexError(false);
      try {
        // Calls a server function so the naver.com request runs server-side, avoiding browser CORS.
        const { kospi, kosdaq } = await getKospiKosdaq();
        if (!cancelled) {
          setMarketData((prev) => ({ ...prev, kospi, kosdaq }));
        }
      } catch (err) {
        console.error("API Error:", err);
        if (!cancelled) setIndexError(true);
      }
    }

    fetchKoreanEximRate();
    fetchKospiKosdaq();
  }, []);

  const filteredStocks = activeCategory === "all" ? stocks : stocks.filter((s) => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-background pb-12 font-sans text-foreground antialiased">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 px-5 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] gap-2 md:flex md:items-end md:justify-between">
          <div className="min-w-0">
            <h1 className="text-balance text-xl font-semibold leading-tight tracking-tight md:text-2xl">
              오늘의 출근길 주식 핵심 브리핑
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{formatToday()}</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            <span className="size-2 rounded-full bg-up" />
            Market Data Live
          </div>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-5xl px-5 sm:px-6">
      <div style={{ display: "flex", gap: "20px", marginBottom: "24px" }}>
  {/* 1번째 카드: USD/KRW */}
  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px 20px", flex: 1 }}>
    <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>USD/KRW</span>
    <div style={{ marginTop: "8px" }}>
      {marketData.usdKrw ? (
        <>
          <span style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", marginRight: "8px" }}>{marketData.usdKrw.value}</span>
          <span style={{ color: marketData.usdKrw.isUp ? "#e11d48" : "#2563eb", fontWeight: 600 }}>{marketData.usdKrw.change}</span>
        </>
      ) : rateError ? (
        <span style={{ fontSize: "14px", fontWeight: 600, color: "#e11d48" }}>환율 정보를 가져오지 못했습니다</span>
      ) : (
        <span style={{ fontSize: "20px", fontWeight: 700, color: "#94a3b8" }}>불러오는 중...</span>
      )}
    </div>
  </div>

  {/* 2번째 카드: KOSDAQ */}
  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px 20px", flex: 1 }}>
    <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>KOSDAQ</span>
    <div style={{ marginTop: "8px" }}>
      {marketData.kosdaq ? (
        <>
          <span style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", marginRight: "8px" }}>{marketData.kosdaq.value}</span>
          <span style={{ color: marketData.kosdaq.isUp ? "#e11d48" : "#2563eb", fontWeight: 600 }}>
            {marketData.kosdaq.isUp ? "+" : ""}
            {marketData.kosdaq.changePercent.toFixed(2)}%
          </span>
        </>
      ) : indexError ? (
        <span style={{ fontSize: "14px", fontWeight: 600, color: "#e11d48" }}>지수 정보를 가져오지 못했습니다</span>
      ) : (
        <span style={{ fontSize: "20px", fontWeight: 700, color: "#94a3b8" }}>불러오는 중...</span>
      )}
    </div>
  </div>

  {/* 3번째 카드: KOSPI */}
  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px 20px", flex: 1 }}>
    <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>KOSPI</span>
    <div style={{ marginTop: "8px" }}>
      {marketData.kospi ? (
        <>
          <span style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", marginRight: "8px" }}>{marketData.kospi.value}</span>
          <span style={{ color: marketData.kospi.isUp ? "#e11d48" : "#2563eb", fontWeight: 600 }}>
            {marketData.kospi.isUp ? "+" : ""}
            {marketData.kospi.changePercent.toFixed(2)}%
          </span>
        </>
      ) : indexError ? (
        <span style={{ fontSize: "14px", fontWeight: 600, color: "#e11d48" }}>지수 정보를 가져오지 못했습니다</span>
      ) : (
        <span style={{ fontSize: "20px", fontWeight: 700, color: "#94a3b8" }}>불러오는 중...</span>
      )}
    </div>
  </div>
</div>
        <CategoryTabs active={activeCategory} onSelect={setActiveCategory} />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
         {filteredStocks.map((stock) => (
  <StockCard key={stock.code} stock={stock} onSelect={setSelectedStock} />
))}
        </div>

        {filteredStocks.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            해당 카테고리의 종목이 없습니다.
          </div>
        )}
      </main>

      <footer className="mx-auto mt-16 max-w-5xl px-5 sm:px-6">
        <div className="flex flex-col items-start gap-4 border-t border-border pt-8">
          <p className="max-w-[56ch] text-xs leading-relaxed text-muted-foreground">
            본 브리핑은 투자 참고용으로만 제공되며, 투자에 대한 최종 결정과 책임은 투자자 본인에게
            있습니다. 위 정보는 시장 상황에 따라 지연되거나 변경될 수 있습니다.
          </p>
        </div>
      </footer>
      <StockDetailDialog
        stock={selectedStock}
        onClose={() => setSelectedStock(null)}
      />
    </div>
  );
}
function StockDetailDialog({
  stock,
  onClose,
}: {
  stock: Stock | null;
  onClose: () => void;
}) {
  if (!stock) return null;

  const isUp = stock.change >= 0;

  return (
    <Dialog open={!!stock} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="text-xs font-medium text-muted-foreground">{stock.code}</div>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            {stock.name}
            <span className={cn("text-xl font-semibold", isUp ? "text-up" : "text-down")}>
              {isUp ? `+${stock.change}%` : `${stock.change}%`}
            </span>
          </DialogTitle>
          <DialogDescription>전일 대비 등락률 · AI 핵심 브리핑</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* AI 요약 브리핑 박스 */}
          <div className="bg-secondary/50 rounded-xl p-5 border border-border">
            <h4 className="text-sm font-semibold text-foreground mb-3">AI 요약 브리핑</h4>
            <ul className="space-y-2.5">
              {stock.summary.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border/60">
              {stock.tags?.map((tag, index) => (
                <span key={index} className="px-2.5 py-1 rounded-md bg-background text-foreground text-xs font-medium border border-border">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* 관련 원본 뉴스 */}
          {stock.news && stock.news.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">관련 원본 뉴스</h4>
              <div className="space-y-2.5">
                {stock.news.map((n, index) => (
                  <a
                    key={index}
                    href={n.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors group"
                  >
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {n.headline}
                    </span>
                    <div className="flex items-center gap-2 text-muted-foreground shrink-0 ml-4">
                      <span className="text-xs">{n.source}</span>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}