'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SavedSchedule {
  id: string;
  name: string;
  semester: string;
  uploadDate: string;
  classCount: number;
}

export default function LibraryPage() {
  const { isAuthenticated, isGuest } = useAuth();
  const router = useRouter();
  const [schedules, setSchedules] = useState<SavedSchedule[]>([]);

  useEffect(() => {
    if (isGuest) {
      router.push('/');
    } else {
      // Simulate fetching saved schedules - no backend yet
      setSchedules([
        {
          id: '1',
          name: 'Fall 2025 Schedule',
          semester: 'Fall 2025',
          uploadDate: '2025-08-15',
          classCount: 5,
        },
        {
          id: '2',
          name: 'Spring 2026 Schedule',
          semester: 'Spring 2026',
          uploadDate: '2026-01-10',
          classCount: 6,
        },
      ]);
    }
  }, [isGuest, router]);

  if (isGuest) {
    return null; // Will redirect
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      setSchedules(schedules.filter(s => s.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            My Schedule Library
          </h1>
          <p className="text-muted-foreground">
            Manage and view all your saved schedules
          </p>
        </header>

        {schedules.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">
              You haven't saved any schedules yet.
            </p>
            <Link
              href="/upload"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Upload Your First Schedule
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  {schedule.name}
                </h3>
                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                  <p>Semester: {schedule.semester}</p>
                  <p>Classes: {schedule.classCount}</p>
                  <p>Uploaded: {new Date(schedule.uploadDate).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => alert('View functionality coming soon!')}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:opacity-90 transition-opacity text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/upload"
            className="inline-block px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Upload New Schedule
          </Link>
        </div>
      </div>
    </div>
  );
}
