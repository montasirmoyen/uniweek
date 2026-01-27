'use client';

import { useState, useEffect } from 'react';
import { ScheduleBlock } from '@/lib/types/schedule';
import { parseTime } from '@/lib/funcs/timeUtils';
import { Pencil, Hourglass, PartyPopper, Candy } from 'lucide-react';

interface LiveStatusProps {
    scheduleBlocks: ScheduleBlock[];
    onCurrentTimeUpdate?: (currentMinutes: number | null) => void;
    onCurrentClassUpdate?: (classId: string | null) => void;
}

interface ClassInfo {
    block: ScheduleBlock;
    startMinutes: number;
    endMinutes: number;
}

export default function LiveStatus({
    scheduleBlocks,
    onCurrentTimeUpdate,
    onCurrentClassUpdate
}: LiveStatusProps) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Update every second
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Get current day and time
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = dayNames[currentTime.getDay()];
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    // Get today's classes
    const todayClasses: ClassInfo[] = scheduleBlocks
        .filter(block => block.meetingPattern.daysMeeting.includes(currentDay as any))
        .map(block => ({
            block,
            startMinutes: parseTime(block.meetingPattern.startTime),
            endMinutes: parseTime(block.meetingPattern.endTime),
        }))
        .sort((a, b) => a.startMinutes - b.startMinutes);

    // Notify parent of current time (for timeline indicator)
    useEffect(() => {
        if (onCurrentTimeUpdate) {
            // Only show timeline if we have classes today and time is in reasonable range (6 AM - 12 AM)
            if (todayClasses.length > 0 && currentMinutes >= 360 && currentMinutes < 1440) {
                onCurrentTimeUpdate(currentMinutes);
            } else {
                onCurrentTimeUpdate(null);
            }
        }
    }, [currentMinutes, todayClasses.length, onCurrentTimeUpdate]);

    // Find current class
    const currentClass = todayClasses.find(
        ({ startMinutes, endMinutes }) =>
            currentMinutes >= startMinutes && currentMinutes < endMinutes
    );

    // Get current class ID for stable comparison
    const currentClassId = currentClass ? currentClass.block.id : null;

    // Notify parent of current class (for highlighting)
    useEffect(() => {
        if (onCurrentClassUpdate) {
            onCurrentClassUpdate(currentClassId);
        }
    }, [currentClassId, onCurrentClassUpdate]);

    // Find next class
    const upcomingClasses = todayClasses.filter(
        ({ startMinutes }) => startMinutes > currentMinutes
    );
    const nextClass = upcomingClasses.length > 0 ? upcomingClasses[0] : null;

    // Calculate minutes until next class
    const minutesUntilNext = nextClass ? nextClass.startMinutes - currentMinutes : null;

    // Count remaining classes
    const remainingClasses = upcomingClasses.length;

    // Determine status message
    const getStatusData = (): [string, React.ReactNode] | string => {
        // Weekend or no classes
        if (todayClasses.length === 0) {
            return ["You have no classes today", <PartyPopper />];
        }

        // Currently in class
        if (currentClass) {
            const courseName = extractCourseCode(currentClass.block.classData.courseName);
            return [`You're currently in ${courseName}`, <Pencil />];
        }

        // All classes done
        if (remainingClasses === 0) {
            return ["You've finished all of your classes", <PartyPopper />];
        }

        // Next class is starting now (within 5 minutes)
        if (minutesUntilNext !== null && minutesUntilNext <= 5) {
            return ["Your next class is starting shortly", <Hourglass />];
        }

        // Free time before next class
        if (nextClass) {
            const nextStartTime = formatTime(nextClass.startMinutes);
            return [`Free until ${nextStartTime}`, <Candy />];
        }

        return ["No classes scheduled", null]; // Fallback
    };

    // Get secondary info
    const getSecondaryInfo = (): string | null => {
        // Show class count only if there are classes today
        if (todayClasses.length > 0 && (currentDay !== 'Saturday' && currentDay !== 'Sunday')) {
            return `Today you have ${todayClasses.length} class${todayClasses.length !== 1 ? 'es' : ''}, ${remainingClasses} left`;
        }

        // Show countdown to next class if applicable
        if (minutesUntilNext !== null && minutesUntilNext > 1 && !currentClass) {
            if (minutesUntilNext < 60) {
                return `Next class in ${minutesUntilNext} minute${minutesUntilNext !== 1 ? 's' : ''}`;
            } else {
                const hours = Math.floor(minutesUntilNext / 60);
                const mins = minutesUntilNext % 60;
                if (mins === 0) {
                    return `Next class in ${hours} hour${hours !== 1 ? 's' : ''}`;
                }
                return `Next class in ${hours}h ${mins}m`;
            }
        }

        return null;
    };

    // Recalculate status data on every render (every second)
    const statusData = getStatusData();
    const secondaryInfo = getSecondaryInfo();

    // Calculate status color based on current state
    const statusColor = (() => {
        if (todayClasses.length === 0) return 'text-green-300';
        if (currentClass) return 'text-yellow-200';
        if (remainingClasses === 0 && todayClasses.length > 0) return 'text-green-300';
        if (minutesUntilNext !== null && minutesUntilNext <= 5) return 'text-orange-400';
        if (minutesUntilNext !== null && minutesUntilNext <= 15) return 'text-teal-300';
        return 'text-white';
    })();

    return (
        <div className="bg-card border border-border rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        {/* Live indicator */}
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Live
                            </span>
                        </div>

                        {Array.isArray(statusData) && statusData[1] != null && (
                            <div className={statusColor}>{statusData[1]}</div>
                        )}

                        {/* Status message */}
                        <div className={`text-sm font-bold ${statusColor}`}>
                            {Array.isArray(statusData) ? statusData[0] : statusData}
                        </div>
                    </div>

                    {/* Secondary info */}
                    {secondaryInfo && (
                        <div className="text-xs text-muted-foreground mt-2">
                            {secondaryInfo}
                        </div>
                    )}
                </div>

                {/* Current time */}
                <div className="text-right">
                    <div className="text-3xl font-bold tabular-nums">
                        {currentTime.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {currentTime.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper functions
function extractCourseCode(courseName: string): string {
    const match = courseName.match(/^([A-Z]+\s+\d+)/);
    return match ? match[1] : courseName.split('-')[0].trim();
}

function formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHour}:${mins.toString().padStart(2, '0')} ${period}`;
}
