'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, Camera } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
  preview?: string | null;
  onClear?: () => void;
}

export default function ImageUpload({ 
  onFileSelect, 
  onAnalyze,
  isAnalyzing = false,
  preview = null,
  onClear
}: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  if (preview) {
    return (
      <div className="relative">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-berlin-100 border-2 border-postal-200">
          <Image
            src={preview}
            alt="Glove preview"
            fill
            className="object-cover"
          />
          
          {/* Clear button */}
          <button
            onClick={onClear}
            className="absolute top-3 right-3 p-2 bg-berlin-900/80 hover:bg-berlin-900 text-white rounded-full transition-colors"
          >
            <X size={18} />
          </button>
          
          {/* Analyzing overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-berlin-900/70 flex flex-col items-center justify-center text-white">
              <Loader2 size={48} className="animate-spin mb-4" />
              <p className="text-lg font-medium">Analyzing glove...</p>
              <p className="text-sm text-berlin-300 mt-1">Claude AI is identifying details</p>
            </div>
          )}
        </div>
        
        {/* Analyze button */}
        {!isAnalyzing && onAnalyze && (
          <button
            onClick={onAnalyze}
            className="mt-4 w-full py-3 bg-postal-500 hover:bg-postal-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Camera size={20} />
            Analyze with AI
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        drop-zone relative aspect-square rounded-2xl 
        flex flex-col items-center justify-center gap-4 p-8
        cursor-pointer transition-all
        ${isDragActive ? 'active border-postal-500 bg-postal-50' : 'border-berlin-200 hover:border-postal-300'}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="w-20 h-20 rounded-full bg-postal-100 flex items-center justify-center">
        <Upload size={32} className="text-postal-500" />
      </div>
      
      <div className="text-center">
        <p className="text-berlin-700 font-medium">
          {isDragActive ? 'Drop the image here' : 'Drag & drop your glove photo'}
        </p>
        <p className="text-sm text-berlin-400 mt-1">
          or click to browse (max 5MB)
        </p>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-berlin-400">
        <span className="px-2 py-1 bg-berlin-100 rounded">JPG</span>
        <span className="px-2 py-1 bg-berlin-100 rounded">PNG</span>
        <span className="px-2 py-1 bg-berlin-100 rounded">WEBP</span>
      </div>
    </div>
  );
}



