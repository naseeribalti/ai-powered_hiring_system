
const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = null;
        this.testmailConfig = null;
        this.isConfigured = false;
        this.templates = {};
        this.initialize();
    }

    // Initialize email service
    initialize() {
        const { EMAIL_SERVICE, EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM, TESTMAIL_API_KEY, TESTMAIL_NAMESPACE } = process.env;

        // Prefer Testmail in dev if configured
        if (TESTMAIL_API_KEY && TESTMAIL_NAMESPACE) {
            this.testmailConfig = { apiKey: TESTMAIL_API_KEY, namespace: TESTMAIL_NAMESPACE };
            this.fromEmail = EMAIL_FROM || 'AI Hiring System <dev@ai-hiring.app>';
            this.isConfigured = true;
            console.log('✅ Testmail configured');
            console.log('🔗 Inbox:', `https://testmail.app/inbox/${TESTMAIL_NAMESPACE}`);
            return;
        }

        // Fallback to SMTP if available
        if (!EMAIL_USER || !EMAIL_PASS) {
            console.warn('⚠️ Email configuration missing. Email service will be disabled.');
            this.isConfigured = false;
            return;
        }

        try {
            const transporterConfig = EMAIL_SERVICE ? {
                service: EMAIL_SERVICE,
                auth: { user: EMAIL_USER, pass: EMAIL_PASS }
            } : {
                host: EMAIL_HOST || 'smtp.gmail.com',
                port: parseInt(EMAIL_PORT) || 587,
                secure: false,
                auth: { user: EMAIL_USER, pass: EMAIL_PASS }
            };

            this.transporter = nodemailer.createTransport(transporterConfig);
            this.fromEmail = EMAIL_FROM || `"AI Hiring System" <${EMAIL_USER}>`;
            this.isConfigured = true;
            this.verifyConnection();
            console.log('✅ SMTP email service configured');
        } catch (error) {
            console.error('❌ Email service configuration failed:', error);
            this.isConfigured = false;
        }
    }

    // Verify email connection
    async verifyConnection() {
        if (!this.isConfigured) return false;

        try {
            await this.transporter.verify();
            console.log('✅ Email server connection verified');
            return true;
        } catch (error) {
            console.error('❌ Email server connection failed:', error);
            this.isConfigured = false;
            return false;
        }
    }

    // Email templates
    getTemplates() {
        return {
            // User Registration
            WELCOME: (user) => ({
                subject: `Welcome to AI Hiring System, ${user.name}!`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Welcome to AI Hiring System! 🎉</h2>
                        <p>Hello ${user.name},</p>
                        <p>Thank you for joining our AI-powered hiring platform. Your account has been successfully created.</p>
                        <p>Get started by:</p>
                        <ul>
                            <li>Completing your profile</li>
                            <li>Uploading your resume for AI analysis</li>
                            <li>Exploring job opportunities</li>
                        </ul>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL}/dashboard" 
                                 style="background-color: #2563eb; color: white; padding: 12px 24px; 
                                                text-decoration: none; border-radius: 5px; display: inline-block;">
                                Go to Dashboard
                            </a>
                        </div>
                        <p>Best regards,<br>The AI Hiring System Team</p>
                    </div>
                `
            }),

            // Recruiter Approval
            RECRUITER_APPROVED: (user) => ({
                subject: 'Your Recruiter Account Has Been Approved!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #10b981;">Recruiter Account Approved ✅</h2>
                        <p>Hello ${user.name},</p>
                        <p>Great news! Your recruiter account has been approved by our admin team.</p>
                        <p>You can now:</p>
                        <ul>
                            <li>Post job listings</li>
                            <li>Review candidate applications</li>
                            <li>Use AI-powered candidate matching</li>
                            <li>Manage your hiring pipeline</li>
                        </ul>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL}/recruiter/dashboard" 
                                 style="background-color: #10b981; color: white; padding: 12px 24px; 
                                                text-decoration: none; border-radius: 5px; display: inline-block;">
                                Start Hiring
                            </a>
                        </div>
                        <p>Happy hiring!<br>The AI Hiring System Team</p>
                    </div>
                `
            }),

            // Job Application Received
            APPLICATION_RECEIVED: ({ application, job, user }) => ({
                subject: `Application Received for ${job.title}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Application Submitted Successfully! 🚀</h2>
                        <p>Hello ${user.name},</p>
                        <p>Your application for <strong>${job.title}</strong> at <strong>${job.company}</strong> has been received.</p>
                        <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p><strong>Application Details:</strong></p>
                            <p>Position: ${job.title}</p>
                            <p>Company: ${job.company}</p>
                            <p>Location: ${job.location}</p>
                            <p>Application ID: ${application._id}</p>
                        </div>
                        <p>We'll notify you when the recruiter reviews your application. You can track your application status from your dashboard.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL}/applications" 
                                 style="background-color: #2563eb; color: white; padding: 12px 24px; 
                                                text-decoration: none; border-radius: 5px; display: inline-block;">
                                Track Applications
                            </a>
                        </div>
                        <p>Best of luck!<br>The AI Hiring System Team</p>
                    </div>
                `
            }),

            // Password Reset
            PASSWORD_RESET: ({ user, resetToken }) => ({
                subject: 'Password Reset Request - AI Hiring System',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #dc2626;">Reset Your Password</h2>
                        <p>Hello ${user.name},</p>
                        <p>We received a request to reset your password. Click the button below to create a new password:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" 
                                 style="background-color: #dc2626; color: white; padding: 12px 24px; 
                                                text-decoration: none; border-radius: 5px; display: inline-block;">
                                Reset Password
                            </a>
                        </div>
                        <p>This link will expire in 1 hour for security reasons.</p>
                        <p>If you didn't request this reset, please ignore this email.</p>
                        <p>Best regards,<br>The AI Hiring System Team</p>
                    </div>
                `
            }),

            // New Job Match
            JOB_MATCH: ({ user, job, matchScore }) => ({
                subject: `New Job Match: ${job.title} (${matchScore}% Match)`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #7c3aed;">Great Job Match Found! 🎯</h2>
                        <p>Hello ${user.name},</p>
                        <p>Our AI found a job that matches your profile with <strong>${matchScore}% compatibility</strong>!</p>
                        <div style="background-color: #faf5ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="color: #7c3aed; margin-top: 0;">${job.title}</h3>
                            <p><strong>Company:</strong> ${job.company}</p>
                            <p><strong>Location:</strong> ${job.location}</p>
                            <p><strong>Type:</strong> ${job.job_type}</p>
                            <p><strong>Salary:</strong> ${job.salary_range}</p>
                            <p><strong>Match Score:</strong> ${matchScore}%</p>
                        </div>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL}/jobs/${job._id}" 
                                 style="background-color: #7c3aed; color: white; padding: 12px 24px; 
                                                text-decoration: none; border-radius: 5px; display: inline-block;">
                                View Job & Apply
                            </a>
                        </div>
                        <p>Best regards,<br>The AI Hiring System Team</p>
                    </div>
                `
            })
        };
    }

    // Send via Testmail API
    async sendWithTestmail(to, subject, html, text = null) {
        try {
            const tag = Math.random().toString(36).slice(2);
            const testmailTo = `${tag}@${this.testmailConfig.namespace}.testmail.app`;
            const fetch = (await import('node-fetch')).default;
            const res = await fetch('https://api.testmail.app/api/json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.testmailConfig.apiKey}`
                },
                body: JSON.stringify({
                    from: this.fromEmail || 'AI Hiring System <dev@ai-hiring.app>',
                    to: testmailTo,
                    subject,
                    html,
                    text: text || this.htmlToText(html),
                    tag
                })
            });
            if (!res.ok) throw new Error(`Testmail HTTP ${res.status}`);
            const result = await res.json();
            const url = `https://testmail.app/inbox/${this.testmailConfig.namespace}/${tag}`;
            console.log('✅ Testmail sent. Preview:', url);
            return { success: true, testmailUrl: url, result };
        } catch (e) {
            console.error('❌ Testmail error:', e.message);
            return { success: false, error: e.message };
        }
    }

    // Send email
    async sendEmail(to, subject, html, text = null) {
        if (!this.isConfigured) {
            console.log('📧 [Console email]', { to, subject });
            return { success: true, method: 'console' };
        }

        if (this.testmailConfig) {
            return this.sendWithTestmail(to, subject, html, text);
        }

        try {
            const info = await this.transporter.sendMail({
                from: this.fromEmail,
                to: Array.isArray(to) ? to.join(', ') : to,
                subject,
                html,
                text: text || this.htmlToText(html)
            });
            console.log(`✅ SMTP email sent to ${to}`);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Error sending email:', error);
            return { success: false, error: error.message };
        }
    }

    // Send template email
    async sendTemplateEmail(to, templateName, templateData) {
        const templates = this.getTemplates();
        const template = templates[templateName];

        if (!template) {
            throw new Error(`Template '${templateName}' not found`);
        }

        const emailContent = template(templateData);
        return await this.sendEmail(to, emailContent.subject, emailContent.html);
    }

    // Utility: Convert HTML to plain text
    htmlToText(html) {
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Bulk email sending with rate limiting
    async sendBulkEmails(recipients, subject, html, options = {}) {
        const { batchSize = 10, delay = 1000 } = options;
        const results = [];

        for (let i = 0; i < recipients.length; i += batchSize) {
            const batch = recipients.slice(i, i + batchSize);

            const batchPromises = batch.map(recipient =>
                this.sendEmail(recipient, subject, html)
            );

            const batchResults = await Promise.allSettled(batchPromises);
            results.push(...batchResults);

            // Delay between batches to avoid rate limiting
            if (i + batchSize < recipients.length) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        return results;
    }

    // Get email service status
    getStatus() {
        return {
            isConfigured: this.isConfigured,
            service: this.testmailConfig ? 'testmail' : this.transporter ? 'smtp' : 'none',
            testmail: this.testmailConfig ? {
                namespace: this.testmailConfig.namespace,
                inboxUrl: `https://testmail.app/inbox/${this.testmailConfig.namespace}`
            } : null,
            from: this.fromEmail
        };
    }
}

module.exports = new EmailService();

