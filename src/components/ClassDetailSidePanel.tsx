'use client';

import { useState } from 'react';
import { ScheduleBlock } from '@/lib/types/schedule';
import { UNIVERSITIES } from '@/lib/types/universities';
import Image from 'next/image';
import professorsData from '@/data/professors.json';
import { StarHalf, Star, Book, ChartArea, Pin, Clock, Calendar, GraduationCap, User, Clipboard, Computer } from "lucide-react";

interface Professor {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  department: string;
  rating: number;
  difficulty: number;
  numRatings: number;
  wouldTakeAgainPercent: number;
  url: string;
  topTags?: Array<{ name: string; count: number }> | string[];
}

interface ClassDetailSidePanelProps {
  block: ScheduleBlock;
  onClose: () => void;
}

export default function ClassDetailSidePanel({ block, onClose }: ClassDetailSidePanelProps) {
  const [note, setNote] = useState('');
  const [isAttending, setIsAttending] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Extract building name from location (e.g., "Sawyer 521" -> "sawyer")
  const extractBuilding = (location: string): string => {
    const buildingName = location.split(' ')[0].toLowerCase();
    return buildingName;
  };

  // Find professor in RMP database
  const findProfessor = (instructorName: string): Professor | undefined => {
    if (!instructorName) return undefined;
    const professors = professorsData as Professor[];
    return professors.find((prof) => {
      const fullName = `${prof.firstName} ${prof.lastName}`.toLowerCase();
      return fullName === instructorName.toLowerCase() || prof.name.toLowerCase() === instructorName.toLowerCase();
    });
  };

  // Render star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} color="#ffd90000" fill="#FFD700" />
        ))}
        {hasHalfStar && <StarHalf color="#ffd90000" fill="#FFD700" />}
        <span className="ml-1 text-sm font-semibold text-card-foreground">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const buildingKey = extractBuilding(block.meetingPattern.location);
  const university = UNIVERSITIES[0]; // Suffolk University
  const building = university.buildings?.[buildingKey];
  const professor = findProfessor(block.classData.instructor);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 250);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/25 z-40 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={handleClose}
      />

      {/* Side Panel */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-card shadow-2xl z-50 overflow-y-auto ${isClosing ? 'animate-slide-out' : 'animate-slide-in'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-card-foreground">
              {block.classData.courseName.split(' - ')[0]}
            </h2>
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground text-3xl leading-none transition-colors"
            >
              ×
            </button>
          </div>

          {/* Building Images */}
          {building?.images && building.images.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-card-foreground mb-3">Building</h3>
              <div className="grid grid-cols-2 gap-2">
                {building.images.map((image, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${buildingKey} building`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Class Details */}
          <div className="space-y-4 mb-6">
            <DetailRow icon={<Book />} label="Course" value={block.classData.courseName} />
            <DetailRow icon={<ChartArea />} label="Section" value={block.classData.section} />
            <DetailRow icon={<Pin />} label="Location" value={block.meetingPattern.location} />
            <DetailRow
              icon={<Clock />}
              label="Time"
              value={`${block.meetingPattern.startTime} - ${block.meetingPattern.endTime}`}
            />
            <DetailRow
              icon={<Calendar />}
              label="Days Met"
              value={block.meetingPattern.daysMeeting.join(', ')}
            />
            <DetailRow icon={<GraduationCap />} label="Credits" value={block.classData.credits} />
            <DetailRow icon={<User />} label="Professor" value={block.classData.instructor} />
            <DetailRow icon={<Clipboard />} label="Format" value={block.classData.instructionalFormat} />
            <DetailRow icon={<Computer />} label="Modality" value={block.classData.modality} />
          </div>

          {/* Professor RMP Ratings */}
          {professor && (
            <div className="mb-6 p-4 border border-border rounded-lg bg-secondary/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-card-foreground">RateMyProfessors Stats</h3>
                <a
                  href={"https://ram-ai.vercel.app/professor/" + professor.id}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-link hover:underline"
                >
                  View More →
                </a>
              </div>

              <div className="space-y-3">
                {/* Rating */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Overall Rating</span>
                  {renderStars(professor.rating)}
                </div>

                {/* Difficulty */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Difficulty</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-black rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all"
                        style={{ width: `${(professor.difficulty / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-card-foreground min-w-[2rem] text-right">
                      {professor.difficulty.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Would Take Again */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Would Take Again</span>
                  <span className="text-sm font-semibold text-white">
                    {professor.wouldTakeAgainPercent.toFixed(0)}%
                  </span>
                </div>

                {/* Top Tags */}
                {professor.topTags && professor.topTags.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs text-muted-foreground mb-2 block">Top Tags</span>
                    <div className="flex flex-wrap gap-1.5">
                      {professor.topTags.map((tag, idx) => {
                        const tagName = typeof tag === 'string' ? tag : tag.name;
                        return (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-secondary rounded-full"
                          >
                            {tagName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {block.classData.classDescription && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-card-foreground mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {block.classData.classDescription}
              </p>
            </div>
          )}

          {/* Notes */}
          <div className="mb-6">
            <label htmlFor="note" className="block text-sm font-semibold text-card-foreground mb-2">
              Notes
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this class..."
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px] resize-none"
            />
          </div>

          {/* Attendance Button */}
          <button
            onClick={() => setIsAttending(!isAttending)}
            className={`w-full py-3 rounded-md font-semibold transition-colors ${isAttending
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
          >
            {isAttending ? '✓ I am attending' : 'I am attending'}
          </button>
        </div>
      </div>
    </>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="flex-1 flex gap-2 min-w-0 items-center">
        {icon}
        <span className="font-semibold text-card-foreground min-w-[90px] text-sm shrink-0">
          {label}:
        </span>
        <span className="text-muted-foreground text-sm break-words">
          {value || 'N/A'}
        </span>
      </div>
    </div>
  );
}
