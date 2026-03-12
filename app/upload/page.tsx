"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AlertTriangle, X } from "lucide-react";

import { FileUpload, UseTestFile } from "@/components/FileUpload";
import LiveStatus from "@/components/LiveStatus";
import WeeklySchedule from "@/components/WeeklySchedule";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getColorForClass } from "@/lib/funcs/colors";
import { parseMeetingPattern, parseScheduleFile } from "@/lib/funcs/parseExcel";
import { loadSchedule, saveSchedule } from "@/lib/firebase/db";
import type { ClassData } from "@/lib/types/schedule";
import type { ScheduleBlock } from "@/lib/types/schedule";

interface AlertResponse {
  has_alert: boolean;
  date?: string | null;
  message?: string | null;
  error?: string;
}

export default function UploadPage() {
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([]);
  const [fileName, setFileName] = useState("");
  const [studentFirstName, setStudentFirstName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertData, setAlertData] = useState<AlertResponse | null>(null);
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState<number | null>(null);
  const [currentClassId, setCurrentClassId] = useState<string | null>(null);

  const { isAuthenticated, user } = useAuth();

  const loadSavedSchedule = useCallback(async (userId: string) => {
    try {
      const savedSchedule = await loadSchedule(userId);
      if (!savedSchedule) return;

      setFileName(`Saved schedule (${savedSchedule.fileName})`);
      const blocks = buildScheduleBlocks(savedSchedule.classes);
      setScheduleBlocks(blocks);
      await fetchAlert();
    } catch {
      window.alert("Could not load saved schedule.");
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      void loadSavedSchedule(user.id);
    }
  }, [isAuthenticated, user, loadSavedSchedule]);

  const fetchAlert = async () => {
    try {
      const response = await fetch("/api/suffolk-alert");
      if (!response.ok) {
        setAlertData(null);
        return;
      }
      const data = (await response.json()) as AlertResponse;
      setAlertData(data);
    } catch {
      setAlertData(null);
    }
  };

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setFileName(file.name);

    try {
      const { classes, studentFirstName: firstName } = await parseScheduleFile(file);
      setStudentFirstName(firstName);

      const blocks = buildScheduleBlocks(classes);
      setScheduleBlocks(blocks);

      if (isAuthenticated && user) {
        await saveSchedule(user.id, classes, file.name);
      }

      await fetchAlert();
    } catch {
      window.alert("Error parsing file. Make sure it is a valid schedule export.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetSchedule = () => {
    setScheduleBlocks([]);
    setFileName("");
    setStudentFirstName(null);
    setAlertData(null);
    setCurrentClassId(null);
    setCurrentTimeMinutes(null);
  };

  const greeting = getGreeting();

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {scheduleBlocks.length === 0 ? (
          <div className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-3xl">Upload Schedule</CardTitle>
                <CardDescription>
                  Export your classes from Workday as .xlsx, then visualize your week in one click.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
                <UseTestFile onFileSelect={handleFileSelect} isLoading={isLoading} />
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>How to Export</CardTitle>
                <CardDescription>Use the highlighted export icon from Workday current classes.</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <Image
                  src="/tutorial.png"
                  alt="Tutorial on exporting schedule from Workday"
                  width={1920}
                  height={1080}
                  className="h-auto w-full rounded-md border border-border"
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-3xl font-bold md:text-4xl">
                  {greeting}, {studentFirstName || user?.name || "Student"}
                </h1>
                <p className="text-sm text-muted-foreground">Loaded file: {fileName}</p>
              </div>
              <Button variant="outline" onClick={resetSchedule}>
                Change Schedule
              </Button>
            </div>

            {alertData?.has_alert && alertData.message ? (
              <Card className="mb-5 border-destructive/40 bg-destructive/5">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-destructive">
                        <AlertTriangle className="size-3.5" /> Emergency Alert from Suffolk University
                      </div>
                      {alertData.date ? <p className="text-xs text-muted-foreground">{alertData.date}</p> : null}
                      <p className="mt-1 text-sm">{alertData.message}</p>
                    </div>
                    <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => setAlertData(null)}>
                      <X className="size-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <LiveStatus
              scheduleBlocks={scheduleBlocks}
              onCurrentTimeUpdate={setCurrentTimeMinutes}
              onCurrentClassUpdate={setCurrentClassId}
            />

            <WeeklySchedule
              scheduleBlocks={scheduleBlocks}
              currentTimeMinutes={currentTimeMinutes}
              currentClassId={currentClassId}
            />
          </div>
        )}
      </div>
    </main>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 15) return "Good afternoon";
  if (hour >= 15 && hour < 20) return "Good evening";
  return "Good night";
}

function buildScheduleBlocks(classes: ClassData[]): ScheduleBlock[] {
  const blocks: ScheduleBlock[] = [];
  classes.forEach((classData, index) => {
    const meetingPatterns = parseMeetingPattern(classData.meetingPatterns);
    const color = getColorForClass(index);

    meetingPatterns.forEach((meetingPattern, patternIndex) => {
      blocks.push({
        id: `${index}-${patternIndex}`,
        classData,
        meetingPattern,
        color,
      });
    });
  });

  return blocks;
}
