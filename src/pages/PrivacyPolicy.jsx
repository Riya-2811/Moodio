import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaLock, FaDatabase, FaUserShield, FaEye, FaTrash, FaEnvelope } from 'react-icons/fa';

/**
 * Privacy Policy Page
 * Comprehensive privacy policy detailing how Moodio protects user data
 */
const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-sky-blue dark:bg-dark-bg transition-all duration-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-calm-purple dark:bg-accent-blue mb-4">
            <FaShieldAlt className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your privacy and data security are our top priorities
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-dark-surface rounded-softer shadow-lg p-8 md:p-12 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-3">
              <FaUserShield className="text-calm-purple dark:text-accent-blue" />
              Introduction
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              At Moodio, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, store, and protect your data when you use our mental wellness platform. 
              We believe in transparency and want you to understand exactly how your information is handled.
            </p>
          </section>

          {/* Data We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-3">
              <FaDatabase className="text-calm-purple dark:text-accent-blue" />
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Account Information</h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                  <li>Name and email address (for account creation and communication)</li>
                  <li>Optional personal information (age, gender, country) - only if you choose to provide it</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Wellness Data</h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                  <li>Mood tracking entries (mood type, timestamp, notes)</li>
                  <li>Journal entries (your private thoughts and reflections)</li>
                  <li>Music preferences and listening habits</li>
                  <li>Wellness preferences and goals</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Communication Data</h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                  <li>Contact form submissions (name, email, subject, message)</li>
                  <li>Therapist request information (if you choose to request professional support)</li>
                  <li>Chat interactions with our AI assistant (for providing support)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Data */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-3">
              <FaEye className="text-calm-purple dark:text-accent-blue" />
              How We Use Your Information
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                <strong className="text-gray-800 dark:text-gray-100">Personalization:</strong> We use your preferences and mood data 
                to provide personalized music recommendations, wellness tips, and content tailored to your emotional state.
              </p>
              <p>
                <strong className="text-gray-800 dark:text-gray-100">Service Delivery:</strong> Your data enables us to provide core 
                features like mood tracking, journaling, music recommendations, and AI-powered support.
              </p>
              <p>
                <strong className="text-gray-800 dark:text-gray-100">Communication:</strong> We use your contact information to respond 
                to your inquiries, send important service updates, and provide customer support.
              </p>
              <p>
                <strong className="text-gray-800 dark:text-gray-100">Improvement:</strong> Aggregated, anonymized data helps us improve 
                our services, develop new features, and enhance user experience. We never use your personal data for this purpose.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-3">
              <FaLock className="text-calm-purple dark:text-accent-blue" />
              How We Protect Your Data
            </h2>
            <div className="space-y-4">
              <div className="bg-sky-blue dark:bg-dark-bg rounded-soft p-4 border-l-4 border-calm-purple dark:border-accent-blue">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Secure Database Storage</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  All your data is stored securely in MongoDB Atlas, a leading cloud database service with enterprise-grade security. 
                  MongoDB Atlas provides:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 mt-2 ml-4">
                  <li>End-to-end encryption for data in transit and at rest</li>
                  <li>Regular automated backups to prevent data loss</li>
                  <li>Network isolation and firewall protection</li>
                  <li>Compliance with industry security standards (SOC 2, ISO 27001)</li>
                </ul>
              </div>
              
              <div className="bg-soft-green/30 dark:bg-dark-bg rounded-soft p-4 border-l-4 border-soft-green dark:border-accent-green">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Access Controls</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We implement strict access controls to ensure your data is only accessible to authorized systems:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 mt-2 ml-4">
                  <li>User-specific data isolation (your data is only linked to your unique user ID)</li>
                  <li>API endpoints require user authentication</li>
                  <li>Server-side validation ensures users can only access their own data</li>
                  <li>Environment variables protect sensitive credentials (database connections, API keys)</li>
                </ul>
              </div>

              <div className="bg-warm-pink/20 dark:bg-dark-bg rounded-soft p-4 border-l-4 border-warm-pink dark:border-accent-pink">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Network Security</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Our backend server implements multiple layers of network security:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 mt-2 ml-4">
                  <li>CORS (Cross-Origin Resource Sharing) protection to prevent unauthorized access</li>
                  <li>HTTPS encryption for all data transmission</li>
                  <li>Input validation and sanitization to prevent injection attacks</li>
                  <li>Error handling that doesn't expose sensitive system information</li>
                </ul>
              </div>

              <div className="bg-calm-purple/20 dark:bg-dark-bg rounded-soft p-4 border-l-4 border-calm-purple dark:border-accent-blue">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Data Breach Prevention</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We take proactive measures to prevent data breaches:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 mt-2 ml-4">
                  <li>Regular security audits and monitoring</li>
                  <li>Secure credential management (environment variables, never hardcoded)</li>
                  <li>Database connection encryption</li>
                  <li>Automatic security updates and patches</li>
                  <li>No storage of sensitive payment information (we don't process payments)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Privacy Features */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-3">
              <FaUserShield className="text-calm-purple dark:text-accent-blue" />
              Your Privacy Controls
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                <strong className="text-gray-800 dark:text-gray-100">Journal Privacy:</strong> Your journal entries are private by default. 
                You control whether previous entries are visible or hidden, and you can password-protect this feature using your account password.
              </p>
              <p>
                <strong className="text-gray-800 dark:text-gray-100">Data Deletion:</strong> You can delete your mood history, journal entries, 
                or entire account data at any time through the application interface.
              </p>
              <p>
                <strong className="text-gray-800 dark:text-gray-100">Notification Preferences:</strong> You have full control over what notifications 
                you receive. You can enable or disable daily reminders, mood tracking reminders, and personalized care notifications.
              </p>
              <p>
                <strong className="text-gray-800 dark:text-gray-100">Optional Information:</strong> Most personal information fields are optional. 
                You only share what you're comfortable with.
              </p>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-3">
              <FaEnvelope className="text-calm-purple dark:text-accent-blue" />
              Data Sharing and Third Parties
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                <strong className="text-gray-800 dark:text-gray-100">We Do NOT Sell Your Data:</strong> Moodio never sells, rents, or trades your 
                personal information to third parties for marketing or advertising purposes.
              </p>
              <p>
                <strong className="text-gray-800 dark:text-gray-100">Service Providers:</strong> We use trusted third-party services to operate our platform:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>MongoDB Atlas:</strong> Secure cloud database hosting (data storage)</li>
                <li><strong>Email Services (Gmail/Nodemailer):</strong> For sending contact form notifications and support emails</li>
                <li><strong>Spotify:</strong> External links to music playlists (we don't share your data with Spotify)</li>
              </ul>
              <p>
                <strong className="text-gray-800 dark:text-gray-100">Legal Requirements:</strong> We may disclose your information if required by law, 
                court order, or to protect our rights, property, or safety.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-3">
              <FaTrash className="text-calm-purple dark:text-accent-blue" />
              Data Retention
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We retain your data for as long as your account is active or as needed to provide you with our services. 
              You can request deletion of your data at any time. When you delete your account or specific data:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mt-3 ml-4">
              <li>Your data is permanently removed from our active database</li>
              <li>Backup copies are deleted according to our retention policy (typically within 30 days)</li>
              <li>We cannot recover deleted data after the retention period</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Your Rights
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Access</strong> your personal data stored in our system</li>
                <li><strong>Correct</strong> inaccurate or incomplete information</li>
                <li><strong>Delete</strong> your account and all associated data</li>
                <li><strong>Export</strong> your data (contact us to request a copy)</li>
                <li><strong>Opt-out</strong> of non-essential communications</li>
                <li><strong>Control</strong> your privacy settings within the app</li>
              </ul>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Children's Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Moodio is not intended for children under the age of 13. We do not knowingly collect personal information 
              from children under 13. If you believe we have inadvertently collected information from a child under 13, 
              please contact us immediately, and we will delete that information.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, 
              operational, or regulatory reasons. We will notify you of any material changes by updating the "Last Updated" 
              date at the top of this page. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-calm-purple/10 dark:bg-accent-blue/10 rounded-soft p-6 border-2 border-calm-purple/30 dark:border-accent-blue/30">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, 
              please don't hesitate to reach out:
            </p>
             <div className="space-y-2 text-gray-700 dark:text-gray-300">
               <p>
                 <strong>Email:</strong>{' '}
                 <a 
                   href={`https://mail.google.com/mail/?view=cm&fs=1&to=contact.moodio@gmail.com&su=${encodeURIComponent('Privacy Policy Inquiry - Moodio')}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-calm-purple dark:text-accent-blue hover:underline"
                 >
                   contact.moodio@gmail.com
                 </a>
               </p>
               <p>
                 <strong>Contact Form:</strong>{' '}
                 <Link 
                   to="/contact" 
                   className="text-calm-purple dark:text-accent-blue hover:underline"
                 >
                   Visit our Contact Page
                 </Link>
               </p>
             </div>
          </section>

          {/* Back to Home */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-softer bg-calm-purple dark:bg-accent-blue text-white font-semibold hover:bg-warm-pink dark:hover:bg-accent-blue/80 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

