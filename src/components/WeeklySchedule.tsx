'use client';

import { useState } from 'react';
import { ScheduleBlock, DAYS_OF_WEEK } from '@/lib/types/schedule';
import { parseTime } from '@/lib/funcs/timeUtils';
import ClassDetailSidePanel from './ClassDetailSidePanel';
import GapDetailSidePanel from './GapDetailSidePanel';
import { UNIVERSITIES } from '@/lib/types/universities';
import Image from 'next/image';

interface WeeklyScheduleProps {
  scheduleBlocks: ScheduleBlock[];
}

export default function WeeklySchedule({ scheduleBlocks }: WeeklyScheduleProps) {
  const [selectedBlock, setSelectedBlock] = useState<ScheduleBlock | null>(null);
  const [showGapPanel, setShowGapPanel] = useState(false);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  const university = UNIVERSITIES[0]; // Suffolk University

  // Extract building name from location
  const extractBuilding = (location: string): string => {
    return location.split(' ')[0].toLowerCase();
  };

  // Find the first and last class for each day to detect gaps
  const getDayBounds = (day: string) => {
    const dayBlocks = scheduleBlocks.filter(block => 
      block.meetingPattern.days.includes(day as any)
    );
    
    if (dayBlocks.length === 0) return null;
    
    const times = dayBlocks.map(block => ({
      start: parseTime(block.meetingPattern.startTime),
      end: parseTime(block.meetingPattern.endTime),
    }));
    
    const firstClassStart = Math.min(...times.map(t => t.start));
    const lastClassEnd = Math.max(...times.map(t => t.end));
    
    return { firstClassStart, lastClassEnd };
  };

  // Calculate time range
  const timeSlots = generateTimeSlots();
  // Layout constants
  const HOUR_HEIGHT = 60; // px per hour row
  const BORDER_PX = 1; // px border-bottom on each time row
  const SCHEDULE_START = 480; // 8 AM in minutes

  return (
    <div className="w-full overflow-x-auto">
      {/* Weather Section */}
      <div className="mb-6 p-4 bg-card rounded-lg border border-border">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Boston, MA</h3>
            <p className="text-3xl font-bold text-card-foreground">45°F</p>
          </div>
          <div className="text-muted-foreground text-sm">
            <p>Partly Cloudy</p>
            <p>H: 52° L: 38°</p>
          </div>
        </div>
      </div>

      <div className="min-w-[1000px]">
        {/* Header with days */}
        <div className="grid grid-cols-8 border-b border-border">
          <div className="p-3 font-semibold text-sm text-muted-foreground border-r border-border">
            Time
          </div>
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="p-3 font-semibold text-sm text-center text-card-foreground border-r last:border-r-0 border-border"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Schedule grid */}
        <div className="relative">
          {/* Time slots */}
          {timeSlots.map((time, idx) => (
            <div key={time} className="grid grid-cols-8 border-b border-border">
              <div className="p-2 text-xs text-muted-foreground border-r border-border">
                {time}
              </div>
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={`${day}-${time}`}
                  className="border-r last:border-r-0 border-border min-h-[60px] relative"
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
              const startOffset = startMinutes - SCHEDULE_START;
              const fullHoursSinceStart = Math.floor(startOffset / 60);
              const minutesIntoHour = startOffset % 60;
              const top = fullHoursSinceStart * (HOUR_HEIGHT + BORDER_PX) + (minutesIntoHour / 60) * HOUR_HEIGHT;
              const height = (duration / 60) * HOUR_HEIGHT;

              // Calculate left position (column width is 1/8 of container)
              const left = `${((dayIndex + 1) / 8) * 100}%`;
              const width = `${(1 / 8) * 100}%`;

              const buildingKey = extractBuilding(block.meetingPattern.location);
              const building = university.buildings?.[buildingKey];
              const buildingImage = building?.images?.[0];
              const isHovered = hoveredBlock === `${block.id}-${day}`;

              return (
                <div
                  key={`${block.id}-${day}`}
                  className={`absolute ${block.color} text-white shadow-md cursor-pointer transition-all overflow-hidden group`}
                  style={{
                    top: `${top}px`,
                    left,
                    width,
                    height: `${height}px`,
                    minHeight: '40px',
                  }}
                  onClick={() => setSelectedBlock(block)}
                  onMouseEnter={() => setHoveredBlock(`${block.id}-${day}`)}
                  onMouseLeave={() => setHoveredBlock(null)}
                >
                  {/* Building Background Image */}
                  {buildingImage && (
                    <div className="absolute inset-0 opacity-50">
                      <Image
                        src={buildingImage}
                        alt={buildingKey}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="relative z-10 p-2 h-full flex flex-col">
                    <div className="text-xs font-semibold truncate">
                      {extractCourseCode(block.classData.courseName)}
                    </div>
                    <div className="text-xs truncate">
                      {block.meetingPattern.location}
                    </div>
                    <div className="text-xs">
                      {block.meetingPattern.startTime}
                    </div>

                    {/* Hover Tooltip */}
                    {isHovered && height >= 60 && (
                      <div className="absolute inset-0 bg-black/90 p-3 flex flex-col justify-center">
                        <p className="text-sm font-semibold mb-1">
                          {extractCourseCode(block.classData.courseName)}
                        </p>
                        <p className="text-xs opacity-90 mb-1">
                          {block.classData.instructor}
                        </p>
                        <p className="text-xs opacity-75">
                          {block.meetingPattern.startTime} - {block.meetingPattern.endTime}
                        </p>
                        <p className="text-xs opacity-75">
                          {block.meetingPattern.location}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Clickable gaps before first class and after last class */}
          {DAYS_OF_WEEK.map((day, dayIndex) => {
            const bounds = getDayBounds(day);
            if (!bounds) return null;

            const { firstClassStart, lastClassEnd } = bounds;
            const left = `${((dayIndex + 1) / 8) * 100}%`;
            const width = `${(1 / 8) * 100}%`;

            // Gap before first class
            const topGapHeight = ((firstClassStart - SCHEDULE_START) / 60) * HOUR_HEIGHT;
            
            // Gap after last class (until 9 PM = 1260 minutes)
            const SCHEDULE_END = 1260; // 9 PM
            const bottomGapStart = ((lastClassEnd - SCHEDULE_START) / 60) * HOUR_HEIGHT;
            const bottomGapHeight = ((SCHEDULE_END - lastClassEnd) / 60) * HOUR_HEIGHT;

            return (
              <div key={`gaps-${day}`}>
                {/* Top gap */}
                {topGapHeight > 30 && (
                  <div
                    className="absolute bg-accent/20 hover:bg-accent/40 cursor-pointer border border-dashed border-accent transition-colors flex items-center justify-center"
                    style={{
                      top: '0px',
                      left,
                      width,
                      height: `${topGapHeight}px`,
                    }}
                    onClick={() => setShowGapPanel(true)}
                  >
                    <p className="text-xs text-muted-foreground opacity-0 hover:opacity-100 transition-opacity">
                      Free Time
                    </p>
                  </div>
                )}

                {/* Bottom gap */}
                {bottomGapHeight > 30 && (
                  <div
                    className="absolute bg-accent/20 hover:bg-accent/40 cursor-pointer border border-dashed border-accent transition-colors flex items-center justify-center"
                    style={{
                      top: `${bottomGapStart}px`,
                      left,
                      width,
                      height: `${bottomGapHeight}px`,
                    }}
                    onClick={() => setShowGapPanel(true)}
                  >
                    <p className="text-xs text-muted-foreground opacity-0 hover:opacity-100 transition-opacity">
                      Free Time
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedBlock && (
        <ClassDetailSidePanel
          block={selectedBlock}
          onClose={() => setSelectedBlock(null)}
        />
      )}

      {showGapPanel && (
        <GapDetailSidePanel onClose={() => setShowGapPanel(false)} />
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
