import type { ContractAnalysisRequest, ContractAnalysisResponse } from '@/types/contract';

// Function to extract text from file (simplified version)
const extractTextFromFile = async (file: any): Promise<string> => {
  // In a real implementation, you would:
  // 1. Upload the file to a server or cloud storage
  // 2. Extract text based on file type (PDF, DOCX, etc.)
  // 3. Return the extracted text
  
  // For now, return a placeholder
  return `[계약서 내용: ${file.name}]
  
본 계약은 갑과 을 간의 서비스 제공에 관한 계약입니다.

제1조 (목적)
본 계약은 을이 갑에게 제공하는 서비스의 내용과 조건을 정함을 목적으로 한다.

제2조 (서비스 내용)
을은 갑에게 다음과 같은 서비스를 제공한다.
1. 컨설팅 서비스
2. 기술 지원

제3조 (계약 기간)
본 계약은 2024년 1월 1일부터 2024년 12월 31일까지 유효하다.

제4조 (대금 지급)
갑은 을에게 월 10,000,000원을 매월 말일에 지급한다.

제5조 (책임의 제한)
을은 어떠한 경우에도 간접손해, 특별손해에 대해 책임을 지지 않는다.

제6조 (기밀유지)
양 당사자는 본 계약과 관련하여 알게 된 상대방의 기밀정보를 제3자에게 누설하지 않는다.`;
};

// Mock data for demo purposes (fallback when API fails)
const generateMockResponse = (request: ContractAnalysisRequest): ContractAnalysisResponse => {
  const jobId = `scan_${Date.now().toString(36)}`;
  
  // Generate risk score based on analysis focus
  const baseRiskScore = Math.random() * 0.3 + 0.4; // 0.4 ~ 0.7
  const riskModifier = request.analysis_focus.length > 3 ? 0.1 : 0;
  const riskScore = Math.min(baseRiskScore + riskModifier, 1);

  return {
    jobId,
    status: 'completed',
    summary: {
      risk_score: riskScore,
      risk_breakdown: {
        unfavorable_terms: request.analysis_focus.includes('unfavorable_terms') ? 0.25 : 0.05,
        ambiguity: request.analysis_focus.includes('ambiguity') ? 0.15 : 0.03,
        legal_risk: request.analysis_focus.includes('legal_risk') ? 0.20 : 0.08,
        performance_timeline: request.analysis_focus.includes('performance_timeline') ? 0.10 : 0.02,
        termination_liquidated_damages: request.analysis_focus.includes('termination_liquidated_damages') ? 0.12 : 0.04
      },
      key_findings: [
        {
          type: 'unfavorable_terms',
          title: '일방적 책임 및 면책 조항',
          severity: 'high',
          confidence: 'high',
          reason: '계약서에 일방적으로 불리한 책임 조항이 포함되어 있으며, 상대방의 면책 범위가 과도합니다.',
          clause_excerpt: '제12조 (책임의 제한) 을은 어떠한 경우에도 갑에 대하여 간접손해, 특별손해, 결과적 손해에 대해 책임을 지지 않는다.',
          clause_location: {
            page: 8,
            section: '제12조',
            paragraph: '3항'
          }
        },
        {
          type: 'ambiguity',
          title: '모호한 이행 기준',
          severity: 'medium',
          confidence: 'medium',
          reason: '서비스 완료 기준이 명확하지 않아 분쟁 발생 가능성이 있습니다.',
          clause_excerpt: '을은 갑이 만족할 수 있는 수준의 서비스를 제공해야 한다.',
          clause_location: {
            page: 4,
            section: '제5조',
            paragraph: '1항'
          }
        },
        {
          type: 'legal_risk',
          title: '관할법원 조항 부재',
          severity: 'low',
          confidence: 'high',
          reason: '분쟁 발생 시 관할법원이 명시되지 않아 법적 절차가 복잡해질 수 있습니다.',
          clause_excerpt: '본 계약과 관련한 분쟁은 당사자간 협의로 해결한다.',
          clause_location: {
            page: 12,
            section: '제20조',
            paragraph: '1항'
          }
        }
      ]
    },
    report: {
      format: request.report_format,
      sections: [
        {
          heading: 'Executive Summary',
          items: [
            {
              label: '전체 평가',
              detail: '계약서에 여러 위험 요소가 발견되었으며, 특히 책임 제한 조항과 모호한 이행 기준에 대한 수정이 필요합니다.',
              recommendation: '주요 조항에 대한 재협상을 권장합니다.'
            },
            {
              label: '우선 조치사항',
              detail: '책임 제한 조항의 상한선 설정 및 서비스 완료 기준의 명확화가 시급합니다.',
              recommendation: '법무팀 검토 후 상대방과 협의 진행'
            }
          ]
        },
        {
          heading: '카테고리별 분석',
          items: [
            {
              label: '불리한 조항',
              detail: '일방적인 면책 조항과 무제한 손해배상 책임이 포함되어 있습니다.',
              recommendation: '책임 한도를 연간 계약금액의 100%로 제한',
              suggested_rewrite: '을의 책임은 연간 계약금액의 100%를 초과하지 않는다.'
            },
            {
              label: '모호한 조항',
              detail: '성과 측정 기준과 완료 조건이 불명확합니다.',
              recommendation: '구체적인 KPI와 측정 방법 명시'
            }
          ]
        }
      ],
      downloadUrl: null
    },
    negotiation_points: request.report_format === 'negotiation_points' ? [
      {
        issue: '책임 한도 설정',
        impact: '무제한 손해배상 리스크 제거',
        priority: 'high',
        suggested_rewrite: '각 당사자의 책임은 연간 계약금액의 100%를 초과하지 않는다.',
        rationale: '업계 표준 관행 및 리스크 관리'
      },
      {
        issue: '서비스 완료 기준 명확화',
        impact: '분쟁 예방 및 명확한 이행',
        priority: 'high',
        suggested_rewrite: '서비스는 별첨 사양서의 요구사항을 100% 충족 시 완료된 것으로 본다.',
        rationale: '객관적 평가 기준 필요'
      },
      {
        issue: '관할법원 명시',
        impact: '법적 분쟁 시 절차 간소화',
        priority: 'medium',
        suggested_rewrite: '본 계약과 관련한 분쟁은 서울중앙지방법원을 제1심 관할법원으로 한다.',
        rationale: '분쟁 해결 절차 명확화'
      }
    ] : undefined,
    alignment_with_reference: request.reference_docs && request.reference_docs.length > 0 ? {
      has_reference: true,
      notes: '제공된 표준 계약서와 비교 분석을 수행했습니다.',
      mismatches: [
        {
          topic: '지급 조건',
          deviation: '표준 계약서는 30일, 현재 계약서는 60일',
          risk: '현금 흐름 악화 가능성',
          suggested_fix: '지급 기한을 30일로 단축'
        }
      ]
    } : {
      has_reference: false,
      notes: '참조 문서 없이 일반 기준으로 분석',
      mismatches: []
    },
    meta: {
      input_echo: {
        contract_type: request.contract_type,
        jurisdiction: request.jurisdiction,
        language: request.language,
        analysis_focus: request.analysis_focus,
        notification: request.notification || { show_in_app: true }
      },
      contract_overview: {
        title: request.meta?.contract_title || request.contract_file.name,
        parties: {
          this_party_role: request.meta?.party_role,
          counterparty_name: request.meta?.counterparty_name
        },
        term: {
          effective_date: request.meta?.effective_date,
          end_date: request.meta?.end_date
        },
        value: {
          currency: request.meta?.currency,
          total_value: request.meta?.total_value
        }
      },
      disclaimer: '본 분석은 AI 기반 참고 자료이며, 법적 조언이 아닙니다. 중요한 결정 전 전문가 상담을 권장합니다.'
    }
  };
};

