'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import WeeklySchedule from '@/components/WeeklySchedule';
import LiveStatus from '@/components/LiveStatus';
import { parseScheduleFile, parseMeetingPattern } from '@/lib/funcs/parseExcel';
import { ScheduleBlock } from '@/lib/types/schedule';
import { getColorForClass } from '@/lib/funcs/colors';
import { useAuth } from '@/lib/contexts/AuthContext';
import Image from 'next/image';
import { X } from 'lucide-react';

type AlertResponse = {
  has_alert: boolean;
  date?: string | null;
  message?: string | null;
  error?: string;
};

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 15) {
    return 'Good afternoon';
  } else if (hour >= 15 && hour < 20) {
    return 'Good evening';
  } else {
    return 'Good night';
  }
}

export default function UploadPage() {
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [studentFirstName, setStudentFirstName] = useState<string | null>(null);
  const [alertData, setAlertData] = useState<AlertResponse | null>(null);
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState<number | null>(null);
  const [currentClassId, setCurrentClassId] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchAlert = async () => {
    try {
      const res = await fetch('/api/suffolk-alert');
      if (!res.ok) {
        throw new Error(`Alert request failed with status ${res.status}`);
      }
      const data: AlertResponse = await res.json();
      setAlertData(data);
    } catch (error) {
      console.error('Error fetching Suffolk alert:', error);
      setAlertData(null);
    }
  };

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setFileName(file.name);

    try {
      const { classes, studentFirstName } = await parseScheduleFile(file);
      setStudentFirstName(studentFirstName);
      const blocks: ScheduleBlock[] = [];

      classes.forEach((classData, index) => {
        const meetingPatterns = parseMeetingPattern(classData.meetingPatterns);
        const color = getColorForClass(index);

        meetingPatterns.forEach((pattern, patternIndex) => {
          blocks.push({
            id: `${index}-${patternIndex}`,
            classData,
            meetingPattern: pattern,
            color,
          });
        });
      });

      setScheduleBlocks(blocks);
      await fetchAlert();
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Error parsing file. Please make sure it\'s a valid schedule file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setScheduleBlocks([]);
    setFileName('');
    setStudentFirstName(null);
    setAlertData(null);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-start justify-between gap-8">
          {scheduleBlocks.length === 0 && (
            <div className="my-8 flex items-start justify-between gap-8 w-full">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Upload Schedule
                </h1>
              </div>
              <div className="flex flex-col items-center justify-center">
                <FileUpload onFileSelect={handleFileSelect} />
                {/* {isLoading && (
                  <p className="mt-4 text-muted-foreground">
                    Loading schedule...
                  </p>
                )} */}
              </div>
            </div>
          )}
        </header>

        {scheduleBlocks.length === 0 && (
          <div className="bg-card rounded-lg p-8">
            <Image src="/tutorial.png" alt="Tutorial on exporting schedule from Workday" width={1920} height={1080} />
          </div>
        )}

        {scheduleBlocks.length !== 0 && (
          <div>
            <div className="my-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {getGreeting()}, {studentFirstName || 'Student'}!
                </h1>
                <a className="text-muted-foreground hover:text-primary hover:underline" href="/settings">
                  Turn off personalized greetings here.
                </a>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-primary text-secondary-foreground rounded-lg hover:bg-primary/80 transition-all"
                >
                  Change Schedule
                </button>
              </div>
            </div>

            {alertData?.has_alert && alertData.message && (
              <div className="mb-6 bg-red-500 border-2 border-white text-white rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-semibold uppercase tracking-wide">Emergency Alert from Suffolk University</p>
                <X className="cursor-pointer flex-shrink-0" size={20} onClick={() => setAlertData(null)} />
              </div>
              {alertData.date && <p className="text-sm text-white">{alertData.date}</p>}
              <p className="mt-2">{alertData.message}</p>
              </div>
            )}

            {/* <div className="mb-6 flex items-center justify-between bg-card p-4 rounded-lg border border-border">
              <div>
                <p className="text-sm text-muted-foreground">Current file:</p>
                <p className="font-semibold text-card-foreground">{fileName}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {scheduleBlocks.length} class session{scheduleBlocks.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex gap-3">
                {isAuthenticated && (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Save Schedule
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-primary text-secondary-foreground rounded-lg hover:bg-primary/80 transition-all"
                >
                  Upload Different File
                </button>
              </div>
            </div> */}

            {/* Live Status Component */}
            <LiveStatus
              scheduleBlocks={scheduleBlocks}
              onCurrentTimeUpdate={setCurrentTimeMinutes}
              onCurrentClassUpdate={setCurrentClassId}
            />

            <div className="bg-card p-6 rounded-lg border border-border">
              <WeeklySchedule
                scheduleBlocks={scheduleBlocks}
                currentTimeMinutes={currentTimeMinutes}
                currentClassId={currentClassId}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
