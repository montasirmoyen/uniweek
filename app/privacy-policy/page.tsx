import { Database, Hand, HelpCircle, Mail, Shield, Sliders, X } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen px-4 py-10">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-3xl">
            <Shield className="size-8 text-primary" />
            Privacy Policy
          </CardTitle>
          <CardDescription>
            UniWeek helps students organize schedules while minimizing personal data usage.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-7 pb-8 text-sm md:text-base">
          <PolicySection
            icon={<Database className="size-5 text-primary" />}
            title="What We Collect"
            items={[
              "Uploaded schedule file contents (.xlsx)",
              "Class metadata (course, section, meeting patterns)",
              "Optional account email and display name for registered users",
            ]}
          />

          <PolicySection
            icon={<Hand className="size-5 text-primary" />}
            title="How Data Is Used"
            items={[
              "Render your schedule into an interactive weekly layout",
              "Power optional personalized greeting and saved library",
              "Provide live status and class-attendance features",
            ]}
          />

          <PolicySection
            icon={<X className="size-5 text-primary" />}
            title="What We Do Not Do"
            items={[
              "Sell your personal data",
              "Publicly expose your schedule by default",
              "Use schedule content for advertising profiles",
            ]}
          />

          <PolicySection
            icon={<Mail className="size-5 text-primary" />}
            title="Storage"
            items={[
              "Guest usage is session-limited and not persisted as account data",
              "Signed-in users can store schedule data in their own private library",
              "You can remove saved schedules at any time",
            ]}
          />

          <PolicySection
            icon={<Sliders className="size-5 text-primary" />}
            title="Your Control"
            items={[
              "Use guest mode or create an account",
              "Upload, replace, and delete schedule records",
              "Choose whether to engage with attendance features",
            ]}
          />

          <PolicySection
            icon={<HelpCircle className="size-5 text-primary" />}
            title="Questions"
            items={["If you have concerns about privacy or data handling, contact the UniWeek maintainers."]}
          />

          <p className="border-t border-border pt-4 text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

function PolicySection({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <section>
      <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold">
        {icon}
        {title}
      </h2>
      <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
