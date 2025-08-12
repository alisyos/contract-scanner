import Link from 'next/link'
import { FileText, Home, FileEdit } from 'lucide-react'

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-[230px] bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6">
        {/* 로고 영역 */}
        <div className="mb-12">
          <Link href="/" className="text-xl font-bold text-gray-900">
            AI 계약서 스캐너
          </Link>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="space-y-2">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>홈</span>
          </Link>
          <Link 
            href="/scanner" 
            className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span>계약서 분석</span>
          </Link>
          <Link 
            href="/prompts" 
            className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
          >
            <FileEdit className="w-5 h-5" />
            <span>프롬프트 관리</span>
          </Link>
        </nav>
      </div>
    </aside>
  )
}