'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Lorem Ipsum
              <br />
              <span className="text-primary">Dolor Sit Amet</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-card-foreground mb-12">
            Lorem Ipsum
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <UntitledCard
              title="Lorem Ipsum"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              icon="📅"
            />
            <UntitledCard
              title="Lorem Ipsum"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              icon="🏫"
            />
            <UntitledCard
              title="Lorem Ipsum"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              icon="💾"
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
              Suffolk Schedule is designed to help Suffolk University students better organize 
              and visualize their class schedules. Simply upload your Workday-exported .xlsx file 
              and get an instant visual breakdown of your week.
            </p>
            <p>
              <strong className="text-foreground">For Guests:</strong> Upload one schedule and view it instantly—no account required.
            </p>
            <p>
              <strong className="text-foreground">For Registered Users:</strong> Save multiple schedules, add notes to classes, 
              and access your schedules anytime.
            </p>
            <p>
              Built with Next.js, TypeScript, and TailwindCSS, this app emphasizes clean design, 
              accessibility, and an intuitive user experience.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <p>© 2026 Suffolk Schedule. Built for Suffolk University students.</p>
        </div>
      </footer>
    </div>
  );
}

function UntitledCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="p-6 border border-border rounded-lg bg-background">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
