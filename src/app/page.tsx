'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import WeeklySchedule from '@/components/WeeklySchedule';
import { parseScheduleFile, parseMeetingPattern } from '@/lib/parseExcel';
import { ClassData, ScheduleBlock } from '@/lib/types/schedule';
import { getColorForClass } from '@/lib/colors';

export default function Home() {
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('');

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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Weekly Schedule Viewer
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Upload your .xlsx schedule file to view your weekly class schedule
          </p>
        </header>

        {scheduleBlocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FileUpload onFileSelect={handleFileSelect} />
            {isLoading && (
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                Loading schedule...
              </p>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-lg shadow">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Current file:</p>
                <p className="font-semibold text-zinc-900 dark:text-zinc-50">{fileName}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  {scheduleBlocks.length} class session{scheduleBlocks.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Upload Different File
              </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
              <WeeklySchedule scheduleBlocks={scheduleBlocks} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
