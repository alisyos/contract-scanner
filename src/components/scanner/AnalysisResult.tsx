'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Download,
  ChevronDown,
  ChevronUp,
  Target,
  Shield,
  FileText
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { SEVERITY_COLORS, PRIORITY_COLORS } from '@/lib/constants';
import type { ContractAnalysisResponse } from '@/types/contract';

interface AnalysisResultProps {
  result: ContractAnalysisResponse;
  onReset?: () => void;
}

export function AnalysisResult({ result, onReset }: AnalysisResultProps) {
  console.log('AnalysisResult component rendered with result:', result);
  const [expandedSections, setExpandedSections] = useState<string[]>(['summary']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5" />;
      case 'low':
        return <Info className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-red-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskScoreBg = (score: number) => {
    if (score >= 0.7) return 'bg-red-100';
    if (score >= 0.4) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  console.log('Result status:', result.status);
  console.log('Result summary:', result.summary);
  console.log('Result summary risk_score:', result.summary?.risk_score);

  if (result.status === 'error') {
    console.log('Rendering error state');
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="text-lg font-semibold">분석 오류</h3>
        </div>
        {result.errors?.map((error, idx) => (
          <div key={idx} className="mb-2">
            <p className="text-sm font-medium">{error.code}</p>
            <p className="text-sm text-gray-600">{error.message}</p>
          </div>
        ))}
        <Button onClick={onReset} className="mt-4">다시 시도</Button>
      </Card>
    );
  }

  console.log('Rendering success state');
  return (
    <div className="space-y-6">
      {/* 요약 섹션 */}
      <Card className="p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('summary')}
        >
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5" />
            위험도 요약
          </h3>
          {expandedSections.includes('summary') ? 
            <ChevronUp className="w-5 h-5" /> : 
            <ChevronDown className="w-5 h-5" />
          }
        </div>

        {expandedSections.includes('summary') && (
          <div className="mt-4 space-y-4">
            {/* 전체 위험도 점수 */}
            <div className={cn(
              "p-4 rounded-lg text-center",
              getRiskScoreBg(result.summary.risk_score)
            )}>
              <p className="text-sm text-gray-600 mb-1">전체 위험도</p>
              <p className={cn(
                "text-3xl font-bold",
                getRiskScoreColor(result.summary.risk_score)
              )}>
                {(result.summary.risk_score * 100).toFixed(0)}%
              </p>
            </div>

            {/* 세부 위험도 분석 */}
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(result.summary.risk_breakdown).map(([key, value]) => {
                const labels: Record<string, string> = {
                  unfavorable_terms: '불리한 조항',
                  ambiguity: '모호한 조항',
                  legal_risk: '법적 리스크',
                  performance_timeline: '이행 일정',
                  termination_liquidated_damages: '해지/손해배상'
                };
                return (
                  <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{labels[key]}</span>
                    <span className={cn(
                      "text-sm font-medium",
                      value >= 0.2 ? 'text-red-600' : value >= 0.1 ? 'text-yellow-600' : 'text-green-600'
                    )}>
                      {(value * 100).toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* 주요 발견사항 */}
      <Card className="p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('findings')}
        >
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5" />
            주요 발견사항
          </h3>
          {expandedSections.includes('findings') ? 
            <ChevronUp className="w-5 h-5" /> : 
            <ChevronDown className="w-5 h-5" />
          }
        </div>

        {expandedSections.includes('findings') && (
          <div className="mt-4 space-y-3">
            {result.summary.key_findings.map((finding, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(finding.severity)}
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      SEVERITY_COLORS[finding.severity as keyof typeof SEVERITY_COLORS]
                    )}>
                      {finding.severity === 'high' ? '높음' : 
                       finding.severity === 'medium' ? '중간' : 
                       finding.severity === 'low' ? '낮음' : '없음'}
                    </span>
                  </div>
                  {finding.confidence && (
                    <span className="text-xs text-gray-500">
                      신뢰도: {finding.confidence === 'high' ? '높음' : 
                              finding.confidence === 'medium' ? '중간' : '낮음'}
                    </span>
                  )}
                </div>
                <h4 className="font-medium mb-2">{finding.title}</h4>
                <p className="text-sm text-gray-700 mb-2">{finding.reason}</p>
                {finding.clause_excerpt && (
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p className="text-gray-600 italic">&quot;{finding.clause_excerpt}&quot;</p>
                    {finding.clause_location?.section && (
                      <p className="text-xs text-gray-500 mt-1">
                        위치: {finding.clause_location.section}
                        {finding.clause_location.page && ` (${finding.clause_location.page}페이지)`}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 상세 보고서 */}
      {result.report.sections.length > 0 && (
        <Card className="p-6">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('report')}
          >
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              상세 보고서
            </h3>
            {expandedSections.includes('report') ? 
              <ChevronUp className="w-5 h-5" /> : 
              <ChevronDown className="w-5 h-5" />
            }
          </div>

          {expandedSections.includes('report') && (
            <div className="mt-4 space-y-4">
              {result.report.sections.map((section, idx) => (
                <div key={idx}>
                  <h4 className="font-medium mb-2">{section.heading}</h4>
                  <div className="space-y-2">
                    {section.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="pl-4 border-l-2 border-gray-200">
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-sm text-gray-700">{item.detail}</p>
                        {item.recommendation && (
                          <p className="text-sm text-blue-600 mt-1">
                            권장사항: {item.recommendation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* 협상 포인트 */}
      {result.negotiation_points && result.negotiation_points.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">협상 포인트</h3>
          <div className="space-y-3">
            {result.negotiation_points.map((point, idx) => {
              console.log('Negotiation point:', point);
              return (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{point.issue}</h4>
                    {point.priority && (
                      <span className={cn(
                        "text-sm font-medium",
                        PRIORITY_COLORS[point.priority as keyof typeof PRIORITY_COLORS]
                      )}>
                        {point.priority === 'high' ? '우선순위: 높음' :
                         point.priority === 'medium' ? '우선순위: 중간' : '우선순위: 낮음'}
                      </span>
                    )}
                  </div>
                  {point.impact && (
                    <p className="text-sm text-gray-700 mb-2">영향: {point.impact}</p>
                  )}
                  {point.suggested_rewrite && (
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm font-medium mb-1">제안 수정안:</p>
                      <p className="text-sm text-gray-700">{point.suggested_rewrite}</p>
                    </div>
                  )}
                  {point.rationale && (
                    <p className="text-xs text-gray-500 mt-2">근거: {point.rationale}</p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* 액션 버튼 */}
      <div className="flex gap-4">
        {result.report.downloadUrl && (
          <Button size="lg" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            보고서 다운로드
          </Button>
        )}
        <Button 
          variant="outline" 
          size="lg" 
          onClick={onReset}
          className="flex-1"
        >
          새 분석 시작
        </Button>
      </div>

      {/* 면책 조항 */}
      <div className="text-xs text-gray-500 text-center p-4 bg-gray-50 rounded">
        {result.meta.disclaimer}
      </div>
    </div>
  );
}