'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { FileUpload } from './FileUpload';
import { 
  CONTRACT_TYPES, 
  ANALYSIS_FOCUS_OPTIONS, 
  JURISDICTIONS, 
  LANGUAGES, 
  REPORT_FORMATS,
  ANALYSIS_PERSPECTIVE
} from '@/lib/constants';
import type { ContractAnalysisRequest, FileInfo } from '@/types/contract';

const formSchema = z.object({
  contract_file: z.object({
    name: z.string(),
    mimeType: z.string(),
    size: z.number(),
    storageKey: z.string()
  }),
  contract_type: z.enum(['auto', 'general_sale', 'service', 'real_estate', 'employment', 'nda', 'other']).default('auto'),
  analysis_focus: z.array(z.enum(['unfavorable_terms', 'ambiguity', 'legal_risk', 'performance_timeline', 'termination_liquidated_damages'])).min(1, '최소 1개 이상의 분석 항목을 선택하세요'),
  analysis_perspective: z.enum(['neutral', 'party_a', 'party_b', 'buyer', 'seller', 'service_provider', 'client', 'employer', 'employee']).default('neutral'),
  jurisdiction: z.enum(['KR', 'US', 'EU', 'JP', 'CN', 'OTHERS']).default('KR'),
  language: z.enum(['auto', 'ko', 'en', 'ja', 'zh']).default('auto'),
  report_format: z.enum(['brief', 'detailed', 'negotiation_points']),
  reference_docs: z.array(z.object({
    name: z.string(),
    mimeType: z.string(),
    size: z.number(),
    storageKey: z.string()
  })).optional(),
  additional_terms_text: z.string().max(5000).optional(),
  meta: z.object({
    contract_title: z.string().max(200).optional(),
    party_role: z.enum(['buyer', 'seller', 'service_provider', 'client', 'employer', 'employee', 'other']).optional(),
    counterparty_name: z.string().max(200).optional(),
    effective_date: z.string().optional(),
    end_date: z.string().optional(),
    currency: z.string().regex(/^[A-Z]{3}$/).optional(),
    total_value: z.number().min(0).optional()
  }).optional(),
});

interface AnalysisFormProps {
  onSubmit: (data: ContractAnalysisRequest) => void;
}

export function AnalysisForm({ onSubmit }: AnalysisFormProps) {
  const [contractFile, setContractFile] = useState<FileInfo | null>(null);
  const [referenceFiles, setReferenceFiles] = useState<FileInfo[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ContractAnalysisRequest>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contract_type: 'auto',
      analysis_perspective: 'neutral',
      jurisdiction: 'KR',
      language: 'auto',
      report_format: 'detailed',
      analysis_focus: ['unfavorable_terms', 'ambiguity', 'legal_risk'],
    }
  });

  const selectedFocus = watch('analysis_focus') || [];

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    console.log('Contract file:', contractFile);
    
    if (!contractFile) {
      alert('계약서 파일을 업로드해주세요.');
      return;
    }
    
    
    const formData: ContractAnalysisRequest = {
      ...data,
      contract_file: contractFile,
      reference_docs: referenceFiles.length > 0 ? referenceFiles : undefined,
    };
    
    console.log('Submitting analysis with formData:', formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* 파일 업로드 섹션 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">1. 계약서 파일 업로드</h3>
        <FileUpload
          onFileSelect={(file) => {
            setContractFile(file);
            if (file) setValue('contract_file', file);
          }}
          required
        />
      </Card>

      {/* 기본 설정 섹션 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">2. 기본 설정</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="contract_type">계약서 유형</Label>
            <select 
              {...register('contract_type')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {CONTRACT_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="jurisdiction">관할/법률</Label>
            <select 
              {...register('jurisdiction')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {JURISDICTIONS.map(j => (
                <option key={j.value} value={j.value}>
                  {j.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="language">언어</Label>
            <select 
              {...register('language')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="analysis_perspective">분석 관점</Label>
            <select 
              {...register('analysis_perspective')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {ANALYSIS_PERSPECTIVE.map(perspective => (
                <option key={perspective.value} value={perspective.value}>
                  {perspective.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              어떤 입장에서 계약서를 분석할지 선택하세요. 선택한 관점에 따라 위험 요소와 협상 포인트가 달라집니다.
            </p>
          </div>

          <div>
            <Label>분석 초점 <span className="text-red-500">*</span></Label>
            <div className="space-y-2 mt-2">
              {ANALYSIS_FOCUS_OPTIONS.map(option => (
                <label key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedFocus.includes(option.value as any)}
                    onCheckedChange={(checked) => {
                      const current = watch('analysis_focus') || [];
                      if (checked) {
                        setValue('analysis_focus', [...current, option.value as any]);
                      } else {
                        setValue('analysis_focus', current.filter(v => v !== option.value));
                      }
                    }}
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
            {errors.analysis_focus && (
              <p className="text-sm text-red-600 mt-1">{errors.analysis_focus.message}</p>
            )}
          </div>
        </div>
      </Card>

      {/* 보고서 옵션 섹션 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">3. 보고서 옵션</h3>
        <div>
          <Label>보고서 형식 <span className="text-red-500">*</span></Label>
          <RadioGroup
            value={watch('report_format')}
            onValueChange={(value) => setValue('report_format', value as any)}
            className="mt-2"
          >
            {REPORT_FORMATS.map(format => (
              <label key={format.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  value={format.value}
                  {...register('report_format')}
                  className="w-4 h-4"
                />
                <span className="text-sm">{format.label}</span>
              </label>
            ))}
          </RadioGroup>
        </div>

      </Card>

      {/* 고급 옵션 (선택) */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">4. 고급 옵션 (선택)</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? '접기' : '펼치기'}
          </Button>
        </div>

        {showAdvanced && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="additional_terms">특별 조건/추가 메모</Label>
              <Textarea
                placeholder="주의 사항이나 특별히 검토하고 싶은 내용을 입력하세요"
                {...register('additional_terms_text')}
                rows={3}
              />
            </div>

            <div>
              <Label>참조 문서 (선택)</Label>
              <FileUpload
                label="표준 계약서 또는 가이드라인"
                onFileSelect={(file) => {
                  if (file) {
                    setReferenceFiles([...referenceFiles, file]);
                  }
                }}
                required={false}
              />
            </div>
          </div>
        )}
      </Card>


      {/* 제출 버튼 */}
      <div className="flex gap-4">
        <Button
          type="submit"
          size="lg"
          disabled={!contractFile || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? '분석 중...' : '분석 시작'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => window.location.reload()}
        >
          초기화
        </Button>
      </div>
    </form>
  );
}