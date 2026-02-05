# SMTP Provider Configuration Examples

Common SMTP provider settings and setup instructions.

## Gmail

**Settings:**
- Host: `smtp.gmail.com`
- Port: `587` (STARTTLS) or `465` (SSL)
- Security: TLS/SSL

**Setup:**
1. Enable 2-factor authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password (not your regular password)

**Environment variables:**
```bash
export EMAIL_HOST=smtp.gmail.com
export EMAIL_PORT=587
export EMAIL_USER=your-email@gmail.com
export EMAIL_PASS=your-16-char-app-password
export EMAIL_FROM=your-email@gmail.com
```

**Command example:**
```bash
node send_email.js \
  --host smtp.gmail.com \
  --port 587 \
  --tls \
  --user your-email@gmail.com \
  --pass your-app-password \
  --from your-email@gmail.com \
  --to recipient@example.com \
  --subject "Test" \
  --text "Hello"
```

## Outlook / Office 365

**Settings:**
- Host: `smtp-mail.outlook.com` (personal) or `smtp.office365.com` (business)
- Port: `587` (STARTTLS)
- Security: TLS

**Environment variables:**
```bash
export EMAIL_HOST=smtp-mail.outlook.com
export EMAIL_PORT=587
export EMAIL_USER=your-email@outlook.com
export EMAIL_PASS=your-password
export EMAIL_FROM=your-email@outlook.com
```

## Yahoo Mail

**Settings:**
- Host: `smtp.mail.yahoo.com`
- Port: `587` (STARTTLS) or `465` (SSL)
- Security: TLS/SSL

**Setup:**
1. Enable "Allow apps that use less secure sign in" in Yahoo account settings
2. Or generate an App Password for better security

**Environment variables:**
```bash
export EMAIL_HOST=smtp.mail.yahoo.com
export EMAIL_PORT=587
export EMAIL_USER=your-email@yahoo.com
export EMAIL_PASS=your-password-or-app-password
export EMAIL_FROM=your-email@yahoo.com
```

## QQ Mail (腾讯邮箱)

**Settings:**
- Host: `smtp.qq.com`
- Port: `587` (STARTTLS) or `465` (SSL)
- Security: TLS/SSL

**Setup:**
1. 登录QQ邮箱 → 设置 → 账户
2. 找到"POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务"
3. 开启"IMAP/SMTP服务"，获取授权码
4. 使用授权码作为密码（不是QQ密码）

**环境变量：**
```bash
export EMAIL_HOST=smtp.qq.com
export EMAIL_PORT=587
export EMAIL_USER=your-qq-number@qq.com
export EMAIL_PASS=your-authorization-code
export EMAIL_FROM=your-qq-number@qq.com
```

## 163 Mail (网易邮箱)

**Settings:**
- Host: `smtp.163.com`
- Port: `465` (SSL) or `25` (non-secure)
- Security: SSL recommended

**Setup:**
1. 登录163邮箱 → 设置 → POP3/SMTP/IMAP
2. 开启"SMTP服务"，获取授权码
3. 使用授权码作为密码

**环境变量：**
```bash
export EMAIL_HOST=smtp.163.com
export EMAIL_PORT=465
export EMAIL_USER=your-email@163.com
export EMAIL_PASS=your-authorization-code
export EMAIL_FROM=your-email@163.com
```

## SendGrid

**Settings:**
- Host: `smtp.sendgrid.net`
- Port: `587` (STARTTLS) or `465` (SSL)
- Username: `apikey` (literal string)
- Password: Your SendGrid API key

**Environment variables:**
```bash
export EMAIL_HOST=smtp.sendgrid.net
export EMAIL_PORT=587
export EMAIL_USER=apikey
export EMAIL_PASS=SG.your-api-key
export EMAIL_FROM=verified-sender@yourdomain.com
```

## Mailgun

**Settings:**
- Host: `smtp.mailgun.org`
- Port: `587` (STARTTLS) or `465` (SSL)
- Username: Your Mailgun SMTP username
- Password: Your Mailgun SMTP password

**Environment variables:**
```bash
export EMAIL_HOST=smtp.mailgun.org
export EMAIL_PORT=587
export EMAIL_USER=postmaster@your-domain.mailgun.org
export EMAIL_PASS=your-mailgun-smtp-password
export EMAIL_FROM=sender@yourdomain.com
```

## Amazon SES

**Settings:**
- Host: `email-smtp.[region].amazonaws.com` (e.g., `email-smtp.us-east-1.amazonaws.com`)
- Port: `587` (STARTTLS) or `465` (SSL)
- Username: Your SMTP username (from SES console)
- Password: Your SMTP password (from SES console)

**Environment variables:**
```bash
export EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
export EMAIL_PORT=587
export EMAIL_USER=your-smtp-username
export EMAIL_PASS=your-smtp-password
export EMAIL_FROM=verified-email@yourdomain.com
```

**Note:** Email address must be verified in SES console.

## Aliyun DirectMail (阿里云邮件推送)

**Settings:**
- Host: `smtpdm.aliyun.com`
- Port: `465` (SSL) or `80` (non-secure)
- Security: SSL recommended

**Environment variables:**
```bash
export EMAIL_HOST=smtpdm.aliyun.com
export EMAIL_PORT=465
export EMAIL_USER=your-aliyun-account
export EMAIL_PASS=your-smtp-password
export EMAIL_FROM=noreply@your-domain.com
```

## Tencent Exmail (腾讯企业邮箱)

**Settings:**
- Host: `smtp.exmail.qq.com`
- Port: `587` (STARTTLS) or `465` (SSL)

**Environment variables:**
```bash
export EMAIL_HOST=smtp.exmail.qq.com
export EMAIL_PORT=587
export EMAIL_USER=your-email@yourdomain.com
export EMAIL_PASS=your-password-or-app-password
export EMAIL_FROM=your-email@yourdomain.com
```

## Custom SMTP Server

For any custom SMTP server:

```bash
export EMAIL_HOST=smtp.yourdomain.com
export EMAIL_PORT=587  # or 465 for SSL
export EMAIL_USER=username
export EMAIL_PASS=password
export EMAIL_FROM=sender@yourdomain.com
```

Use `--tls` for port 587 (STARTTLS) or `--secure` for port 465 (SSL/TLS).

## Testing Your Configuration

Quick test command:
```bash
node scripts/send_email.js \
  --to your-test-email@example.com \
  --subject "SMTP Test" \
  --text "If you receive this, your SMTP configuration is working!"
```

## Troubleshooting

### Authentication Failed
- Check username and password
- For Gmail/Yahoo/QQ/163: Use App Password, not your login password
- Verify 2FA is enabled if required

### Connection Timeout
- Verify host and port
- Check firewall settings
- Try alternative ports (587 vs 465)

### SSL/TLS Errors
- Toggle between `--tls` (STARTTLS) and `--secure` (SSL) flags
- Some providers require specific security modes

### Rate Limits
- Gmail: 500 emails/day (free), 2000/day (Google Workspace)
- Most providers: Check their documentation for limits
- For bulk sending, use dedicated services (SendGrid, Mailgun, SES)
