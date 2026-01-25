'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import WeeklySchedule from '@/components/WeeklySchedule';
import LiveStatus from '@/components/LiveStatus';
import { parseScheduleFile, parseMeetingPattern } from '@/lib/funcs/parseExcel';
import { ScheduleBlock } from '@/lib/types/schedule';
import { getColorForClass } from '@/lib/funcs/colors';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function UploadPage() {
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState<number | null>(null);
  const [currentClassId, setCurrentClassId] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setFileName(file.name);
    
    try {
      const classes = await parseScheduleFile(file);
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
  };

  const handleSave = () => {
    // Simulate save - no backend yet
    alert('Schedule saved successfully! (This is a UI demo - no actual save occurred)');
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Upload Schedule
          </h1>
          <p className="text-muted-foreground">
            Upload your .xlsx schedule file to view your weekly class schedule
          </p>
        </header>

        {scheduleBlocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FileUpload onFileSelect={handleFileSelect} />
            {isLoading && (
              <p className="mt-4 text-muted-foreground">
                Loading schedule...
              </p>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center justify-between bg-card p-4 rounded-lg border border-border">
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
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Upload Different File
                </button>
              </div>
            </div>

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
