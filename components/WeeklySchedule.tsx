"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Building2, Clock3, Navigation, TrainFront, UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { parseTime } from "@/lib/funcs/timeUtils";
import { simplifyBuildingName, stripRoom } from "@/lib/funcs/buildings";
import { getDistance } from "@/lib/funcs/distance";
import type { ScheduleBlock } from "@/lib/types/schedule";
import { DAYS_OF_WEEK } from "@/lib/types/schedule";
import { MBTA_STATIONS, PARKING_GARAGES, UNIVERSITIES } from "@/lib/types/universities";

interface WeeklyScheduleProps {
  scheduleBlocks: ScheduleBlock[];
  currentTimeMinutes?: number | null;
  currentClassId?: string | null;
}

interface GapInfo {
  day: string;
  start: number;
  end: number;
  buildingKey?: string;
}

const HOUR_HEIGHT = 64;
const SCHEDULE_START = 6 * 60;

export default function WeeklySchedule({ scheduleBlocks, currentClassId }: WeeklyScheduleProps) {
  const [selectedBlock, setSelectedBlock] = useState<ScheduleBlock | null>(null);
  const [selectedGap, setSelectedGap] = useState<GapInfo | null>(null);

  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = 6; hour < 24; hour += 1) {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      slots.push(`${displayHour}:00 ${period}`);
    }
    return slots;
  }, []);

  const blocksWithLayout = useMemo(() => {
    return scheduleBlocks.flatMap((block) => {
      const start = parseTime(block.meetingPattern.startTime);
      const end = parseTime(block.meetingPattern.endTime);
      const top = ((start - SCHEDULE_START) / 60) * HOUR_HEIGHT;
      const height = Math.max(((end - start) / 60) * HOUR_HEIGHT, 44);

      return block.meetingPattern.daysMeeting
        .map((day) => {
          const dayIndex = DAYS_OF_WEEK.indexOf(day as never);
          if (dayIndex < 0) return null;
          return {
            key: `${block.id}-${day}`,
            block,
            day,
            dayIndex,
            top,
            height,
            start,
            end,
          };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null);
    });
  }, [scheduleBlocks]);

  const gapRegions = useMemo<GapInfo[]>(() => {
    return DAYS_OF_WEEK.flatMap((day) => {
      const dayBlocks = blocksWithLayout
        .filter((item) => item.day === day)
        .sort((a, b) => a.start - b.start);

      if (!dayBlocks.length) return [];

      const gaps: GapInfo[] = [];
      for (let i = 0; i < dayBlocks.length - 1; i += 1) {
        const current = dayBlocks[i];
        const next = dayBlocks[i + 1];
        if (next.start > current.end) {
          gaps.push({
            day,
            start: current.end,
            end: next.start,
            buildingKey: extractBuildingKey(current.block.meetingPattern.location),
          });
        }
      }

      return gaps;
    });
  }, [blocksWithLayout]);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[980px] rounded-xl border border-border bg-card">
        <div className="grid grid-cols-8 border-b border-border bg-muted/50">
          <div className="border-r border-border p-3 text-sm font-semibold text-muted-foreground">Time</div>
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="border-r border-border p-3 text-center text-sm font-semibold text-card-foreground last:border-r-0">
              {day.slice(0, 3)}
            </div>
          ))}
        </div>

        <div className="relative">
          {timeSlots.map((slot) => (
            <div key={slot} className="grid grid-cols-8 border-b border-border last:border-b-0">
              <div className="border-r border-border p-2 text-xs text-muted-foreground">{slot}</div>
              {DAYS_OF_WEEK.map((day) => (
                <div key={`${day}-${slot}`} className="h-16 border-r border-border last:border-r-0" />
              ))}
            </div>
          ))}

          {blocksWithLayout.map((item) => {
            const left = `${((item.dayIndex + 1) / 8) * 100}%`;
            const width = `${100 / 8}%`;
            const isCurrentClass = currentClassId === item.block.id;
            const building = getBuildingInfo(item.block.meetingPattern.location);

            return (
              <button
                type="button"
                key={item.key}
                className="absolute z-20 overflow-hidden rounded-md border border-white/20 text-left text-white shadow-md transition hover:scale-[1.01]"
                style={{
                  left,
                  top: `${item.top}px`,
                  width,
                  height: `${item.height}px`,
                  background: colorToGradient(item.block.color),
                  boxShadow: isCurrentClass ? "0 0 0 2px hsl(var(--ring))" : undefined,
                }}
                onClick={() => setSelectedBlock(item.block)}
              >
                {building?.images?.[0] && (
                  <Image
                    src={building.images[0]}
                    alt={building.fullName}
                    fill
                    className="object-cover opacity-35"
                  />
                )}
                <div className="relative z-10 flex h-full flex-col justify-center bg-black/35 p-2 text-xs">
                  <span className="font-semibold">{extractCourseCode(item.block.classData.courseName)}</span>
                  <span>{simplifyBuildingName(item.block.meetingPattern.location)}</span>
                  <span>{item.block.meetingPattern.startTime} - {item.block.meetingPattern.endTime}</span>
                </div>
              </button>
            );
          })}

          {gapRegions.map((gap) => {
            const dayIndex = DAYS_OF_WEEK.indexOf(gap.day as never);
            const left = `${((dayIndex + 1) / 8) * 100}%`;
            const width = `${100 / 8}%`;
            const top = ((gap.start - SCHEDULE_START) / 60) * HOUR_HEIGHT;
            const height = Math.max(((gap.end - gap.start) / 60) * HOUR_HEIGHT, 24);

            if (height < 36) return null;

            return (
              <button
                type="button"
                key={`${gap.day}-${gap.start}-${gap.end}`}
                className="absolute z-10 flex items-center justify-center bg-accent/35 text-[11px] text-muted-foreground transition hover:bg-accent/55"
                style={{ left, width, top: `${top}px`, height: `${height}px` }}
                onClick={() => setSelectedGap(gap)}
              >
                Free Time
              </button>
            );
          })}
        </div>
      </div>

      <ClassDetailPanel block={selectedBlock} onClose={() => setSelectedBlock(null)} />
      <GapDetailPanel gap={selectedGap} onClose={() => setSelectedGap(null)} />
    </div>
  );
}

