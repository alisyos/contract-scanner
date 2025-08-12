'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, FileText, Brain, CheckCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function AnalysisModal({ isOpen, onClose }: AnalysisModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      id: 1,
      title: '파일 처리 중',
      description: '계약서 파일을 읽고 텍스트를 추출하고 있습니다.',
      icon: FileText,
      duration: 2000
    },
    {
      id: 2,
      title: 'AI 분석 진행 중',
      description: '계약서의 위험 요소와 문제점을 분석하고 있습니다.',
      icon: Brain,
      duration: 4000
    },
    {
      id: 3,
      title: '협상 포인트 생성 중',
      description: '분석 결과를 바탕으로 협상 전략을 수립하고 있습니다.',
      icon: CheckCircle,
      duration: 2000
    }
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    let elapsedTime = 0;

    const interval = setInterval(() => {
      elapsedTime += 100;
      const newProgress = Math.min((elapsedTime / totalDuration) * 100, 100);
      setProgress(newProgress);

      // 현재 단계 계산
      let accumulatedTime = 0;
      for (let i = 0; i < steps.length; i++) {
        accumulatedTime += steps[i].duration;
        if (elapsedTime <= accumulatedTime) {
          setCurrentStep(i);
          break;
        }
      }

      if (elapsedTime >= totalDuration) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center">계약서 분석 중</DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          {/* 메인 로딩 스피너 */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* 진행률 바 */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>진행률</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 단계별 진행 상황 */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.id} className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-50 border border-blue-200' : 
                  isCompleted ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  <div className={`flex-shrink-0 ${
                    isActive ? 'text-blue-600' : 
                    isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {isActive ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${
                      isActive ? 'text-blue-900' : 
                      isCompleted ? 'text-green-900' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </div>
                    <div className={`text-xs ${
                      isActive ? 'text-blue-700' : 
                      isCompleted ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {step.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 추가 안내 메시지 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              평균 분석 시간: 2-3분
            </p>
            <p className="text-xs text-gray-500 mt-1">
              분석이 완료되면 결과가 우측 패널에 표시됩니다.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}