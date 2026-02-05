#!/usr/bin/env node

/**
 * Email Sender Script
 * 
 * Send emails via SMTP with attachment support.
 * Uses nodemailer for reliable email delivery.
 * 
 * Usage:
 *   node send_email.js --to user@example.com --subject "Hello" --text "Body"
 * 
 * Environment variables:
 *   EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM
 */

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Load configuration from YAML file
function loadConfig(configPath) {
  try {
    const configFile = fs.readFileSync(configPath, 'utf8');
    return yaml.load(configFile);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null; // Config file doesn't exist, that's okay
    }
    throw new Error(`Failed to load config file: ${error.message}`);
  }
}

// Get account configuration from config file
function getAccountConfig(config, accountName) {
  if (!config || !config.accounts) {
    return null;
  }
  
  const account = config.accounts[accountName];
  if (!account) {
    throw new Error(`Account '${accountName}' not found in config file`);
  }
  
  return account;
}

// Parse command-line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    to: [],
    cc: [],
    bcc: [],
    attachments: [],
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || '587',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM,
    secure: false,
    tls: true,
    configPath: path.join(__dirname, '..', 'email-config.yml'),
    account: null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case '--to':
        options.to.push(next);
        i++;
        break;
      case '--cc':
        options.cc.push(next);
        i++;
        break;
      case '--bcc':
        options.bcc.push(next);
        i++;
        break;
      case '--subject':
        options.subject = next;
        i++;
        break;
      case '--text':
        options.text = next;
        i++;
        break;
      case '--html':
        options.html = next;
        i++;
        break;
      case '--from':
        options.from = next;
        i++;
        break;
      case '--reply-to':
        options.replyTo = next;
        i++;
        break;
      case '--host':
        options.host = next;
        i++;
        break;
      case '--port':
        options.port = next;
        i++;
        break;
      case '--user':
        options.user = next;
        i++;
        break;
      case '--pass':
        options.pass = next;
        i++;
        break;
      case '--attach':
        options.attachments.push({ path: next });
        i++;
        break;
      case '--attach-name':
        if (options.attachments.length > 0) {
          options.attachments[options.attachments.length - 1].filename = next;
        }
        i++;
        break;
      case '--secure':
        options.secure = true;
        options.tls = false;
        break;
      case '--tls':
        options.tls = true;
        options.secure = false;
        break;
      case '--priority':
        options.priority = next;
        i++;
        break;
      case '--account':
        options.account = next;
        i++;
        break;
      case '--config':
        options.configPath = next;
        i++;
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
    }
  }

  return options;
}

function showHelp() {
  console.log(`
Email Sender - Send emails via SMTP

Usage:
  node send_email.js [options]

Required:
  --to <email>           Recipient email (can specify multiple)
  --subject <text>       Email subject

Content (at least one required):
  --text <text>          Plain text body
  --html <html>          HTML body (takes precedence over --text)

Optional:
  --from <email>         Sender email (default: EMAIL_FROM env var)
  --cc <email>           CC recipient (can specify multiple)
  --bcc <email>          BCC recipient (can specify multiple)
  --reply-to <email>     Reply-to address
  --attach <path>        Attach file (can specify multiple)
  --attach-name <name>   Custom filename for last attachment
  --priority <level>     Email priority (low, normal, high)

SMTP Configuration:
  --account <name>       Use account from config file (e.g., gmail, qq, work)
  --config <path>        Path to YAML config file (default: ./email-config.yml)
  --host <host>          SMTP server (default: EMAIL_HOST env var)
  --port <port>          SMTP port (default: EMAIL_PORT or 587)
  --user <username>      SMTP username (default: EMAIL_USER env var)
  --pass <password>      SMTP password (default: EMAIL_PASS env var)
  --secure               Use SSL/TLS (port 465)
  --tls                  Use STARTTLS (port 587, default)

Examples:
  # Simple email
  node send_email.js --to user@example.com --subject "Hello" --text "Hi there"

  # With attachment
  node send_email.js --to user@example.com --subject "Report" \\
    --html "<p>See attached</p>" --attach ./report.pdf

  # Multiple recipients
  node send_email.js --to alice@example.com --to bob@example.com \\
    --subject "Meeting" --text "3pm today"
`);
}

