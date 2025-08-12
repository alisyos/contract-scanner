'use client';

import { useState } from 'react';
import { AnalysisForm } from '@/components/scanner/AnalysisForm';
import { AnalysisResult } from '@/components/scanner/AnalysisResult';
import { AnalysisModal } from '@/components/scanner/AnalysisModal';
import { ContractAnalysisService } from '@/services/contractAnalysis';
import { Card } from '@/components/ui/card';
import type { ContractAnalysisRequest, ContractAnalysisResponse } from '@/types/contract';

export default function ScannerPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ContractAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async (request: ContractAnalysisRequest) => {
    console.log('handleAnalysis called with request:', request);
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const service = ContractAnalysisService.getInstance();
      console.log('Calling analyzeContract...');
      const result = await service.analyzeContract(request);
      console.log('Analysis result received in page:', result);
      setAnalysisResult(result);
      console.log('State updated with result');
    } catch (err) {
      setError('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('Analysis error:', err);
    } finally {
      console.log('Setting isAnalyzing to false');
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
  };

  console.log('Rendering page - isAnalyzing:', isAnalyzing, 'analysisResult:', analysisResult, 'error:', error);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-full">
          <h1 className="text-2xl font-bold text-gray-900">
            AI 계약서 리스크 스캐너
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            계약서를 업로드하면 AI가 위험 요소를 자동으로 분석합니다.
          </p>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)]">
        {/* Left Panel - Form */}
        <div className="w-full lg:w-2/5 bg-white border-r-0 lg:border-r border-gray-200 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {error && (
              <Card className="p-4 mb-6 bg-red-50 border-red-200">
                <p className="text-red-800">{error}</p>
              </Card>
            )}
            <AnalysisForm onSubmit={handleAnalysis} />
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="w-full lg:w-3/5 bg-gray-50 overflow-y-auto min-h-[400px] lg:min-h-0">
          <div className="p-4 lg:p-6">
            {analysisResult ? (
              <AnalysisResult 
                result={analysisResult} 
                onReset={handleReset}
              />
            ) : (
              <Card className="p-8 lg:p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-12 h-12 lg:w-16 lg:h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  분석 결과가 여기에 표시됩니다
                </h3>
                <p className="text-gray-600 text-sm">
                  <span className="hidden lg:inline">좌측 패널에서</span>
                  <span className="lg:hidden">위 패널에서</span>
                  {' '}계약서를 업로드하고 분석을 시작하세요.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Analysis Modal */}
      <AnalysisModal 
        isOpen={isAnalyzing} 
        onClose={() => setIsAnalyzing(false)}
      />
    </div>
  );
}