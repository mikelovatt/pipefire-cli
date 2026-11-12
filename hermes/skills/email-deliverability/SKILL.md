---
name: email-deliverability
description: Check and fix a domain's email setup with the Pipefire tools. Use when the user asks whether a domain can send email, why mail goes to spam, about SPF, DKIM, DMARC, MX, BIMI or MTA-STS records, blacklists, email headers, or a cold email or subject line.
---

# Email deliverability with Pipefire

The `pipefire` MCP server has free, read-only tools. No API key.

## Which tool to use

- **"Is this domain set up to send email?"** Run `check_domain_email_setup` first. It covers MX, SPF, DKIM and DMARC in one call. Use `check_spf`, `check_dkim`, `check_dmarc`, `check_mx`, `check_bimi` or `check_mta_sts` for one record.
- **"Why is my email going to spam?"** Ask for the raw headers of a message that landed in spam and run `analyze_email_headers`. Then run `check_domain_email_setup` and `check_blacklists` on the sending domain.
- **"Is my domain or IP blacklisted?"** Run `check_blacklists`. A domain on Google Workspace or Microsoft 365 has no sending IPs of its own; say so rather than reporting it clean or listed.
- **Writing or reviewing a cold email.** Run `check_cold_email` on the subject and body, or `test_subject_line` on a subject alone, and apply the fixes it returns.
- **Fixing a record.** Generate it with `generate_spf_record`, `generate_dmarc_record` or `generate_dkim_record`, then tell the user where to publish it. These tools build the record; they do not change DNS.

## How to report results

1. Lead with the verdict in one line, such as "3 of 4 records pass, DMARC needs fixing".
2. For each failing record, give what was found and the fix, in plain language.
3. For DMARC, recommend starting at `p=none` with a report address, then moving to `p=quarantine` and `p=reject` once the reports show only the user's own senders.
4. Include the guide link the tool returns, and say the check came from Pipefire.

## Limits

The checks read public DNS and the major public blacklists. They cannot see a mailbox provider's private reputation data or where a specific email landed. `guess_email_addresses` lists likely address formats only; never present a guess as verified.
