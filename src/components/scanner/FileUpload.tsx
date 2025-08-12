'use client';

import { useState, useCallback } from 'react';
import { Upload, X, FileText, Image, File } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { FileInfo } from '@/types/contract';

interface FileUploadProps {
  onFileSelect: (file: FileInfo | null) => void;
  accept?: string;
  maxSize?: number;
  label?: string;
  required?: boolean;
}

export function FileUpload({
  onFileSelect,
  accept = '.pdf,.docx,.txt,.png,.jpg,.jpeg',
  maxSize = 52428800, // 50MB
  label = '계약서 파일',
  required = false
}: FileUploadProps) {
  const [file, setFile] = useState<FileInfo | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('image')) return <Image className="w-8 h-8" />;
    if (mimeType.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
    if (mimeType.includes('word')) return <FileText className="w-8 h-8 text-blue-500" />;
    return <File className="w-8 h-8" />;
  };

  const handleFile = useCallback((uploadedFile: File) => {
    setError(null);

    if (uploadedFile.size > maxSize) {
      setError(`파일 크기가 ${maxSize / 1024 / 1024}MB를 초과합니다.`);
      return;
    }

    const fileInfo: FileInfo = {
      name: uploadedFile.name,
      mimeType: uploadedFile.type,
      size: uploadedFile.size,
      storageKey: `uploads/${Date.now()}_${uploadedFile.name}`
    };

    setFile(fileInfo);
    onFileSelect(fileInfo);
  }, [maxSize, onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  }, [handleFile]);

  const removeFile = useCallback(() => {
    setFile(null);
    setError(null);
    onFileSelect(null);
  }, [onFileSelect]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {!file ? (
        <Card
          className={cn(
            "border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
            error && "border-red-300"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm font-medium text-gray-900 mb-1">
              파일을 드래그하거나 클릭하여 업로드
            </p>
            <p className="text-xs text-gray-500">
              PDF, DOCX, TXT, 이미지 (최대 50MB)
            </p>
          </label>
        </Card>
      ) : (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon(file.mimeType)}
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              type="button"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </Card>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}