-- Customize Supabase email templates for CareerConnect
-- This script configures professional email templates with CareerConnect branding

-- Update auth configuration for custom email templates
UPDATE auth.config 
SET 
  site_url = 'https://careerconnect.app',
  email_from = 'CareerConnect <noreply@careerconnect.app>',
  email_from_name = 'CareerConnect Team'
WHERE TRUE;

-- Custom email confirmation template
INSERT INTO auth.email_templates (template_name, subject, body_html, body_text)
VALUES (
  'confirmation',
  'Welcome to CareerConnect - Confirm Your Email',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to CareerConnect</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #334155; background-color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 30px; text-align: center; }
        .logo { color: #06b6d4; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .header-text { color: #e2e8f0; font-size: 18px; margin: 0; }
        .content { padding: 40px 30px; }
        .welcome-text { font-size: 24px; font-weight: 600; color: #0f172a; margin-bottom: 20px; }
        .message { font-size: 16px; margin-bottom: 30px; line-height: 1.7; }
        .button { display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: transform 0.2s; }
        .button:hover { transform: translateY(-1px); }
        .footer { background-color: #f1f5f9; padding: 30px; text-align: center; font-size: 14px; color: #64748b; }
        .footer-links { margin-top: 20px; }
        .footer-links a { color: #06b6d4; text-decoration: none; margin: 0 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">CareerConnect</div>
            <p class="header-text">Your Professional Network Awaits</p>
        </div>
        <div class="content">
            <h1 class="welcome-text">Welcome to CareerConnect!</h1>
            <p class="message">
                Thank you for joining CareerConnect, the professional platform where careers flourish and connections matter. 
                We''re excited to help you discover amazing opportunities and build meaningful professional relationships.
            </p>
            <p class="message">
                To get started and access all features, please confirm your email address by clicking the button below:
            </p>
            <div style="text-align: center; margin: 40px 0;">
                <a href="{{ .ConfirmationURL }}" class="button">Confirm Your Email</a>
            </div>
            <p class="message">
                Once confirmed, you''ll be able to:
                <br>• Create your professional profile
                <br>• Search and apply for jobs
                <br>• Connect with industry professionals
                <br>• Get discovered by top employers
            </p>
        </div>
        <div class="footer">
            <p>This email was sent by CareerConnect. If you didn''t create an account, you can safely ignore this email.</p>
            <div class="footer-links">
                <a href="https://careerconnect.app">Visit CareerConnect</a>
                <a href="https://careerconnect.app/support">Get Support</a>
            </div>
        </div>
    </div>
</body>
</html>',
  'Welcome to CareerConnect!

Thank you for joining CareerConnect, the professional platform where careers flourish and connections matter.

To get started, please confirm your email address by clicking the link below:
{{ .ConfirmationURL }}

Once confirmed, you''ll be able to:
• Create your professional profile  
• Search and apply for jobs
• Connect with industry professionals
• Get discovered by top employers

If you didn''t create an account, you can safely ignore this email.

Best regards,
The CareerConnect Team

Visit us at: https://careerconnect.app'
) ON CONFLICT (template_name) DO UPDATE SET
  subject = EXCLUDED.subject,
  body_html = EXCLUDED.body_html,
  body_text = EXCLUDED.body_text;

-- Custom password recovery template
INSERT INTO auth.email_templates (template_name, subject, body_html, body_text)
VALUES (
  'recovery',
  'Reset Your CareerConnect Password',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - CareerConnect</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #334155; background-color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 30px; text-align: center; }
        .logo { color: #06b6d4; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .header-text { color: #e2e8f0; font-size: 18px; margin: 0; }
        .content { padding: 40px 30px; }
        .title { font-size: 24px; font-weight: 600; color: #0f172a; margin-bottom: 20px; }
        .message { font-size: 16px; margin-bottom: 30px; line-height: 1.7; }
        .button { display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; }
        .security-note { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 30px 0; border-radius: 4px; }
        .footer { background-color: #f1f5f9; padding: 30px; text-align: center; font-size: 14px; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">CareerConnect</div>
            <p class="header-text">Secure Password Recovery</p>
        </div>
        <div class="content">
            <h1 class="title">Reset Your Password</h1>
            <p class="message">
                We received a request to reset your CareerConnect password. If you made this request, 
                click the button below to create a new password:
            </p>
            <div style="text-align: center; margin: 40px 0;">
                <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
            </div>
            <div class="security-note">
                <strong>Security Notice:</strong> This link will expire in 1 hour for your security. 
                If you didn''t request this password reset, please ignore this email.
            </div>
        </div>
        <div class="footer">
            <p>For security questions, contact our support team at support@careerconnect.app</p>
        </div>
    </div>
</body>
</html>',
  'Reset Your CareerConnect Password

We received a request to reset your password. If you made this request, click the link below:

{{ .ConfirmationURL }}

This link will expire in 1 hour for your security.

If you didn''t request this password reset, please ignore this email.

Best regards,
The CareerConnect Team'
) ON CONFLICT (template_name) DO UPDATE SET
  subject = EXCLUDED.subject,
  body_html = EXCLUDED.body_html,
  body_text = EXCLUDED.body_text;

-- Custom magic link template  
INSERT INTO auth.email_templates (template_name, subject, body_html, body_text)
VALUES (
  'magic_link',
  'Your CareerConnect Login Link',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login to CareerConnect</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #334155; background-color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 30px; text-align: center; }
        .logo { color: #06b6d4; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .content { padding: 40px 30px; text-align: center; }
        .title { font-size: 24px; font-weight: 600; color: #0f172a; margin-bottom: 20px; }
        .message { font-size: 16px; margin-bottom: 30px; line-height: 1.7; }
        .button { display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; }
        .footer { background-color: #f1f5f9; padding: 30px; text-align: center; font-size: 14px; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">CareerConnect</div>
        </div>
        <div class="content">
            <h1 class="title">Login to CareerConnect</h1>
            <p class="message">Click the button below to securely log in to your CareerConnect account:</p>
            <div style="margin: 40px 0;">
                <a href="{{ .ConfirmationURL }}" class="button">Login to CareerConnect</a>
            </div>
            <p class="message">This link will expire in 1 hour for your security.</p>
        </div>
        <div class="footer">
            <p>If you didn''t request this login link, please ignore this email.</p>
        </div>
    </div>
</body>
</html>',
  'Login to CareerConnect

Click the link below to securely log in to your account:
{{ .ConfirmationURL }}

This link will expire in 1 hour for your security.

If you didn''t request this login link, please ignore this email.

Best regards,
The CareerConnect Team'
) ON CONFLICT (template_name) DO UPDATE SET
  subject = EXCLUDED.subject,
  body_html = EXCLUDED.body_html,
  body_text = EXCLUDED.body_text;
