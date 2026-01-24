'use client';

import { useState } from 'react';
import { ScheduleBlock } from '@/lib/types/schedule';
import { UNIVERSITIES } from '@/lib/types/universities';
import Image from 'next/image';

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

  const buildingKey = extractBuilding(block.meetingPattern.location);
  const university = UNIVERSITIES[0]; // Suffolk University
  const building = university.buildings?.[buildingKey];

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
            <DetailRow label="Course" value={block.classData.courseName} />
            <DetailRow label="Section" value={block.classData.section} />
            <DetailRow label="Location" value={block.meetingPattern.location} />
            <DetailRow 
              label="Time" 
              value={`${block.meetingPattern.startTime} - ${block.meetingPattern.endTime}`} 
            />
            <DetailRow 
              label="Days" 
              value={block.meetingPattern.days.join(', ')} 
            />
            <DetailRow label="Credits" value={block.classData.credits} />
            <DetailRow label="Instructor" value={block.classData.instructor} />
            <DetailRow label="Format" value={block.classData.instructionalFormat} />
            <DetailRow label="Modality" value={block.classData.modality} />
          </div>

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
            className={`w-full py-3 rounded-md font-semibold transition-colors ${
              isAttending
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="font-semibold text-card-foreground min-w-[100px] text-sm">
        {label}:
      </span>
      <span className="text-muted-foreground text-sm">
        {value || 'N/A'}
      </span>
    </div>
  );
}