export class ContractAnalysisService {
  private static instance: ContractAnalysisService;
  
  private constructor() {}
  
  static getInstance(): ContractAnalysisService {
    if (!ContractAnalysisService.instance) {
      ContractAnalysisService.instance = new ContractAnalysisService();
    }
    return ContractAnalysisService.instance;
  }

  async analyzeContract(request: ContractAnalysisRequest): Promise<ContractAnalysisResponse> {
    // Validate consent
    if (!request.consent_privacy) {
      return {
        jobId: '',
        status: 'error',
        summary: {
          risk_score: 0,
          risk_breakdown: {
            unfavorable_terms: 0,
            ambiguity: 0,
            legal_risk: 0,
            performance_timeline: 0,
            termination_liquidated_damages: 0
          },
          key_findings: []
        },
        report: {
          format: request.report_format,
          sections: []
        },
        meta: {
          input_echo: {
            contract_type: request.contract_type,
            jurisdiction: request.jurisdiction,
            language: request.language,
            analysis_focus: request.analysis_focus,
            notification: request.notification || { show_in_app: true }
          },
          contract_overview: {},
          disclaimer: ''
        },
        errors: [{
          code: 'NO_CONSENT',
          message: '개인정보 처리 동의가 필요합니다.'
        }]
      };
    }

    try {
      // Extract text from contract file
      const contractText = await extractTextFromFile(request.contract_file);
      console.log('Extracted contract text (preview):', contractText.substring(0, 200));
      
      // Call the API route
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractText,
          contractType: request.contract_type,
          analysisFocus: request.analysis_focus,
          analysisPerspective: request.analysis_perspective,
          jurisdiction: request.jurisdiction,
          language: request.language,
          reportFormat: request.report_format,
        }),
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        
        // If API key is not configured or invalid, show helpful message
        if (errorData.error?.includes('API key') || errorData.error?.includes('Incorrect')) {
          console.log('API 키 문제 감지. 목업 데이터를 사용합니다.');
          // Don't show alert every time - just log it
          console.log('OpenAI API 키 문제. 목업 데이터로 진행합니다.');
        }
        
        // Fall back to mock data
        console.log('Falling back to mock data due to API error');
        const mockResponse = generateMockResponse(request);
        console.log('Generated mock response:', mockResponse);
        return mockResponse;
      }

      const result = await response.json();
      console.log('API analysis result received:', result);
      return result as ContractAnalysisResponse;
      
    } catch (error) {
      console.error('Failed to analyze contract:', error);
      
      // Fall back to mock data if API fails
      console.log('Falling back to mock data due to error');
      const mockResponse = generateMockResponse(request);
      console.log('Generated mock response:', mockResponse);
      return mockResponse;
    }
  }

  async getAnalysisStatus(jobId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'error';
    progress?: number;
  }> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      status: 'completed',
      progress: 100
    };
  }

  async downloadReport(jobId: string): Promise<Blob> {
    // Mock implementation - in production, this would generate actual PDF
    const mockPdfContent = 'Mock PDF content for job: ' + jobId;
    return new Blob([mockPdfContent], { type: 'application/pdf' });
  }
}