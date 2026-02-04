import { Shield, Database, Hand, X, Sliders, HelpCircle, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-card text-foreground shadow-sm rounded-lg p-8">
                <div className="flex items-center gap-3 mb-4">
                    <Shield className="text-primary" size={32} />
                    <h1 className="text-4xl font-bold">Privacy Policy</h1>
                </div>
                <p className="text-lg mb-8">
                    UniWeek is designed to help students organize their weekly schedules. We respect your privacy, and we keep your data safe.
                </p>

                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Database className="text-primary" size={24} />
                        <h2 className="text-2xl font-semibold">What We Collect</h2>
                    </div>
                    <p className="mb-3">
                        When you upload your schedule file (.xlsx), it may include:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Your full name</li>
                        <li>Your university ID number</li>
                        <li>Your course information</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Hand className="text-primary" size={24} />
                        <h2 className="text-2xl font-semibold">How This Data Is Used</h2>
                    </div>
                    <p className="mb-3">
                        We only use the information in your file to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Display your schedule</li>
                        <li>(Optionally) show a personalized greeting using your first name only</li>
                    </ul>
                    <p className="mt-1 italic">
                        We never use your university ID in our app.
                    </p>
                </section>

                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <X className="text-primary" size={24} />
                        <h2 className="text-2xl font-semibold">What We Avoid</h2>
                    </div>
                    <p className="mb-3">We never:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Store or display your full name publicly</li>
                        <li>Store or display your university ID</li>
                        <li>Sell or share your data with anyone</li>
                        <li>Use your personal information for advertising</li>
                        <li>Use your name or ID in social features (attendance, leaderboards, etc.)</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Mail className="text-primary" size={24} />
                        <h2 className="text-2xl font-semibold">Data Storage</h2>
                    </div>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Your uploaded schedule is stored securely and is only visible to you.</li>
                        <li>Your name and ID are not used for anything beyond the optional greeting.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Sliders className="text-primary" size={24} />
                        <h2 className="text-2xl font-semibold">Your Control</h2>
                    </div>
                    <p className="mb-3">You can:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Disable personalized greetings</li>
                        <li>Delete your uploaded schedule</li>
                        <li>Use the app without creating an account (with limited features)</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <HelpCircle className="text-primary" size={24} />
                        <h2 className="text-2xl font-semibold">Questions</h2>
                    </div>
                    <p className="mb-3">
                        If you have concerns about privacy or data handling, you can contact us anytime.
                    </p>
                </section>

                <div className="mt-12 pt-6">
                    <p className="text-sm text-center">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>
        </div>
    );
}