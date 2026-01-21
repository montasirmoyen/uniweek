'use client';

import { ChangeEvent, useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      onFileSelect(file);
    } else {
      alert('Please upload a valid .xlsx or .xls file');
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => inputRef.current?.click()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
        >
          Upload Schedule (.xlsx)
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
