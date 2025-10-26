// Privacy.jsx - Privacy Policy Page
import React from 'react';
import './Privacy.css';

const Privacy = () => {
    return (
        <div className="privacy-page">
            <section className="privacy-hero">
                <div className="container">
                    <h1 className="hero-title">Privacy Policy</h1>
                    <p className="hero-subtitle">Your privacy matters. Here's how we protect and use your data.</p>
                    <div className="meta">Last updated: January 5, 2025</div>
                </div>
            </section>

            <section className="privacy-content">
                <div className="container">
                    <div className="policy-card">
                        <h2>1. Introduction</h2>
                        <p>
                            We are committed to protecting your privacy and handling your data in an open and transparent manner.
                            This policy explains what data we collect, how we use it, and your rights.
                        </p>

                        <h2>2. Data We Collect</h2>
                        <ul>
                            <li>Account data: name, email, password (hashed), and role.</li>
                            <li>Profile data: resume, skills, education, experience, preferences.</li>
                            <li>Usage data: pages visited, interaction events, device and browser information.</li>
                            <li>Application data: jobs applied to, status updates, messages.</li>
                        </ul>

                        <h2>3. How We Use Your Data</h2>
                        <ul>
                            <li>To provide and improve our job matching and application services.</li>
                            <li>To personalize recommendations and content.</li>
                            <li>To communicate about updates, security, and support.</li>
                            <li>To maintain platform security, prevent fraud, and comply with legal obligations.</li>
                        </ul>

                        <h2>4. Cookies and Tracking</h2>
                        <p>
                            We use cookies and similar technologies to remember your preferences, keep you signed in, and analyze usage.
                            You can manage cookie preferences through your browser settings.
                        </p>

                        <h2>5. Data Sharing</h2>
                        <p>
                            We do not sell your personal data. We may share data with service providers who help us operate our platform
                            (e.g., hosting, analytics, communications) under strict confidentiality agreements.
                        </p>

                        <h2>6. Security</h2>
                        <p>
                            We implement technical and organizational measures to protect your data, including encryption in transit,
                            secure storage, and access controls.
                        </p>

                        <h2>7. Your Rights</h2>
                        <ul>
                            <li>Access, correct, or delete your data.</li>
                            <li>Object to or restrict certain processing.</li>
                            <li>Data portability and withdrawal of consent where applicable.</li>
                        </ul>

                        <h2>8. International Transfers</h2>
                        <p>
                            Your data may be processed in countries other than where you reside, with protections aligned to applicable laws.
                        </p>

                        <h2>9. Changes to This Policy</h2>
                        <p>
                            We may update this policy to reflect operational, legal, or regulatory changes. We will notify you of material updates.
                        </p>

                        <h2>10. Contact Us</h2>
                        <p>
                            If you have any questions about this policy or your data, contact us at privacy@aihiring.com.
                        </p>
                    </div>
                </div>
            </section>

            {/* Chatbot is global in App.js */}
        </div>
    );
};

export default Privacy;
