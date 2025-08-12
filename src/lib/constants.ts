export const CONTRACT_TYPES = [
  { value: 'auto', label: '자동 감지' },
  { value: 'general_sale', label: '일반 매매 계약' },
  { value: 'service', label: '용역 계약' },
  { value: 'real_estate', label: '부동산 임대/매매 계약' },
  { value: 'employment', label: '고용 계약' },
  { value: 'nda', label: 'NDA(기밀유지계약)' },
  { value: 'other', label: '기타' }
];

export const ANALYSIS_FOCUS_OPTIONS = [
  { value: 'unfavorable_terms', label: '불리한 조항' },
  { value: 'ambiguity', label: '모호한 조항' },
  { value: 'legal_risk', label: '법적 리스크' },
  { value: 'performance_timeline', label: '이행 일정 리스크' },
  { value: 'termination_liquidated_damages', label: '해지/손해배상 조항' }
];

export const JURISDICTIONS = [
  { value: 'KR', label: '대한민국' },
  { value: 'US', label: '미국' },
  { value: 'EU', label: 'EU' },
  { value: 'JP', label: '일본' },
  { value: 'CN', label: '중국' },
  { value: 'OTHERS', label: '기타' }
];

export const LANGUAGES = [
  { value: 'auto', label: '자동 감지' },
  { value: 'ko', label: '한국어' },
  { value: 'en', label: '영어' },
  { value: 'ja', label: '일본어' },
  { value: 'zh', label: '중국어' }
];

export const REPORT_FORMATS = [
  { value: 'brief', label: '요약 보고' },
  { value: 'detailed', label: '상세 분석' },
  { value: 'negotiation_points', label: '협상 포인트 중심' }
];

export const PARTY_ROLES = [
  { value: 'buyer', label: '구매자' },
  { value: 'seller', label: '판매자' },
  { value: 'service_provider', label: '서비스 제공자' },
  { value: 'client', label: '클라이언트' },
  { value: 'employer', label: '고용주' },
  { value: 'employee', label: '근로자' },
  { value: 'other', label: '기타' }
];

export const ANALYSIS_PERSPECTIVE = [
  { value: 'neutral', label: '중립적 관점' },
  { value: 'party_a', label: '갑 (계약서 상 첫 번째 당사자)' },
  { value: 'party_b', label: '을 (계약서 상 두 번째 당사자)' },
  { value: 'buyer', label: '구매자 입장' },
  { value: 'seller', label: '판매자 입장' },
  { value: 'service_provider', label: '서비스 제공자 입장' },
  { value: 'client', label: '클라이언트 입장' },
  { value: 'employer', label: '고용주 입장' },
  { value: 'employee', label: '근로자 입장' }
];

export const SEVERITY_COLORS = {
  high: 'text-red-600 bg-red-50',
  medium: 'text-yellow-600 bg-yellow-50',
  low: 'text-blue-600 bg-blue-50',
  none: 'text-gray-600 bg-gray-50'
};

export const PRIORITY_COLORS = {
  high: 'text-red-600',
  medium: 'text-yellow-600',
  low: 'text-blue-600'
};