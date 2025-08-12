import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getActivePrompt } from '@/lib/prompts';

const requestSchema = z.object({
  contractText: z.string(),
  contractType: z.string(),
  analysisFocus: z.array(z.string()),
  analysisPerspective: z.string(),
  jurisdiction: z.string(),
  language: z.string(),
  reportFormat: z.string(),
});

const getSystemPrompt = () => {
  const activePrompt = getActivePrompt('analysis');
  return activePrompt?.content || `You are an expert legal contract analyst. Analyze the provided contract and identify risks, ambiguities, and unfavorable terms. 
Provide your analysis in Korean (한국어) with the following structure:

1. 위험 점수 (0-1 scale)
2. 주요 발견사항 (3-5 key findings with severity)
3. 협상 포인트
4. 권장사항

Focus on practical business risks and legal implications.`;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validated = requestSchema.parse(body);
    
    const getPerspectiveInstruction = (perspective: string) => {
  const instructions = {
    neutral: '중립적 관점에서 객관적으로 분석하세요.',
    party_a: '갑(계약서 상 첫 번째 당사자)의 입장에서 분석하세요. 갑에게 불리한 조항과 위험 요소를 중점적으로 식별하세요.',
    party_b: '을(계약서 상 두 번째 당사자)의 입장에서 분석하세요. 을에게 불리한 조항과 위험 요소를 중점적으로 식별하세요.',
    buyer: '구매자 입장에서 분석하세요. 구매자에게 불리한 조건과 리스크를 중점적으로 검토하세요.',
    seller: '판매자 입장에서 분석하세요. 판매자에게 불리한 조건과 리스크를 중점적으로 검토하세요.',
    service_provider: '서비스 제공자 입장에서 분석하세요. 서비스 제공자에게 불리한 조건과 리스크를 중점적으로 검토하세요.',
    client: '클라이언트 입장에서 분석하세요. 클라이언트에게 불리한 조건과 리스크를 중점적으로 검토하세요.',
    employer: '고용주 입장에서 분석하세요. 고용주에게 불리한 조건과 리스크를 중점적으로 검토하세요.',
    employee: '근로자 입장에서 분석하세요. 근로자에게 불리한 조건과 리스크를 중점적으로 검토하세요.'
  };
  return instructions[perspective as keyof typeof instructions] || instructions.neutral;
};

    const userPrompt = `
계약서 분석 요청:
- 계약서 유형: ${validated.contractType}
- 분석 관점: ${validated.analysisPerspective}
- 분석 초점: ${validated.analysisFocus.join(', ')}
- 관할: ${validated.jurisdiction}
- 언어: ${validated.language}
- 보고서 형식: ${validated.reportFormat}

분석 관점 지침: ${getPerspectiveInstruction(validated.analysisPerspective)}

계약서 내용:
${validated.contractText}

위 계약서를 분석하여 다음 항목들을 JSON 형식으로 응답해주세요:
{
  "riskScore": 0.0-1.0,
  "keyFindings": [
    {
      "type": "string",
      "title": "string",
      "severity": "high|medium|low",
      "description": "string",
      "clauseLocation": "string",
      "recommendation": "string"
    }
  ],
  "negotiationPoints": [
    {
      "issue": "string",
      "priority": "high|medium|low",
      "suggestedChange": "string",
      "rationale": "string"
    }
  ],
  "executiveSummary": "string",
  "recommendations": ["string"]
}
`;

    // Dynamic import of OpenAI to avoid build issues
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'sk-fake-key-for-build',
    });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        { role: 'system', content: getSystemPrompt() },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: parseInt(process.env.MAX_TOKENS || '4000'),
      response_format: { type: 'json_object' }
    });

    const analysisResult = JSON.parse(completion.choices[0].message.content || '{}');

    const response = {
      jobId: `scan_${Date.now().toString(36)}`,
      status: 'completed',
      summary: {
        risk_score: analysisResult.riskScore || 0.5,
        risk_breakdown: {
          unfavorable_terms: validated.analysisFocus.includes('unfavorable_terms') ? 0.25 : 0.05,
          ambiguity: validated.analysisFocus.includes('ambiguity') ? 0.15 : 0.03,
          legal_risk: validated.analysisFocus.includes('legal_risk') ? 0.20 : 0.08,
          performance_timeline: validated.analysisFocus.includes('performance_timeline') ? 0.10 : 0.02,
          termination_liquidated_damages: validated.analysisFocus.includes('termination_liquidated_damages') ? 0.12 : 0.04
        },
        key_findings: analysisResult.keyFindings || []
      },
      report: {
        format: validated.reportFormat,
        sections: [
          {
            heading: 'Executive Summary',
            items: [
              {
                label: '전체 평가',
                detail: analysisResult.executiveSummary || '분석이 완료되었습니다.',
                recommendation: analysisResult.recommendations?.[0] || '전문가 검토를 권장합니다.'
              }
            ]
          }
        ]
      },
      negotiation_points: analysisResult.negotiationPoints || [],
      meta: {
        input_echo: {
          contract_type: validated.contractType,
          jurisdiction: validated.jurisdiction,
          language: validated.language,
          analysis_focus: validated.analysisFocus,
          notification: { show_in_app: true }
        },
        contract_overview: {},
        disclaimer: '본 분석은 AI 기반 참고 자료이며, 법적 조언이 아닙니다. 중요한 결정 전 전문가 상담을 권장합니다.'
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Analysis error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to .env.local' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to analyze contract', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}