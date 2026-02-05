---
name: email-sender
description: Send emails via SMTP with attachment support. Use when the user wants to send an email, deliver notifications via email, or send files through email. Supports plain text, HTML, attachments, and multiple recipients.
---

# Email Sender

## Overview

This skill enables sending emails through SMTP servers with support for attachments, HTML content, and multiple recipients. Perfect for sending notifications, reports, or any content via email.

## Quick Start

Send a simple email:

```bash
node scripts/send_email.js \
  --to "recipient@example.com" \
  --subject "Hello" \
  --text "This is the email body"
```

Send with HTML content:

```bash
node scripts/send_email.js \
  --to "user@example.com" \
  --subject "Report" \
  --html "<h1>Monthly Report</h1><p>See attached.</p>" \
  --attach "/path/to/report.pdf"
```

## Configuration

SMTP credentials can be provided via:

1. **Environment variables** (recommended):
   ```bash
   export EMAIL_HOST=smtp.gmail.com
   export EMAIL_PORT=587
   export EMAIL_USER=your-email@gmail.com
   export EMAIL_PASS=your-app-password
   export EMAIL_FROM=your-email@gmail.com
   ```

2. **Command-line arguments** (see Usage below)

3. **Config file** (see references/smtp-providers.md for examples)

## Usage

### Basic Options

- `--to <email>`: Recipient email address (required, can specify multiple times)
- `--subject <text>`: Email subject (required)
- `--text <text>`: Plain text body
- `--html <html>`: HTML body (takes precedence over --text)
- `--from <email>`: Sender email (defaults to EMAIL_FROM env var)

### Attachment Options

- `--attach <path>`: File to attach (can specify multiple times)
- `--attach-name <name>`: Custom filename for last attachment

### SMTP Options

- `--host <host>`: SMTP server host (defaults to EMAIL_HOST env var)
- `--port <port>`: SMTP server port (defaults to EMAIL_PORT env var, typically 587 or 465)
- `--user <username>`: SMTP username (defaults to EMAIL_USER env var)
- `--pass <password>`: SMTP password (defaults to EMAIL_PASS env var)
- `--secure`: Use SSL/TLS (port 465)
- `--tls`: Force STARTTLS (port 587)

### Advanced Options

- `--cc <email>`: CC recipients (can specify multiple times)
- `--bcc <email>`: BCC recipients (can specify multiple times)
- `--reply-to <email>`: Reply-to address
- `--priority <low|normal|high>`: Email priority

## Examples

### Send to Multiple Recipients

```bash
node scripts/send_email.js \
  --to "alice@example.com" \
  --to "bob@example.com" \
  --subject "Team Update" \
  --text "Meeting at 3pm"
```

### Send with Attachments

```bash
node scripts/send_email.js \
  --to "manager@company.com" \
  --subject "Monthly Report" \
  --html "<p>Please find the report attached.</p>" \
  --attach "./report.pdf" \
  --attach "./charts.xlsx"
```

### Gmail Example

```bash
node scripts/send_email.js \
  --host "smtp.gmail.com" \
  --port 587 \
  --user "your-email@gmail.com" \
  --pass "your-app-password" \
  --from "your-email@gmail.com" \
  --to "recipient@example.com" \
  --subject "Test" \
  --text "Hello from Gmail"
```

### Send HTML Newsletter

```bash
node scripts/send_email.js \
  --to "subscribers@list.com" \
  --subject "Weekly Newsletter" \
  --html "$(cat newsletter.html)" \
  --from "newsletter@company.com"
```

## Common SMTP Providers

See [references/smtp-providers.md](references/smtp-providers.md) for configuration examples for:
- Gmail
- Outlook/Office 365
- Yahoo Mail
- SendGrid
- Mailgun
- Amazon SES
- Custom SMTP servers

## Troubleshooting

**Authentication failed**: Check username/password. For Gmail, you need an [App Password](https://support.google.com/accounts/answer/185833), not your regular password.

**Connection timeout**: Verify host and port. Most providers use port 587 (STARTTLS) or 465 (SSL).

**Attachment too large**: Most providers limit attachment size to 25MB. Consider using file-sharing links for larger files.

**SSL/TLS errors**: Try toggling between `--secure` (SSL/TLS) and `--tls` (STARTTLS) flags.
