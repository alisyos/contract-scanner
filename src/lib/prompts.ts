// 시스템 프롬프트 관리
export interface SystemPrompt {
  id: string;
  name: string;
  description: string;
  content: string;
  category: 'analysis' | 'negotiation' | 'summary' | 'custom';
  isActive: boolean;
  lastModified: string;
}

// 기본 시스템 프롬프트
export const defaultPrompts: SystemPrompt[] = [
  {
    id: 'contract-analysis',
    name: '계약서 분석 프롬프트',
    description: '계약서의 위험 요소, 모호한 조항, 불리한 조건을 분석하는 메인 프롬프트',
    category: 'analysis',
    isActive: true,
    lastModified: new Date().toISOString(),
    content: `You are an expert legal contract analyst. Analyze the provided contract and identify risks, ambiguities, and unfavorable terms. 
Provide your analysis in Korean (한국어) with the following structure:

1. 위험 점수 (0-1 scale)
2. 주요 발견사항 (3-5 key findings with severity)
3. 협상 포인트
4. 권장사항

Focus on practical business risks and legal implications.

Key areas to examine:
- 책임 및 면책 조항
- 계약 해지 조건
- 손해배상 조항
- 지적재산권 조항
- 기밀유지 조항
- 분쟁 해결 방법
- 불공정한 조항
- 모호하거나 불명확한 표현`
  },
  {
    id: 'negotiation-points',
    name: '협상 포인트 생성 프롬프트',
    description: '계약서 분석 후 협상 전략과 수정안을 제시하는 프롬프트',
    category: 'negotiation',
    isActive: true,
    lastModified: new Date().toISOString(),
    content: `Based on the contract analysis, provide negotiation points in Korean with:

1. 우선순위 (high/medium/low)
2. 구체적인 수정 제안
3. 협상 근거와 논리
4. 대안 제시
5. 예상되는 상대방 반응

Format each negotiation point as:
{
  "issue": "문제 조항",
  "priority": "high|medium|low",
  "suggestedChange": "수정 제안",
  "rationale": "근거",
  "alternatives": ["대안1", "대안2"]
}`
  },
  {
    id: 'executive-summary',
    name: '요약 보고서 프롬프트',
    description: '분석 결과를 경영진이 이해하기 쉽게 요약하는 프롬프트',
    category: 'summary',
    isActive: true,
    lastModified: new Date().toISOString(),
    content: `Create an executive summary in Korean that:

1. 핵심 위험 요소 3줄 요약
2. 즉시 조치가 필요한 사항
3. 협상 우선순위
4. 예상 비용/리스크
5. 최종 권장사항

Keep it concise and business-focused.
Avoid legal jargon.
Use bullet points for clarity.`
  },
  {
    id: 'clause-comparison',
    name: '조항 비교 프롬프트',
    description: '표준 계약서와 비교하여 차이점을 분석하는 프롬프트',
    category: 'analysis',
    isActive: false,
    lastModified: new Date().toISOString(),
    content: `Compare the provided contract with standard industry practices:

1. 표준 조항과의 차이점
2. 누락된 중요 조항
3. 비정상적인 조건
4. 업계 관행 대비 평가

Provide specific examples and recommendations.`
  }
];

// 프롬프트 저장 (로컬 스토리지)
export const savePrompts = (prompts: SystemPrompt[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('system-prompts', JSON.stringify(prompts));
  }
};

// 프롬프트 불러오기
export const loadPrompts = (): SystemPrompt[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('system-prompts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load prompts:', e);
      }
    }
  }
  return defaultPrompts;
};

// 프롬프트 업데이트
export const updatePrompt = (id: string, updates: Partial<SystemPrompt>) => {
  const prompts = loadPrompts();
  const index = prompts.findIndex(p => p.id === id);
  if (index !== -1) {
    prompts[index] = {
      ...prompts[index],
      ...updates,
      lastModified: new Date().toISOString()
    };
    savePrompts(prompts);
  }
  return prompts;
};

// 새 프롬프트 추가
export const addPrompt = (prompt: Omit<SystemPrompt, 'id' | 'lastModified'>) => {
  const prompts = loadPrompts();
  const newPrompt: SystemPrompt = {
    ...prompt,
    id: `custom-${Date.now()}`,
    lastModified: new Date().toISOString()
  };
  prompts.push(newPrompt);
  savePrompts(prompts);
  return prompts;
};

// 프롬프트 삭제
export const deletePrompt = (id: string) => {
  const prompts = loadPrompts();
  const filtered = prompts.filter(p => p.id !== id);
  savePrompts(filtered);
  return filtered;
};

// 활성 프롬프트 가져오기
export const getActivePrompt = (category: SystemPrompt['category']): SystemPrompt | undefined => {
  const prompts = loadPrompts();
  return prompts.find(p => p.category === category && p.isActive);
};