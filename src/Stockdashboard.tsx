import React, { useState } from 'react';

const initialMockIssues = [
  {
    id: 1,
    code: '005930',
    name: '삼성전자',
    changeRate: '+3.42%',
    isRising: true,
    summary: [
      '엔비디아향 차세대 HBM3E 공급 계약 체결 소식이 전해짐',
      '외국인 매수세가 장 초반부터 집중되며 거래대금 최상위 기록',
      '반도체 부문 영업이익 개선 전망이 뚜렷해지며 매수세 유입'
    ],
    tags: ['#반도체', '#공급계약', '#호재']
  },
  {
    id: 2,
    code: '373220',
    name: 'LG에너지솔루션',
    changeRate: '-2.15%',
    isRising: false,
    summary: [
      '북미 전기차 수요 둔화 우려가 다시 부각되었음',
      '테슬라의 실적 부진 여파가 배터리 셀 업체 주가에 하방 압력',
      '완성차 업체들의 전동화 전략 수정 가능성에 경계감 확산'
    ],
    tags: ['#이차전지', '#수요둔화']
  }
];

export default function StockDashboard() {
  const [issues] = useState(initialMockIssues);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">출근길 실시간 AI 주식 브리핑</h1>
        <span className="text-sm text-gray-500">실시간 이슈 큐레이션 (총 {issues.length}개)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issues.map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-400">{item.code} {item.name}</span>
              <span className={`text-sm font-bold ${item.isRising ? 'text-red-500' : 'text-blue-500'}`}>
                {item.changeRate}
              </span>
            </div>
            
            <ul className="space-y-2 mb-4 text-sm text-gray-600">
              {item.summary.map((line, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 text-gray-300">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag, idx) => (
                <span key={idx} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}