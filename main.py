from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import requests
from bs4 import BeautifulSoup
import datetime

app = FastAPI()
templates = Jinja2Templates(directory="templates")

API_KEY = "mMYcaufToxlSOSYZU8b8e5QND4nmLeXl"

def get_market_data():
    market_info = {
        "kospi": {"value": "2,745.20", "change": "+0.85%", "type": "up"},
        "kosdaq": {"value": "856.40", "change": "-0.32%", "type": "down"},
        "exchange_rate": {"value": "1,393.00", "change": "-0.68%", "type": "down"}
    }
    
    try:
        url = "https://finance.naver.com/"
        headers = {"User-Agent": "Mozilla/5.0"}
        res = requests.get(url, headers=headers, timeout=3)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, "html.parser")
            kospi_elem = soup.select_one("#KOSPI_now")
            if kospi_elem:
                market_info["kospi"]["value"] = kospi_elem.text.strip()
                
            kosdaq_elem = soup.select_one("#KOSDAQ_now")
            if kosdaq_elem:
                market_info["kosdaq"]["value"] = kosdaq_elem.text.strip()
    except Exception as e:
        print("지표 크롤링 예외:", e)

    try:
        today_str = datetime.datetime.now().strftime("%Y%m%d")
        ex_url = f"https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey={API_KEY}&searchdate={today_str}&data=AP01"
        ex_res = requests.get(ex_url, timeout=3)
        if ex_res.status_code == 200:
            ex_data = ex_res.json()
            for item in ex_data:
                if item.get("cur_unit") == "USD":
                    market_info["exchange_rate"]["value"] = item.get("deal_bas_r")
                    break
    except Exception as e:
        print("환율 API 예외:", e)

    return market_info

@app.get("/", response_class=HTMLResponse)
def read_root(request: Request):
    return templates.TemplateResponse(request, "index.html")

@app.get("/news", response_class=HTMLResponse)
def get_stock_news(request: Request):
    market_data = get_market_data()

    # 예시 종목별 브리핑 데이터 (사용자께서 보여주신 카드 형태 기준)
    stock_cards = [
        {
            "code": "005930",
            "name": "삼성전자",
            "change": "+3.42%",
            "change_type": "up",
            "category": "it",
            "summary_lines": [
                "엔비디아향 차세대 HBM3E 공급 계약 체결 소식이 전해졌습니다.",
                "외국인 매수세가 장 초반부터 집중되며 거래대금 1위를 기록했습니다.",
                "반도체 부문 영업이익 개선 전망이 뚜렷해지며 강세를 이어갔습니다."
            ],
            "tags": ["반도체", "공급계약", "호재"],
            "news_sources": [
                {"title": "삼성전자, 엔비디아에 HBM3E 공급 계약 체결", "press": "한국경제", "link": "https://finance.naver.com"},
                {"title": "외국인 순매수 집중... 삼성전자 거래대금 1위", "press": "매일경제", "link": "https://finance.naver.com"},
                {"title": "반도체 업황 회복... 영업이익 전망 상향", "press": "연합뉴스", "link": "https://finance.naver.com"}
            ]
        },
        {
            "code": "373220",
            "name": "LG에너지솔루션",
            "change": "-2.15%",
            "change_type": "down",
            "category": "energy",
            "summary_lines": [
                "북미 전기차 수요 둔화 우려가 다시 부각되었습니다.",
                "테슬라의 실적 부진 여파가 배터리 셀 업체 전반으로 확산됐습니다.",
                "완성차 업체들의 전동화 전략 수정 가능성에 투자 심리가 위축됐습니다."
            ],
            "tags": ["이차전지", "수요둔화"],
            "news_sources": [
                {"title": "전기차 속도조절론에 LG엔솔 등 배터리주 약세", "press": "서울경제", "link": "https://finance.naver.com"},
                {"title": "북미 3분기 전기차 판매량 예상치 하회", "press": "이데일리", "link": "https://finance.naver.com"}
            ]
        },
        {
            "code": "035420",
            "name": "NAVER",
            "change": "+5.80%",
            "change_type": "up",
            "category": "it",
            "summary_lines": [
                "자체 AI 모델 하이퍼클로바X의 B2B 유료화가 본격화됩니다.",
                "구독형 매출 전환으로 중장기 성장성이 재평가되고 있습니다.",
                "광고·커머스 부문의 수익성 개선도 긍정적으로 평가받았습니다."
            ],
            "tags": ["인공지능", "실적발표"],
            "news_sources": [
                {"title": "네이버, AI B2B 사업 본격 궤도 진입", "press": "디지털타임스", "link": "https://finance.naver.com"},
                {"title": "증권가 \"네이버, 커머스 고성장 지속\" 목표가 상향", "press": "한국경제", "link": "https://finance.naver.com"}
            ]
        },
        {
            "code": "000660",
            "name": "SK하이닉스",
            "change": "+1.98%",
            "change_type": "up",
            "category": "it",
            "summary_lines": [
                "고대역폭 메모리(HBM) 시장 점유율 1위 지위가 더욱 공고해졌습니다.",
                "기관 투자자의 순매수가 5거래일 연속 이어졌습니다."
            ],
            "tags": ["반도체", "HBM"],
            "news_sources": [
                {"title": "SK하이닉스, HBM 독주 체제 강화", "press": "머니투데이", "link": "https://finance.naver.com"}
            ]
        },
        {
            "code": "207940",
            "name": "삼성바이오로직스",
            "change": "-0.45%",
            "change_type": "down",
            "category": "bio",
            "summary_lines": [
                "대규모 CMO 수주 계약 체결 소식이 발표되었습니다.",
                "다만 단기 급등에 따른 차익실현 매물이 출회되며 소폭 조정받았습니다."
            ],
            "tags": ["바이오", "CMO"],
            "news_sources": [
                {"title": "삼성바이오로직스, 글로벌 빅파마와 대규모 수주", "press": "연합뉴스", "link": "https://finance.naver.com"}
            ]
        },
        {
            "code": "005380",
            "name": "현대자동차",
            "change": "+0.85%",
            "change_type": "up",
            "category": "auto",
            "summary_lines": [
                "고부가가치 차종 중심의 판매 믹스 개선이 이어지고 있습니다.",
                "역대 최대 분기 실적 달성 가능성이 증권가에서 제기되었습니다."
            ],
            "tags": ["자동차", "실적호조"],
            "news_sources": [
                {"title": "현대차, 북미 시장서 하이브리드 판매 신기록", "press": "매일경제", "link": "https://finance.naver.com"}
            ]
        }
    ]

    return templates.TemplateResponse(
        request, 
        "news.html", 
        {
            "stock_cards": stock_cards,
            "market": market_data
        }
    )