function ClassDetailPanel({ block, onClose }: { block: ScheduleBlock | null; onClose: () => void }) {
  if (!block) return null;

  const building = getBuildingInfo(block.meetingPattern.location);

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{extractCourseCode(block.classData.courseName)}</SheetTitle>
          <SheetDescription>{block.classData.courseName}</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6 text-sm">
          {building?.images?.[0] && (
            <div className="relative aspect-video overflow-hidden rounded-lg border border-border">
              <Image src={building.images[0]} alt={building.fullName} fill className="object-cover" />
            </div>
          )}

          <Detail icon={<Building2 className="size-4" />} label="Location" value={block.meetingPattern.location} />
          <Detail icon={<Clock3 className="size-4" />} label="Time" value={`${block.meetingPattern.startTime} - ${block.meetingPattern.endTime}`} />
          <Detail icon={<Navigation className="size-4" />} label="Days" value={block.meetingPattern.daysMeeting.join(", ")} />
          <Detail label="Instructor" value={block.classData.instructor || "TBA"} />
          <Detail label="Credits" value={block.classData.credits || "N/A"} />
          <Detail label="Section" value={block.classData.section || "N/A"} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function GapDetailPanel({ gap, onClose }: { gap: GapInfo | null; onClose: () => void }) {
  if (!gap) return null;

  const university = UNIVERSITIES[0];
  const building = gap.buildingKey ? university.buildings?.[gap.buildingKey] : undefined;
  const coords = building?.lngLat;

  const nearbyDining = (building?.["nearest-dining-halls"] ?? []).slice(0, 3).map((key) => {
    const item = university.diningHallsAndCafes?.[key];
    if (!item) return null;
    const location = item.residenceHall
      ? university.residenceHalls?.[item.location]
      : university.buildings?.[item.location];
    const miles = coords && location?.lngLat ? getDistance(coords[0], coords[1], location.lngLat[0], location.lngLat[1]) : null;
    return { key, item, miles };
  }).filter((x): x is NonNullable<typeof x> => x !== null);

  const nearbyStations = Object.values(university.mbtaStations ?? {}).flat().slice(0, 3).map((stationKey) => {
    const station = MBTA_STATIONS[stationKey];
    if (!station) return null;
    const miles = coords && station.lngLat ? getDistance(coords[0], coords[1], station.lngLat[0], station.lngLat[1]) : null;
    return { stationKey, station, miles };
  }).filter((x): x is NonNullable<typeof x> => x !== null);

  const nearbyParking = (building?.["nearest-parking"] ?? []).slice(0, 2).map((garageKey) => {
    const garage = PARKING_GARAGES[garageKey];
    if (!garage) return null;
    const miles = coords && garage.lngLat ? getDistance(coords[0], coords[1], garage.lngLat[0], garage.lngLat[1]) : null;
    return { garageKey, garage, miles };
  }).filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Gap Explorer</SheetTitle>
          <SheetDescription>
            {formatTime(gap.start)} - {formatTime(gap.end)} on {gap.day}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-6 text-sm">
          <section>
            <h4 className="mb-2 flex items-center gap-2 font-semibold"><UtensilsCrossed className="size-4" /> Nearby Dining</h4>
            <div className="space-y-2">
              {nearbyDining.length === 0 && <p className="text-muted-foreground">No dining suggestions found.</p>}
              {nearbyDining.map(({ key, miles }) => (
                <div key={key} className="rounded-md border border-border p-2">
                  <p className="font-medium">{toTitle(key)}</p>
                  <p className="text-xs text-muted-foreground">{miles === null ? "Distance unavailable" : `${miles.toFixed(2)} mi away`}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="mb-2 flex items-center gap-2 font-semibold"><TrainFront className="size-4" /> MBTA</h4>
            <div className="space-y-2">
              {nearbyStations.map(({ stationKey, station, miles }) => (
                <div key={stationKey} className="rounded-md border border-border p-2">
                  <p className="font-medium">{toTitle(stationKey)}</p>
                  <p className="text-xs text-muted-foreground">{miles === null ? "Distance unavailable" : `${miles.toFixed(2)} mi away`}</p>
                  {station.website && (
                    <a href={station.website} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-primary hover:underline">
                      Open map
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {nearbyParking.length > 0 && (
            <section>
              <h4 className="mb-2 font-semibold">Parking</h4>
              <div className="space-y-2">
                {nearbyParking.map(({ garageKey, miles }) => (
                  <div key={garageKey} className="rounded-md border border-border p-2">
                    <p className="font-medium">{toTitle(garageKey)}</p>
                    <p className="text-xs text-muted-foreground">{miles === null ? "Distance unavailable" : `${miles.toFixed(2)} mi away`}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <SheetTrigger render={<Button variant="outline" className="w-full" />}>Close</SheetTrigger>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Detail({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      {icon && <span className="mt-0.5 text-muted-foreground">{icon}</span>}
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-muted-foreground">{value || "N/A"}</p>
      </div>
    </div>
  );
}

function extractCourseCode(courseName: string) {
  const match = courseName.match(/^([A-Z]+\s+\d+)/);
  return match ? match[1] : courseName;
}

function extractBuildingKey(location: string) {
  return stripRoom(location).split(" ")[0].toLowerCase();
}

function getBuildingInfo(location: string) {
  const key = extractBuildingKey(location);
  return UNIVERSITIES[0].buildings?.[key];
}

function colorToGradient(tailwindBgClass: string) {
  const colorMap: Record<string, string> = {
    "bg-blue-500": "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    "bg-purple-500": "linear-gradient(135deg, #a855f7, #7e22ce)",
    "bg-green-500": "linear-gradient(135deg, #22c55e, #15803d)",
    "bg-yellow-500": "linear-gradient(135deg, #eab308, #ca8a04)",
    "bg-pink-500": "linear-gradient(135deg, #ec4899, #be185d)",
    "bg-indigo-500": "linear-gradient(135deg, #6366f1, #3730a3)",
    "bg-red-500": "linear-gradient(135deg, #ef4444, #b91c1c)",
    "bg-teal-500": "linear-gradient(135deg, #14b8a6, #0f766e)",
    "bg-orange-500": "linear-gradient(135deg, #f97316, #c2410c)",
    "bg-cyan-500": "linear-gradient(135deg, #06b6d4, #0e7490)",
  };

  return colorMap[tailwindBgClass] ?? "linear-gradient(135deg, #334155, #0f172a)";
}

function formatTime(minutes: number) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hrs >= 12 ? "PM" : "AM";
  const display = hrs % 12 || 12;
  return `${display}:${mins.toString().padStart(2, "0")} ${period}`;
}

function toTitle(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (x) => x.toUpperCase());
}
