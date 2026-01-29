'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadSchedule, deleteSchedule } from '@/lib/firebase/db';
import type { StoredSchedule } from '@/lib/firebase/types';

interface ScheduleItem {
  id: string;
  name: string;
  uploadDate: Date;
  classCount: number;
  data: StoredSchedule;
}

export default function LibraryPage() {
  const { isAuthenticated, isGuest, user } = useAuth();
  const router = useRouter();
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isGuest) {
      router.push('/');
    } else if (isAuthenticated && user) {
      loadUserSchedules();
    }
  }, [isGuest, router, isAuthenticated, user]);

  const loadUserSchedules = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const savedSchedule = await loadSchedule(user.id);
      if (savedSchedule) {
        setSchedules([
          {
            id: 'current',
            name: savedSchedule.fileName,
            uploadDate: new Date(savedSchedule.uploadedAt),
            classCount: savedSchedule.classes.length,
            data: savedSchedule,
          },
        ]);
      } else {
        setSchedules([]);
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (confirm('Are you sure you want to delete this schedule?')) {
      try {
        await deleteSchedule(user.id);
        setSchedules([]);
      } catch (error) {
        console.error('Error deleting schedule:', error);
        alert('Failed to delete schedule');
      }
    }
  };

  const handleView = (schedule: ScheduleItem) => {
    // Navigate to upload page with schedule data
    router.push('/upload');
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

        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading schedules...</p>
          </div>
        ) : schedules.length === 0 ? (
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
                  <p>Classes: {schedule.classCount}</p>
                  <p>Uploaded: {schedule.uploadDate.toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(schedule)}
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

        {schedules.length != 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/upload"
              className="inline-block px-6 py-3 bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors"
            >
              Upload New Schedule
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
