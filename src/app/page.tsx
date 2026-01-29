'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Calendar, Pencil, Save } from 'lucide-react';
import { ReactNode } from 'react';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Your Week,
              <br />
              <span className="text-primary">Simplified</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Organize and visualize your university schedule with ease.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/upload"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
              {isAuthenticated && (
                <Link
                  href="/library"
                  className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
                >
                  My Schedules
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Untitled Section */}
      <section className="py-16 px-4 ">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-card-foreground mb-12">
            Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <UntitledCard
              title="Schedule Visualization"
              description="Easily upload and view your class schedule in a clean layout."
              icon={<Calendar className="h-12 w-12" />}
            />
            <UntitledCard
              title="Organization"
              description="Keep your week flowing with suggestions for study spots and transportation."
              icon={<Pencil className="h-12 w-12" />}
            />
            <UntitledCard
              title="Persistence"
              description="Never worry about losing your schedule. Save and access it anytime."
              icon={<Save className="h-12 w-12" />}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            About
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              UniWeek is a schedule visualizer and organizer.
              It allows users to upload their class schedule and view them in an intuitive weekly format.
              Enjoy features like live status, gap analysis, and more.
            </p>
            <p>
              <strong className="text-foreground">For Guests: </strong>
              Upload your schedule and view it. Your schedule does not save.
            </p>
            <p>
              <strong className="text-foreground">For Registered Users: </strong>
              Save multiple schedules, add notes to classes, 
              participate in tallys,
              customize your schedule's theme,
              and access your schedules anytime.
            </p>
            <p>
              UniWeek currently only supports Suffolk University schedules.
              Support for other institutions may be added in the future based on demand.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function UntitledCard({ title, description, icon }: { title: string; description: string; icon: ReactNode }) {
  return (
    <div className="p-6 rounded-xl backdrop-blur bg-foreground/5">
      <div className="text-4xl mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
