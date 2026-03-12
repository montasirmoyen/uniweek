"use client";

import { ChangeEvent, useRef } from "react";
import { FileSpreadsheet, FlaskConical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TEST_FILE = "/test_classes.xlsx";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export function UseTestFile({ onFileSelect, isLoading = false }: FileUploadProps) {
  const handleClick = async () => {
    try {
      const response = await fetch(TEST_FILE);
      if (!response.ok) {
        throw new Error("Failed to load test file");
      }

      const blob = await response.blob();
      const file = new File([blob], "test_classes.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      onFileSelect(file);
    } catch {
      window.alert("Failed to load test file");
    }
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Start</CardTitle>
        <CardDescription>Try the app instantly with a sample Suffolk schedule.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleClick} disabled={isLoading} className="w-full mb-4" variant="secondary">
          <FlaskConical className="size-4" />
          Use Test Schedule
        </Button>
      </CardContent>
    </Card>
  );
}``

export function FileUpload({ onFileSelect, isLoading = false }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      onFileSelect(file);
      e.target.value = "";
      return;
    }

    window.alert("Please upload a valid .xlsx or .xls file");
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Upload Schedule</CardTitle>
        <CardDescription>Export your Workday schedule and upload it here.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => inputRef.current?.click()} disabled={isLoading} className="w-full mb-4">
          <FileSpreadsheet className="size-4" />
          {isLoading ? "Parsing..." : "Choose .xlsx File"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}
