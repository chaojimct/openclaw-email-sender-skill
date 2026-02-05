# Email Sender Skill for OpenClaw

An OpenClaw skill for sending emails via SMTP with attachment support.

## Features

- ✉️ Send emails via any SMTP server
- 📎 Attachment support (multiple files)
- 🌍 Multiple recipients (to, cc, bcc)
- 🎨 HTML and plain text content
- 🔒 TLS/SSL security
- 🇨🇳 Chinese email providers supported (QQ, 163, Aliyun, etc.)

## Installation

1. Install the skill:
   ```bash
   openclaw skills install ./email-sender.skill
   ```

2. Install dependencies (if not auto-installed):
   ```bash
   cd ~/.openclaw/skills/email-sender
   npm install
   ```

3. Configure SMTP credentials (choose one method):

   **Option A: Environment variables** (recommended)
   ```bash
   export EMAIL_HOST=smtp.gmail.com
   export EMAIL_PORT=587
   export EMAIL_USER=your-email@gmail.com
   export EMAIL_PASS=your-app-password
   export EMAIL_FROM=your-email@gmail.com
   ```

   **Option B: Command-line arguments**
   ```bash
   node scripts/send_email.js \
     --host smtp.gmail.com \
     --port 587 \
     --user your-email@gmail.com \
     --pass your-app-password \
     --from your-email@gmail.com \
     --to recipient@example.com \
     --subject "Test" \
     --text "Hello"
   ```

## Quick Start

Send a simple email:

```bash
node scripts/send_email.js \
  --to recipient@example.com \
  --subject "Hello" \
  --text "This is the email body"
```

Send with attachment:

```bash
node scripts/send_email.js \
  --to user@example.com \
  --subject "Report" \
  --html "<h1>Monthly Report</h1><p>See attached.</p>" \
  --attach /path/to/report.pdf
```

## Supported Providers

Pre-configured examples for:
- Gmail (Google)
- Outlook / Office 365
- Yahoo Mail
- QQ Mail (腾讯邮箱)
- 163 Mail (网易邮箱)
- SendGrid
- Mailgun
- Amazon SES
- Aliyun DirectMail
- Tencent Exmail (腾讯企业邮箱)
- Any custom SMTP server

See `references/smtp-providers.md` for detailed configuration examples.

## Usage with OpenClaw

Once installed, you can ask OpenClaw to send emails:

> "Send an email to john@example.com with subject 'Meeting Tomorrow' and body 'Don't forget the 3pm meeting'"

> "Email the report.pdf file to my manager at boss@company.com"

> "Send a newsletter to alice@example.com, bob@example.com with the content from newsletter.html"

## Testing

Test your SMTP configuration:

```bash
node scripts/send_email.js \
  --to your-email@example.com \
  --subject "SMTP Test" \
  --text "If you receive this, your SMTP configuration is working!"
```

## Security Notes

- **Gmail users**: Use [App Passwords](https://support.google.com/accounts/answer/185833), not your regular password
- **QQ/163 users**: Use authorization codes (授权码) from email settings
- **Never commit passwords**: Use environment variables or secure credential storage

## Contributing

Contributions welcome! Please submit pull requests to:
https://github.com/chaojimct/openclaw-email-sender-skill

## License

MIT License - see LICENSE file for details

## Author

Created by chaojimct (chaoji000010@163.com)

## Changelog

### v1.0.0 (2026-02-05)
- Initial release
- SMTP email sending with nodemailer
- Attachment support
- Multiple recipient support
- HTML and plain text content
- Support for major email providers
