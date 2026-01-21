'use client';

import { useState } from 'react';
import { ScheduleBlock, DAYS_OF_WEEK } from '@/lib/types/schedule';
import { parseTime } from '@/lib/timeUtils';
import ClassDetailModal from './ClassDetailModal';

interface WeeklyScheduleProps {
  scheduleBlocks: ScheduleBlock[];
}

export default function WeeklySchedule({ scheduleBlocks }: WeeklyScheduleProps) {
  const [selectedBlock, setSelectedBlock] = useState<ScheduleBlock | null>(null);

  // Calculate time range
  const timeSlots = generateTimeSlots();
  // Layout constants
  const HOUR_HEIGHT = 60; // px per hour row
  const BORDER_PX = 1; // px border-bottom on each time row

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1000px]">
        {/* Header with days */}
        <div className="grid grid-cols-8 border-b border-zinc-300 dark:border-zinc-700">
          <div className="p-3 font-semibold text-sm text-zinc-700 dark:text-zinc-300 border-r border-zinc-300 dark:border-zinc-700">
            Time
          </div>
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="p-3 font-semibold text-sm text-center text-zinc-900 dark:text-zinc-100 border-r last:border-r-0 border-zinc-300 dark:border-zinc-700"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Schedule grid */}
        <div className="relative">
          {/* Time slots */}
          {timeSlots.map((time, idx) => (
            <div key={time} className="grid grid-cols-8 border-b border-zinc-200 dark:border-zinc-800">
              <div className="p-2 text-xs text-zinc-600 dark:text-zinc-400 border-r border-zinc-200 dark:border-zinc-800">
                {time}
              </div>
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={`${day}-${time}`}
                  className="border-r last:border-r-0 border-zinc-200 dark:border-zinc-800 min-h-[60px] relative"
                >
                  {/* Class blocks will be absolutely positioned */}
                </div>
              ))}
            </div>
          ))}

          {/* Absolute positioned class blocks */}
          {scheduleBlocks.map((block) =>
            block.meetingPattern.days.map((day) => {
              const dayIndex = DAYS_OF_WEEK.indexOf(day as any);
              if (dayIndex === -1) return null;

              const startMinutes = parseTime(block.meetingPattern.startTime);
              const endMinutes = parseTime(block.meetingPattern.endTime);
              const duration = endMinutes - startMinutes;

              // Calculate position (8 AM = 480 minutes). Account for row borders so blocks align with hour lines.
              const startOffset = startMinutes - 480;
              const fullHoursSinceStart = Math.floor(startOffset / 60);
              const minutesIntoHour = startOffset % 60;
              const top = fullHoursSinceStart * (HOUR_HEIGHT + BORDER_PX) + (minutesIntoHour / 60) * HOUR_HEIGHT;
              const height = (duration / 60) * HOUR_HEIGHT;

              // Calculate left position (column width is 1/8 of container)
              const left = `${((dayIndex + 1) / 8) * 100}%`;
              const width = `${(1 / 8) * 100}%`;

              return (
                <div
                  key={`${block.id}-${day}`}
                  className={`absolute ${block.color} text-white p-2 shadow-md cursor-pointer hover:opacity-90 transition-opacity overflow-hidden`}
                  style={{
                    top: `${top}px`,
                    left,
                    width,
                    height: `${height}px`,
                    minHeight: '40px',
                  }}
                  onClick={() => setSelectedBlock(block)}
                >
                  <div className="text-xs font-semibold truncate">
                    {extractCourseCode(block.classData.courseName)}
                  </div>
                  <div className="text-xs truncate">
                    {block.meetingPattern.location}
                  </div>
                  <div className="text-xs">
                    {block.meetingPattern.startTime}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedBlock && (
        <ClassDetailModal
          classData={selectedBlock.classData}
          onClose={() => setSelectedBlock(null)}
        />
      )}
    </div>
  );
}

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 8; hour <= 21; hour++) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    slots.push(`${displayHour}:00 ${period}`);
  }
  return slots;
}

function extractCourseCode(courseName: string): string {
  // Extract "MATH 285" from "MATH 285 - Discrete Mathematics II"
  const match = courseName.match(/^([A-Z]+\s+\d+)/);
  return match ? match[1] : courseName.split('-')[0].trim();
}
