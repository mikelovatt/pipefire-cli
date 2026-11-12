# Pipefire plugin for Hermes Agent

Pipefire (pipefire.ai) is cold email software for agencies that sets up and runs outreach for you. Pipefire buys and warms the sending domains and mailboxes, finds and verifies prospects, writes the emails and sorts the replies. You approve every email before it is sent.

This plugin connects Hermes to the Pipefire MCP server at `https://pipefire.ai/mcp` and adds two skills.

## What you get

16 free email deliverability tools. No account and no API key:

- MX, SPF, DKIM, DMARC, BIMI and MTA-STS checks
- Blacklist lookups for a domain or IP
- Email header analysis (why did this land in spam?)
- Cold email and subject line scoring, with fixes
- Sending domain ideas and email address guesses
- SPF, DMARC and DKIM record generators

Pipefire customers can also sign in with OAuth to read campaigns, replies, mailboxes and results, draft a campaign, rewrite a reply draft, and pause or resume a campaign. Sending and launching always happen in the Pipefire console.

## Install

```bash
hermes plugins install pipefire
hermes plugins enable pipefire
```

## Example prompts

- "Is example.com set up to send email?"
- "Check the DMARC record for example.com and tell me what to fix."
- "Score this cold email subject line: quick question about your roofing jobs"
- "Here are the headers from an email that went to spam. Why?"
- "Show me today's replies on my Pipefire account."

## Safety

The plugin marks the `pipefire` server as untrusted. Hermes asks you before any tool that changes something on a Pipefire account (pause, resume, create a campaign draft, redraft a reply, request a lead list), and refuses those tools in unattended runs. Every other tool is annotated read-only.

## Data handling

Every tool call goes to `pipefire.ai`. The free tools look up public DNS and blacklist data for the domain you give them. Account tools need you to sign in to Pipefire with OAuth and only see your own team's data. The plugin has no local code and stores no credentials.

- [Privacy policy](https://pipefire.ai/legal/privacy)
- [Terms](https://pipefire.ai/legal/terms)

## Support

- [Pipefire MCP server docs](https://pipefire.ai/mcp-server)
- [Report an issue](https://github.com/mikelovatt/pipefire-cli/issues)
- mike@pipefire.ai
