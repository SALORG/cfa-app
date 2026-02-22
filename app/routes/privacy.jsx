import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-surface">
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Privacy Policy
        </h1>
        <p className="text-text-muted text-sm mb-10">
          Last updated: February 22, 2026
        </p>

        <div className="space-y-8 text-text-secondary text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              1. Overview
            </h2>
            <p>
              CFA Master ("the Service") respects your privacy. This policy
              explains what data we collect, how we use it, and your rights
              regarding that data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              2. Data We Collect
            </h2>
            <p>
              <strong className="text-text-primary">
                If you use the Service without signing in:
              </strong>{" "}
              We do not collect any personal data. No cookies, no tracking, no
              analytics.
            </p>
            <p className="mt-3">
              <strong className="text-text-primary">
                If you sign in with Google or email/password:
              </strong>{" "}
              We store the following through Firebase Authentication and
              Firestore:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Your display name and email address (from your auth provider)</li>
              <li>Module completion progress</li>
              <li>Quiz scores and attempt history</li>
              <li>Theme preference (dark/light mode)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              3. How We Use Your Data
            </h2>
            <p>Your data is used solely to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Authenticate you and maintain your session</li>
              <li>Save and sync your study progress across devices</li>
              <li>Persist your theme preference</li>
            </ul>
            <p className="mt-3">
              We do not sell, share, or transfer your personal data to any third
              parties. We do not use your data for advertising, marketing, or
              profiling.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              4. Third-Party Services
            </h2>
            <p>The Service uses the following third-party services:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong className="text-text-primary">
                  Firebase Authentication
                </strong>{" "}
                — for user sign-in (Google OAuth and email/password)
              </li>
              <li>
                <strong className="text-text-primary">
                  Cloud Firestore
                </strong>{" "}
                — for storing user progress and preferences
              </li>
              <li>
                <strong className="text-text-primary">
                  Cloudflare Workers
                </strong>{" "}
                — for hosting and serving the application
              </li>
            </ul>
            <p className="mt-3">
              These services have their own privacy policies. We encourage you
              to review them.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              5. Data Storage & Security
            </h2>
            <p>
              Your data is stored in Google Cloud Firestore servers. All data
              transmission is encrypted via HTTPS. We use Firebase security
              rules to ensure users can only access their own data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              6. Data Retention & Deletion
            </h2>
            <p>
              Your data is retained as long as your account exists. You can
              request deletion of your account and all associated data by
              opening an issue on our GitHub repository. Upon request, we will
              delete your Firestore documents and Firebase Authentication
              record.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              7. Children's Privacy
            </h2>
            <p>
              The Service is not directed at children under 13. We do not
              knowingly collect personal information from children under 13. If
              you believe a child has provided us with personal data, please
              contact us so we can delete it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              8. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with an updated "Last updated" date.
              Continued use of the Service after changes constitutes acceptance
              of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              9. Contact
            </h2>
            <p>
              If you have any questions about this Privacy Policy or want to
              request data deletion, please open an issue on our{" "}
              <a
                href="https://github.com/SALORG/cfa-app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                GitHub repository
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
