'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { DocumentType } from '@/types';

interface UploadFile {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface UploadDropzoneProps {
  documentType: DocumentType;
  onUpload: (file: File, type: DocumentType) => Promise<void>;
  accept?: string;
  multiple?: boolean;
}

export function UploadDropzone({
  documentType,
  onUpload,
  accept = '.pdf,.csv,.xlsx,.png,.jpg,.jpeg',
  multiple = true,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    async (fileList: File[]) => {
      const newFiles: UploadFile[] = fileList.map((f) => ({
        file: f,
        status: 'pending',
        progress: 0,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      for (let i = 0; i < newFiles.length; i++) {
        const idx = files.length + i;
        setFiles((prev) =>
          prev.map((f, j) => (j === idx ? { ...f, status: 'uploading', progress: 30 } : f)),
        );
        try {
          await onUpload(newFiles[i].file, documentType);
          setFiles((prev) =>
            prev.map((f, j) => (j === idx ? { ...f, status: 'success', progress: 100 } : f)),
          );
        } catch (err) {
          setFiles((prev) =>
            prev.map((f, j) =>
              j === idx
                ? {
                    ...f,
                    status: 'error',
                    progress: 0,
                    error: err instanceof Error ? err.message : 'Upload failed',
                  }
                : f,
            ),
          );
        }
      }
    },
    [documentType, files.length, onUpload],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const fileList = Array.from(e.dataTransfer.files);
      processFiles(fileList);
    },
    [processFiles],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = Array.from(e.target.files ?? []);
    processFiles(fileList);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={cn(
          'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition-colors cursor-pointer',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50',
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={onInputChange}
        />
        <Upload className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-sm font-medium">Drop files here or click to upload</p>
        <p className="text-xs text-muted-foreground mt-1">
          Supported: PDF, CSV, XLSX, PNG, JPG
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((uf, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-lg border p-3 text-sm"
            >
              <File className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{uf.file.name}</p>
                {uf.status === 'uploading' && (
                  <Progress value={uf.progress} className="h-1 mt-1" />
                )}
                {uf.status === 'error' && (
                  <p className="text-xs text-destructive mt-0.5">{uf.error}</p>
                )}
              </div>
              <div className="shrink-0">
                {uf.status === 'uploading' && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {uf.status === 'success' && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                {uf.status === 'error' && (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                )}
                {uf.status === 'pending' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
