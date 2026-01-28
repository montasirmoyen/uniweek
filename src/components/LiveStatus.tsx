'use client';

import { useState, useEffect } from 'react';
import { ScheduleBlock } from '@/lib/types/schedule';
import { parseTime } from '@/lib/funcs/timeUtils';
import { Pencil, Hourglass, PartyPopper, Candy, Sofa, Users, Bed } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { markAttendance, unmarkAttendance, subscribeToAttendanceCount } from '@/lib/firebase/db';
import type { ClassInstance } from '@/lib/firebase/types';

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
    const [attendanceCount, setAttendanceCount] = useState<number | null>(null);
    const [isMarked, setIsMarked] = useState(false);
    const { isAuthenticated, user } = useAuth();

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

    // Subscribe to attendance count for current class
    useEffect(() => {
        if (!currentClass) {
            setAttendanceCount(null);
            return;
        }

        const classInstance: ClassInstance = {
            courseName: currentClass.block.classData.courseName,
            section: currentClass.block.classData.section,
            dayOfWeek: dayNames[currentTime.getDay()],
            startTime: currentClass.block.meetingPattern.startTime,
            endTime: currentClass.block.meetingPattern.endTime,
            location: currentClass.block.meetingPattern.location,
            createdAt: Date.now(),
        };

        const unsubscribe = subscribeToAttendanceCount(classInstance, setAttendanceCount);
        return () => unsubscribe();
    }, [currentClass, dayNames, currentTime]);

    // Handle attendance marking
    const handleToggleAttendance = async () => {
        if (!isAuthenticated || !user || !currentClass) return;

        const classInstance: ClassInstance = {
            courseName: currentClass.block.classData.courseName,
            section: currentClass.block.classData.section,
            dayOfWeek: dayNames[currentTime.getDay()],
            startTime: currentClass.block.meetingPattern.startTime,
            endTime: currentClass.block.meetingPattern.endTime,
            location: currentClass.block.meetingPattern.location,
            createdAt: Date.now(),
        };

        try {
            if (isMarked) {
                await unmarkAttendance(user.id, classInstance);
                setIsMarked(false);
            } else {
                await markAttendance(user.id, classInstance, user.name);
                setIsMarked(true);
            }
        } catch (error) {
            console.error('Error toggling attendance:', error);
        }
    };

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
            return ["You have no classes today", <Bed />];
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

        // Upcoming class logic
        if (nextClass && minutesUntilNext !== null) {
            const isBeforeFirstClass = todayClasses.length === remainingClasses;
            const nextStartTime = formatTime(nextClass.startMinutes);

            // Within the hour -> countdown
            if (minutesUntilNext <= 30) {
                return [`Class starts in ${minutesUntilNext} minutes`, <Hourglass />];
            }

            // Before first class of the day
            if (isBeforeFirstClass) {
                return [`First class starts ${nextStartTime}`, <Sofa />];
            }

            // Between classes with a longer gap
            return [`Free time until next class at ${nextStartTime}`, <Candy />];
        }

        return ["No classes scheduled", null]; // Fallback
    };

    // Get secondary info
    const getSecondaryInfo = (): string | null => {
        // Show class count only if there are classes today
        if (todayClasses.length > 0 && (currentDay !== 'Saturday' && currentDay !== 'Sunday')) {
            return `You have ${remainingClasses} class${remainingClasses !== 1 ? 'es' : ''} remaining today, ${todayClasses.length} in total`;
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
        if (todayClasses.length === 0) return 'text-green-300'; // nothing today
        if (currentClass) return 'text-yellow-200'; // currently in class
        if (remainingClasses === 0 && todayClasses.length > 0) return 'text-green-300'; // day done

        if (minutesUntilNext !== null) {
            if (minutesUntilNext <= 5) return 'text-orange-400'; // imminent
            if (minutesUntilNext <= 30) return 'text-teal-300'; // upcoming soon (matches countdown window)
        }

        return 'text-pink-300'; // default for longer gaps/free time
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
                <div className="text-right flex flex-col items-end gap-3">
                    <div>
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

                    {/* Attendance marker for current class */}
                    {isAuthenticated && currentClass && (
                        <div className="flex items-center gap-2">
                            {attendanceCount !== null && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Users className="w-4 h-4" />
                                    <span>{attendanceCount}</span>
                                </div>
                            )}
                            <button
                                onClick={handleToggleAttendance}
                                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                    isMarked
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                }`}
                            >
                                {isMarked ? 'Marked' : 'Mark'}
                            </button>
                        </div>
                    )}
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
