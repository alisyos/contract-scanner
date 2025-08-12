import Link from 'next/link';
import { FileText, Target, Shield, Clock, FileEdit } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI 계약서 리스크 스캐너
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI 기반으로 계약서의 위험 요소를 자동 분석하고 협상 포인트를 제시합니다
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/scanner"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              분석 시작하기
            </Link>
            <Link 
              href="/prompts"
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FileEdit className="w-5 h-5 mr-2" />
              프롬프트 관리
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">정확한 위험 분석</h3>
            <p className="text-gray-600">
              AI가 계약서의 불리한 조항, 모호한 표현, 법적 리스크를 정확하게 식별합니다.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">협상 포인트 제시</h3>
            <p className="text-gray-600">
              위험 요소별로 구체적인 협상 전략과 수정안을 제공합니다.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">빠른 분석</h3>
            <p className="text-gray-600">
              몇 분 안에 종합적인 계약서 분석 리포트를 생성합니다.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border mb-8">
          <h2 className="text-2xl font-bold mb-4">지원 파일 형식</h2>
          <div className="flex flex-wrap gap-4">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">PDF</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">DOCX</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">TXT</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">이미지 (JPG, PNG)</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-bold mb-4">시스템 프롬프트 관리</h2>
          <p className="text-gray-600 mb-4">
            AI 분석의 품질을 높이기 위해 시스템 프롬프트를 직접 관리하고 수정할 수 있습니다.
          </p>
          <ul className="text-gray-600 space-y-2">
            <li>• 계약서 분석 프롬프트 최적화</li>
            <li>• 협상 포인트 생성 로직 조정</li>
            <li>• 사용자 정의 프롬프트 추가</li>
            <li>• 프롬프트 백업 및 복원</li>
          </ul>
        </div>
      </div>
    </div>
  );
}