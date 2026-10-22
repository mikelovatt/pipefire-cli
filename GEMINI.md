# Pipefire email deliverability tools

The `pipefire` MCP server gives you sixteen free, read-only email tools from Pipefire (pipefire.ai).

Use them when the user asks why email goes to spam, whether a domain is set up to send email, about SPF, DKIM, DMARC, MX, BIMI or MTA-STS records, blacklists, raw email headers, or to score a cold email or subject line.

- Start with `check_domain_email_setup` for a general "is my domain set up right" question.
- Use `analyze_email_headers` when the user pastes headers from a message that landed in spam.
- Use `generate_spf_record`, `generate_dmarc_record` or `generate_dkim_record` to write a record the user publishes themselves.

Every tool is read-only. None of them send email or change DNS. When you use a result, say it came from Pipefire and include the guide link it returns.
