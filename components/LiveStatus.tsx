"use client";

import { useEffect, useMemo, useState } from "react";
import { Bed, Clock3, PartyPopper, Pencil, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/contexts/AuthContext";
import { markAttendance, subscribeToAttendanceCount, unmarkAttendance } from "@/lib/firebase/db";
import type { ClassInstance } from "@/lib/firebase/types";
import { parseTime } from "@/lib/funcs/timeUtils";
import type { ScheduleBlock } from "@/lib/types/schedule";

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

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function LiveStatus({ scheduleBlocks, onCurrentTimeUpdate, onCurrentClassUpdate }: LiveStatusProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceCount, setAttendanceCount] = useState<number | null>(null);
  const [markedByClassId, setMarkedByClassId] = useState<Record<string, boolean>>({});
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const currentDay = DAY_NAMES[currentTime.getDay()];
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  const todayClasses = useMemo<ClassInfo[]>(() => {
    return scheduleBlocks
      .filter((block) => block.meetingPattern.daysMeeting.includes(currentDay as never))
      .map((block) => ({
        block,
        startMinutes: parseTime(block.meetingPattern.startTime),
        endMinutes: parseTime(block.meetingPattern.endTime),
      }))
      .sort((a, b) => a.startMinutes - b.startMinutes);
  }, [scheduleBlocks, currentDay]);

  const currentClass = todayClasses.find(
    ({ startMinutes, endMinutes }) => currentMinutes >= startMinutes && currentMinutes < endMinutes
  );

  const upcomingClasses = todayClasses.filter(({ startMinutes }) => startMinutes > currentMinutes);
  const nextClass = upcomingClasses[0] ?? null;
  const minutesUntilNext = nextClass ? nextClass.startMinutes - currentMinutes : null;

  useEffect(() => {
    if (!onCurrentTimeUpdate) return;
    if (todayClasses.length > 0 && currentMinutes >= 360 && currentMinutes < 1440) {
      onCurrentTimeUpdate(currentMinutes);
    } else {
      onCurrentTimeUpdate(null);
    }
  }, [onCurrentTimeUpdate, todayClasses.length, currentMinutes]);

  useEffect(() => {
    onCurrentClassUpdate?.(currentClass?.block.id ?? null);
  }, [onCurrentClassUpdate, currentClass?.block.id]);

  useEffect(() => {
    if (!currentClass) return;

    const classInstance: ClassInstance = {
      courseName: currentClass.block.classData.courseName,
      section: currentClass.block.classData.section,
      dayOfWeek: currentDay,
      startTime: currentClass.block.meetingPattern.startTime,
      endTime: currentClass.block.meetingPattern.endTime,
      location: currentClass.block.meetingPattern.location,
      createdAt: Date.now(),
    };

    const unsubscribe = subscribeToAttendanceCount(classInstance, setAttendanceCount);
    return () => unsubscribe();
  }, [currentClass, currentDay]);

  const toggleAttendance = async () => {
    if (!isAuthenticated || !user || !currentClass) return;

    const classId = currentClass.block.id;

    const classInstance: ClassInstance = {
      courseName: currentClass.block.classData.courseName,
      section: currentClass.block.classData.section,
      dayOfWeek: currentDay,
      startTime: currentClass.block.meetingPattern.startTime,
      endTime: currentClass.block.meetingPattern.endTime,
      location: currentClass.block.meetingPattern.location,
      createdAt: Date.now(),
    };

    try {
      if (isMarked) {
        await unmarkAttendance(user.id, classInstance);
        setMarkedByClassId((prev) => ({ ...prev, [classId]: false }));
      } else {
        await markAttendance(user.id, classInstance, user.name);
        setMarkedByClassId((prev) => ({ ...prev, [classId]: true }));
      }
    } catch {
      window.alert("Could not update attendance. Please try again.");
    }
  };

  const status = getStatus(todayClasses.length, !!currentClass, minutesUntilNext, nextClass?.startMinutes ?? null);
  const isMarked = currentClass ? !!markedByClassId[currentClass.block.id] : false;

  return (
    <Card className="mb-5">
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <span className="size-2 rounded-full bg-red-500 animate-pulse" /> Live Status
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              {status.icon}
              <span>{status.text}</span>
            </div>
            {status.secondary && <p className="mt-1 text-xs text-muted-foreground">{status.secondary}</p>}
          </div>

          <div className="text-right">
            <p className="text-xl font-semibold tabular-nums">
              {currentTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" })}
            </p>
            <p className="text-xs text-muted-foreground">
              {currentTime.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </p>
            {isAuthenticated && currentClass && (
              <div className="mt-2 flex items-center justify-end gap-2">
                {attendanceCount !== null && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="size-3.5" />
                    {attendanceCount}
                  </span>
                )}
                <Button size="xs" variant={isMarked ? "secondary" : "outline"} onClick={toggleAttendance}>
                  {isMarked ? "Marked" : "Mark"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getStatus(todayClassCount: number, inClass: boolean, minutesUntilNext: number | null, nextStart: number | null) {
  if (todayClassCount === 0) {
    return {
      text: "No classes today",
      icon: <Bed className="size-4" />,
      secondary: "Enjoy your day.",
    };
  }

  if (inClass) {
    return {
      text: "You are currently in class",
      icon: <Pencil className="size-4" />,
      secondary: "Stay focused.",
    };
  }

  if (minutesUntilNext === null) {
    return {
      text: "All classes for today are complete",
      icon: <PartyPopper className="size-4" />,
      secondary: "Great work.",
    };
  }

  if (minutesUntilNext <= 30) {
    return {
      text: `Next class in ${minutesUntilNext} min`,
      icon: <Clock3 className="size-4" />,
      secondary: "Time to head over.",
    };
  }

  return {
    text: `Free time until ${formatTime(nextStart ?? 0)}`,
    icon: <Clock3 className="size-4" />,
    secondary: "Use the gap panel in schedule for nearby spots.",
  };
}

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${mins.toString().padStart(2, "0")} ${period}`;
}
