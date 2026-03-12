"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, FileSpreadsheet, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/contexts/AuthContext";
import { deleteSchedule, loadSchedule } from "@/lib/firebase/db";

interface ScheduleItem {
  id: string;
  name: string;
  uploadedAt: Date;
  classCount: number;
}

export default function LibraryPage() {
  const router = useRouter();
  const { isAuthenticated, isGuest, user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    if (isGuest) {
      router.push("/");
      return;
    }

    if (isAuthenticated && user) {
      void loadUserSchedules(user.id);
    }
  }, [isGuest, isAuthenticated, user, router]);

  const loadUserSchedules = async (userId: string) => {
    setIsLoading(true);
    try {
      const savedSchedule = await loadSchedule(userId);
      if (!savedSchedule) {
        setSchedules([]);
        return;
      }

      setSchedules([
        {
          id: "current",
          name: savedSchedule.fileName,
          uploadedAt: new Date(savedSchedule.uploadedAt),
          classCount: savedSchedule.classes.length,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formattedCount = useMemo(() => schedules.length, [schedules.length]);

  const handleDelete = async () => {
    if (!user) return;
    const shouldDelete = window.confirm("Delete your saved schedule from library?");
    if (!shouldDelete) return;

    try {
      await deleteSchedule(user.id);
      setSchedules([]);
    } catch {
      window.alert("Failed to delete schedule.");
    }
  };

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold md:text-4xl">My Schedule Library</h1>
          <p className="text-sm text-muted-foreground">Manage saved schedules and reopen them in Upload view.</p>
        </header>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-56" />
            <Skeleton className="h-56" />
            <Skeleton className="h-56" />
          </div>
        ) : schedules.length === 0 ? (
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>No schedules yet</CardTitle>
              <CardDescription>Upload a schedule to save it to your personal library.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/upload">
                <Button>
                  <FileSpreadsheet className="size-4" />
                  Upload First Schedule
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <div>
            <div className="mb-4 text-sm text-muted-foreground">{formattedCount} saved schedule</div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {schedules.map((schedule) => (
                <Card key={schedule.id}>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-lg">{schedule.name}</CardTitle>
                    <CardDescription>
                      Saved on {schedule.uploadedAt.toLocaleDateString()} with {schedule.classCount} classes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    You can view this schedule from the Upload page and replace it at any time.
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Link href="/upload" className="flex-1">
                      <Button className="w-full" variant="secondary">
                        <CalendarDays className="size-4" />
                        Open
                      </Button>
                    </Link>
                    <Button variant="destructive" onClick={handleDelete}>
                      <Trash2 className="size-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
