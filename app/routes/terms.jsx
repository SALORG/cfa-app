import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
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
          Terms & Conditions
        </h1>
        <p className="text-text-muted text-sm mb-10">
          Last updated: February 22, 2026
        </p>

        <div className="space-y-8 text-text-secondary text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using CFA Master ("the Service"), you agree to be
              bound by these Terms & Conditions. If you do not agree with any
              part of these terms, you must not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              2. Description of Service
            </h2>
            <p>
              CFA Master is a free, community-built study tool for CFA Level I
              exam preparation. The Service provides cheat sheets, flashcards,
              quizzes, practice exams, formula sheets, and progress tracking.
              The Service is provided "as is" and is not affiliated with,
              endorsed by, or connected to the CFA Institute in any way.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              3. User Accounts
            </h2>
            <p>
              You may use the Service without creating an account. If you choose
              to sign in via Google or email/password, you are responsible for
              maintaining the security of your account credentials. You agree to
              provide accurate information and to not share your account with
              others.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              4. Acceptable Use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                Use the Service for any unlawful purpose or in violation of any
                applicable laws
              </li>
              <li>
                Attempt to gain unauthorized access to the Service or its
                related systems
              </li>
              <li>
                Reproduce, distribute, or commercially exploit any content from
                the Service without permission
              </li>
              <li>
                Interfere with or disrupt the integrity or performance of the
                Service
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              5. Intellectual Property
            </h2>
            <p>
              All content, design, and code comprising the Service are the
              property of CFA Master or its contributors. CFA&reg; and
              Chartered Financial Analyst&reg; are registered trademarks owned
              by the CFA Institute. CFA Master is not affiliated with or
              endorsed by the CFA Institute.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              6. Disclaimer of Warranties
            </h2>
            <p>
              The Service is provided on an "as is" and "as available" basis
              without warranties of any kind, either express or implied. We do
              not guarantee that the study content is complete, accurate, or
              up-to-date. The Service is a supplementary study aid and should
              not be your sole source of exam preparation. We make no guarantees
              regarding exam outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              7. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, CFA Master and its
              contributors shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including but not
              limited to loss of data, exam failure, or any other loss arising
              from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              8. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. Changes
              will be effective immediately upon posting to the Service.
              Continued use of the Service after changes constitutes acceptance
              of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              9. Contact
            </h2>
            <p>
              If you have any questions about these Terms & Conditions, please
              open an issue on our{" "}
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