function validateOptions(options) {
  const errors = [];

  if (options.to.length === 0) {
    errors.push('At least one recipient (--to) is required');
  }

  if (!options.subject) {
    errors.push('Subject (--subject) is required');
  }

  if (!options.text && !options.html) {
    errors.push('Either --text or --html is required');
  }

  if (!options.host) {
    errors.push('SMTP host is required (--host or EMAIL_HOST env var)');
  }

  if (!options.user) {
    errors.push('SMTP user is required (--user or EMAIL_USER env var)');
  }

  if (!options.pass) {
    errors.push('SMTP password is required (--pass or EMAIL_PASS env var)');
  }

  if (!options.from) {
    errors.push('From address is required (--from or EMAIL_FROM env var)');
  }

  // Validate attachment files exist
  for (const att of options.attachments) {
    if (!fs.existsSync(att.path)) {
      errors.push(`Attachment not found: ${att.path}`);
    }
  }

  return errors;
}

async function sendEmail(options) {
  // Create transporter
  const transportConfig = {
    host: options.host,
    port: parseInt(options.port),
    secure: options.secure,
    auth: {
      user: options.user,
      pass: options.pass,
    },
  };

  if (options.tls) {
    transportConfig.requireTLS = true;
  }

  const transporter = nodemailer.createTransport(transportConfig);

  // Verify connection
  try {
    await transporter.verify();
    console.log('✓ SMTP connection verified');
  } catch (error) {
    throw new Error(`SMTP connection failed: ${error.message}`);
  }

  // Prepare email
  const mailOptions = {
    from: options.from,
    to: options.to.join(', '),
    subject: options.subject,
  };

  if (options.cc.length > 0) {
    mailOptions.cc = options.cc.join(', ');
  }

  if (options.bcc.length > 0) {
    mailOptions.bcc = options.bcc.join(', ');
  }

  if (options.replyTo) {
    mailOptions.replyTo = options.replyTo;
  }

  if (options.priority) {
    mailOptions.priority = options.priority;
  }

  if (options.html) {
    mailOptions.html = options.html;
    if (options.text) {
      mailOptions.text = options.text; // Fallback for plain text clients
    }
  } else {
    mailOptions.text = options.text;
  }

  if (options.attachments.length > 0) {
    mailOptions.attachments = options.attachments;
  }

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✓ Email sent successfully');
    console.log(`  Message ID: ${info.messageId}`);
    console.log(`  To: ${options.to.join(', ')}`);
    console.log(`  Subject: ${options.subject}`);
    if (options.attachments.length > 0) {
      console.log(`  Attachments: ${options.attachments.length}`);
    }
    return info;
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

// Main
async function main() {
  const options = parseArgs();

  // Load config file if it exists
  const config = loadConfig(options.configPath);
  
  // Apply account configuration if specified
  if (options.account || (config && config.default && !options.host)) {
    const accountName = options.account || config.default;
    const accountConfig = getAccountConfig(config, accountName);
    
    if (accountConfig) {
      console.log(`✓ Using account: ${accountName}`);
      
      // Apply account settings (command-line args take precedence)
      if (!options.host) options.host = accountConfig.host;
      if (!options.port || options.port === '587') options.port = accountConfig.port?.toString() || '587';
      if (!options.user) options.user = accountConfig.user;
      if (!options.pass) options.pass = accountConfig.pass;
      if (!options.from) options.from = accountConfig.from;
      if (accountConfig.replyTo && !options.replyTo) options.replyTo = accountConfig.replyTo;
      
      // Apply secure/tls settings
      if (accountConfig.secure !== undefined) {
        options.secure = accountConfig.secure;
        options.tls = !accountConfig.secure;
      }
    }
  }

  // Validate
  const errors = validateOptions(options);
  if (errors.length > 0) {
    console.error('Error: Missing required options\n');
    errors.forEach(err => console.error(`  - ${err}`));
    console.error('\nRun with --help for usage information');
    process.exit(1);
  }

  // Send
  try {
    await sendEmail(options);
    process.exit(0);
  } catch (error) {
    console.error(`\n✗ ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { sendEmail, parseArgs };
