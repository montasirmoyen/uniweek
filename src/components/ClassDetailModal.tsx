'use client';

import { ClassData } from '@/lib/types/schedule';

interface ClassDetailModalProps {
  classData: ClassData;
  onClose: () => void;
}

export default function ClassDetailModal({ classData, onClose }: ClassDetailModalProps) {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {classData.courseName}
            </h2>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-3">
            <DetailRow label="Section" value={classData.section} />
            <DetailRow label="Credits" value={classData.credits} />
            <DetailRow label="Instructor" value={classData.instructor} />
            <DetailRow label="Meeting Pattern" value={classData.meetingPatterns} multiline />
            <DetailRow label="Instructional Format" value={classData.instructionalFormat} />
            <DetailRow label="Delivery Mode" value={classData.deliveryMode} />
            <DetailRow label="Grading Basis" value={classData.gradingBasis} />
            <DetailRow label="Registration Status" value={classData.registrationStatus} />
            <DetailRow label="Start Date" value={classData.startDate} />
            <DetailRow label="End Date" value={classData.endDate} />
            <DetailRow label="Description" value={classData.classDescription} multiline />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className={multiline ? '' : 'flex gap-2'}>
      <span className="font-semibold text-zinc-700 dark:text-zinc-300 min-w-[160px]">
        {label}:
      </span>
      <span className={`text-zinc-600 dark:text-zinc-400 ${multiline ? 'whitespace-pre-line mt-1 block' : ''}`}>
        {value || 'N/A'}
      </span>
    </div>
  );
}
