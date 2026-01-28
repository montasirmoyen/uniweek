'use client';

import { ChangeEvent, useRef } from 'react';
const testFile = '/test_classes.xlsx';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

function UseTestFile({ onFileSelect }: FileUploadProps) {
  const handleClick = async () => {
    try {
      const response = await fetch(testFile);
      if (!response.ok) {
        throw new Error('Failed to load test file');
      }
      const blob = await response.blob();
      const file = new File([blob], 'test_classes.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      onFileSelect(file);
    } catch (error) {
      console.error('Error loading test file:', error);
      alert('Failed to load test file');
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleClick}
          className="px-6 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/80 transition-colors font-medium shadow-md"
        >
          Use Test Schedule File
        </button>
      </div>
    </div>
  );
}
const FileUpload = ({ onFileSelect }: FileUploadProps) => {
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
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors font-medium shadow-md"
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

export { FileUpload, UseTestFile };