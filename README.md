# Email Sender Skill for OpenClaw

Send emails via SMTP with support for attachments, HTML content, and multiple accounts.

## Features

- ✅ **Multiple email accounts** - Manage multiple SMTP accounts in one config file
- ✅ **Attachments** - Send files with your emails
- ✅ **HTML support** - Send rich HTML emails
- ✅ **Multiple recipients** - To, CC, BCC support
- ✅ **Popular providers** - Pre-configured examples for Gmail, QQ, 163, Outlook, etc.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Your Email Accounts

Copy the example config:

```bash
cp email-config.example.yml email-config.yml
```

Edit `email-config.yml` with your SMTP credentials:

```yaml
default: gmail

accounts:
  gmail:
    host: smtp.gmail.com
    port: 587
    secure: false
    user: your-email@gmail.com
    pass: your-app-password  # Use App Password, not regular password!
    from: your-email@gmail.com
```

### 3. Send Your First Email

```bash
node scripts/send_email.js \
  --account gmail \
  --to "recipient@example.com" \
  --subject "Hello from OpenClaw" \
  --text "This is a test email"
```

## Usage

### Basic Email

```bash
node scripts/send_email.js \
  --to "user@example.com" \
  --subject "Hello" \
  --text "Email body here"
```

### With Attachments

```bash
node scripts/send_email.js \
  --to "user@example.com" \
  --subject "Report" \
  --html "<h1>Monthly Report</h1>" \
  --attach "./report.pdf"
```

### Multiple Recipients

```bash
node scripts/send_email.js \
  --to "alice@example.com" \
  --to "bob@example.com" \
  --cc "manager@example.com" \
  --subject "Team Update" \
  --text "Meeting at 3pm"
```

### Switch Accounts

```bash
# Use Gmail account
node scripts/send_email.js --account gmail \
  --to "friend@example.com" --subject "Personal" --text "Hi!"

# Use work account
node scripts/send_email.js --account work \
  --to "colleague@company.com" --subject "Work" --text "Update"
```

## Configuration

### Config File (Recommended)

Create `email-config.yml`:

```yaml
default: gmail  # Default account when --account is not specified

accounts:
  gmail:
    host: smtp.gmail.com
    port: 587
    secure: false
    user: your-email@gmail.com
    pass: your-app-password
    from: your-email@gmail.com
  
  qq:
    host: smtp.qq.com
    port: 587
    secure: false
    user: your-qq@qq.com
    pass: your-authorization-code
    from: your-qq@qq.com
  
  work:
    host: smtp.company.com
    port: 587
    secure: false
    user: you@company.com
    pass: your-password
    from: you@company.com
    replyTo: support@company.com
```

### Environment Variables

```bash
export EMAIL_HOST=smtp.gmail.com
export EMAIL_PORT=587
export EMAIL_USER=your-email@gmail.com
export EMAIL_PASS=your-app-password
export EMAIL_FROM=your-email@gmail.com
```

### Command-Line Arguments

All SMTP settings can be provided via command-line:

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

## SMTP Provider Setup

See [references/smtp-providers.md](references/smtp-providers.md) for detailed setup instructions for:

- Gmail (requires App Password)
- QQ Mail (requires authorization code)
- 163 Mail (requires authorization code)
- Outlook / Office 365
- Yahoo Mail
- SendGrid / Mailgun / Amazon SES
- Custom SMTP servers

## Options

Run `node scripts/send_email.js --help` for full options list.

### Key Options

- `--account <name>` - Use account from config file
- `--config <path>` - Custom config file path
- `--to <email>` - Recipient (can repeat)
- `--subject <text>` - Email subject
- `--text <text>` - Plain text body
- `--html <html>` - HTML body
- `--attach <path>` - Attach file (can repeat)
- `--cc <email>` - CC recipient
- `--bcc <email>` - BCC recipient

## Troubleshooting

**Authentication failed?**
- For Gmail: Use [App Password](https://support.google.com/accounts/answer/185833), enable 2FA first
- For QQ/163: Generate authorization code in email settings

**Connection timeout?**
- Check host and port (587 for STARTTLS, 465 for SSL)
- Verify firewall settings

**SSL/TLS errors?**
- Try toggling `secure: true/false` in config
- Port 587 → `secure: false`, Port 465 → `secure: true`

## License

MIT

## Author

chaojimct
