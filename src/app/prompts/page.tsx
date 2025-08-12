'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { 
  Edit, 
  Save, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { 
  SystemPrompt,
  loadPrompts,
  savePrompts,
  updatePrompt,
  addPrompt,
  deletePrompt,
  defaultPrompts
} from '@/lib/prompts';

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<SystemPrompt[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPrompt, setNewPrompt] = useState<Partial<SystemPrompt>>({
    name: '',
    description: '',
    content: '',
    category: 'custom',
    isActive: false
  });
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    setPrompts(loadPrompts());
  }, []);

  const handleSave = (id: string, updates: Partial<SystemPrompt>) => {
    const updatedPrompts = updatePrompt(id, updates);
    setPrompts(updatedPrompts);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('이 프롬프트를 삭제하시겠습니까?')) {
      const updatedPrompts = deletePrompt(id);
      setPrompts(updatedPrompts);
    }
  };

  const handleAdd = () => {
    if (newPrompt.name && newPrompt.content) {
      const updatedPrompts = addPrompt(newPrompt as Omit<SystemPrompt, 'id' | 'lastModified'>);
      setPrompts(updatedPrompts);
      setNewPrompt({
        name: '',
        description: '',
        content: '',
        category: 'custom',
        isActive: false
      });
      setShowNewForm(false);
    }
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    const prompt = prompts.find(p => p.id === id);
    if (prompt) {
      // 같은 카테고리의 다른 프롬프트들을 비활성화
      if (isActive) {
        const updatedPrompts = prompts.map(p => 
          p.category === prompt.category && p.id !== id 
            ? { ...p, isActive: false }
            : p
        );
        setPrompts(updatedPrompts);
        savePrompts(updatedPrompts);
      }
      
      const finalPrompts = updatePrompt(id, { isActive });
      setPrompts(finalPrompts);
    }
  };

  const resetToDefaults = () => {
    if (confirm('모든 프롬프트를 기본값으로 초기화하시겠습니까? 사용자 정의 프롬프트는 삭제됩니다.')) {
      setPrompts(defaultPrompts);
      savePrompts(defaultPrompts);
    }
  };

  const exportPrompts = () => {
    const dataStr = JSON.stringify(prompts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'system-prompts.json';
    link.click();
  };

  const importPrompts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          if (Array.isArray(imported)) {
            setPrompts(imported);
            savePrompts(imported);
          }
        } catch (error) {
          alert('파일 형식이 올바르지 않습니다.');
        }
      };
      reader.readAsText(file);
    }
  };

  const getCategoryLabel = (category: SystemPrompt['category']) => {
    const labels = {
      analysis: '분석',
      negotiation: '협상',
      summary: '요약',
      custom: '사용자 정의'
    };
    return labels[category];
  };

  const getCategoryColor = (category: SystemPrompt['category']) => {
    const colors = {
      analysis: 'bg-blue-100 text-blue-800',
      negotiation: 'bg-green-100 text-green-800',
      summary: 'bg-purple-100 text-purple-800',
      custom: 'bg-gray-100 text-gray-800'
    };
    return colors[category];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              프롬프트 관리
            </h1>
            <p className="text-gray-600">
              AI 분석에 사용되는 시스템 프롬프트를 관리합니다.
            </p>
          </div>
          
          <div className="flex gap-2">
            <input
              type="file"
              accept=".json"
              onChange={importPrompts}
              className="hidden"
              id="import-prompts"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('import-prompts')?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              가져오기
            </Button>
            <Button
              variant="outline"
              onClick={exportPrompts}
            >
              <Download className="w-4 h-4 mr-2" />
              내보내기
            </Button>
            <Button
              variant="outline"
              onClick={resetToDefaults}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              초기화
            </Button>
            <Button
              onClick={() => setShowNewForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              새 프롬프트
            </Button>
          </div>
        </div>

        {/* 새 프롬프트 추가 폼 */}
        {showNewForm && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">새 프롬프트 추가</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">프롬프트 이름</Label>
                  <Input
                    value={newPrompt.name}
                    onChange={(e) => setNewPrompt({ ...newPrompt, name: e.target.value })}
                    placeholder="프롬프트 이름을 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <select
                    value={newPrompt.category}
                    onChange={(e) => setNewPrompt({ ...newPrompt, category: e.target.value as SystemPrompt['category'] })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="analysis">분석</option>
                    <option value="negotiation">협상</option>
                    <option value="summary">요약</option>
                    <option value="custom">사용자 정의</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">설명</Label>
                <Input
                  value={newPrompt.description}
                  onChange={(e) => setNewPrompt({ ...newPrompt, description: e.target.value })}
                  placeholder="프롬프트 설명을 입력하세요"
                />
              </div>
              <div>
                <Label htmlFor="content">프롬프트 내용</Label>
                <Textarea
                  value={newPrompt.content}
                  onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })}
                  placeholder="프롬프트 내용을 입력하세요"
                  rows={8}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd}>
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </Button>
                <Button variant="outline" onClick={() => setShowNewForm(false)}>
                  취소
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* 프롬프트 목록 */}
        <div className="space-y-4">
          {prompts.map((prompt) => (
            <Card key={prompt.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{prompt.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(prompt.category)}`}>
                      {getCategoryLabel(prompt.category)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(prompt.id, !prompt.isActive)}
                      className={prompt.isActive ? 'text-green-600' : 'text-gray-400'}
                    >
                      {prompt.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      {prompt.isActive ? '활성' : '비활성'}
                    </Button>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{prompt.description}</p>
                  <p className="text-xs text-gray-500">
                    마지막 수정: {new Date(prompt.lastModified).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingId(editingId === prompt.id ? null : prompt.id)}
                  >
                    <Edit className="w-4 h-4" />
                    {editingId === prompt.id ? '닫기' : '편집'}
                  </Button>
                  {prompt.category === 'custom' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(prompt.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      삭제
                    </Button>
                  )}
                </div>
              </div>

              {editingId === prompt.id && (
                <div className="space-y-4 border-t pt-4">
                  <div>
                    <Label>프롬프트 내용</Label>
                    <Textarea
                      value={prompt.content}
                      onChange={(e) => {
                        const updated = prompts.map(p =>
                          p.id === prompt.id ? { ...p, content: e.target.value } : p
                        );
                        setPrompts(updated);
                      }}
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSave(prompt.id, { content: prompt.content })}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      저장
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}