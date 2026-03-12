"use client";

import Link from "next/link";
import { CalendarDays, Compass, Save, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function Page() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="min-h-svh">
      <section className="relative overflow-hidden px-4 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl">
            Your Week
            <br />
            <span className="text-tint">Unified</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Upload your Workday schedule and turn it into a clean, interactive weekly view with live class status,
            building context, and gap-time recommendations.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/upload">
              <Button size="lg">Upload Schedule</Button>
            </Link>
            <Link href={isAuthenticated ? "/library" : "/privacy-policy"}>
              <Button size="lg" variant="outline">
                {isAuthenticated ? "Open Library" : "View Privacy Policy"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            title="Schedule Visualization"
            description="Render class times into a weekly layout with color-coded blocks and one-click details."
            icon={<CalendarDays className="size-5" />}
          />
          <FeatureCard
            title="Live Status"
            description="See what class is happening now, what is next, and how much free time you have."
            icon={<Compass className="size-5" />}
          />
          <FeatureCard
            title="Persistent Library"
            description="Signed-in users can save schedules to Firebase and access them later from any device."
            icon={<Save className="size-5" />}
          />
          <FeatureCard
            title="Privacy First"
            description="Schedules are used to power your own experience and never sold or publicly shared."
            icon={<ShieldCheck className="size-5" />}
          />
        </div>
      </section>

      <section className="px-4 py-12">
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <CardTitle>About UniWeek</CardTitle>
            <CardDescription>Built for Suffolk students who want less schedule friction.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pb-6 text-sm text-muted-foreground md:text-base">
            <p>
              UniWeek parses exported .xlsx schedules and maps them to an intuitive weekly calendar so you can plan
              faster and focus on classes.
            </p>
            <p>
              Guests can upload and explore a schedule immediately. Registered users can save schedules, keep a
              personalized workspace, and revisit data later in the library.
            </p>
            <p>
              The current build is optimized for Suffolk University formatting and includes location-aware context using
              campus building data.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="mb-2 inline-flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">{icon}</div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
