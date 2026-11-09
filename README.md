# Pipefire email deliverability tools

<img src="assets/logo-400.png" width="72" alt="Pipefire">

Sixteen free email deliverability tools for your AI agent and your terminal. Check a domain's SPF, DKIM, DMARC, MX, BIMI and MTA-STS records, look it up on spam blacklists, read raw email headers, score a cold email and its subject line, and build SPF, DMARC and DKIM records.

Built by [Pipefire](https://pipefire.ai?utm_source=github), cold email software for agencies. The SPF, DMARC and MX checks use the same code Pipefire uses to check its own sending domains, and the cold email checker scores against the same writing rules.

No account. No API key. Nothing you check is stored.

## Connect it to your AI agent

It runs as a remote MCP server (streamable HTTP):

```
https://pipefire.ai/mcp
```

- **LobeHub, Cline, Cursor or any MCP client:** add a remote server with the URL above. See [llms-install.md](llms-install.md).
- **Claude Code:** `claude mcp add --transport http pipefire https://pipefire.ai/mcp`
- **Gemini CLI:** `gemini extensions install https://github.com/mikelovatt/pipefire-cli`
- **Claude and ChatGPT:** step by step at [pipefire.ai/mcp-server](https://pipefire.ai/mcp-server?utm_source=github).

Then ask in plain words, for example "Is example.com set up to send email?" or "Score this cold email before I send it".

## Tools

Every tool is read-only. Each one also has a free web version on pipefire.ai.

| Tool | What it does | On the web |
| --- | --- | --- |
| `check_domain_email_setup` | MX, SPF, DKIM and DMARC in one go, each with pass, warn or fail and how to fix it | [Domain checker](https://pipefire.ai/tools/domain-checker?utm_source=github) |
| `check_dmarc` | DMARC policy and reports. Tells you if the domain can be impersonated by email | [DMARC checker](https://pipefire.ai/tools/dmarc-checker?utm_source=github) |
| `check_spf` | SPF record, and whether it stays under the 10 DNS lookup limit | [SPF checker](https://pipefire.ai/tools/spf-checker?utm_source=github) |
| `check_dkim` | DKIM public key. Google Workspace, Microsoft 365 and common selectors are tried | [DKIM checker](https://pipefire.ai/tools/dkim-checker?utm_source=github) |
| `check_mx` | Mail servers and which provider handles the domain's email | |
| `check_bimi` | BIMI logo record, and whether DMARC is strict enough for it | [BIMI checker](https://pipefire.ai/tools/bimi-checker?utm_source=github) |
| `check_mta_sts` | MTA-STS policy, which forces encrypted delivery of incoming mail | [MTA-STS checker](https://pipefire.ai/tools/mta-sts-checker?utm_source=github) |
| `check_blacklists` | Whether the domain's sending IPs, or one IPv4 address, are on the major spam blacklists | [Blacklist checker](https://pipefire.ai/tools/blacklist-checker?utm_source=github) |
| `analyze_email_headers` | Reads raw email headers: SPF, DKIM and DMARC results, alignment, hops and delays | [Header analyzer](https://pipefire.ai/tools/email-header-analyzer?utm_source=github) |
| `check_cold_email` | Scores a cold email out of 10 against the rules Pipefire checks its own emails with | [Cold email checker](https://pipefire.ai/tools/cold-email-checker?utm_source=github) |
| `test_subject_line` | Scores a subject line out of 10: length, wording that hurts opens, spam triggers | [Subject line tester](https://pipefire.ai/tools/subject-line-tester?utm_source=github) |
| `suggest_sending_domains` | Lookalike sending domains, so your main domain never sends cold email | [Sending domain generator](https://pipefire.ai/tools/sending-domain-generator?utm_source=github) |
| `guess_email_addresses` | Likely email address formats for a person at a company | [Email permutator](https://pipefire.ai/tools/email-permutator?utm_source=github) |
| `generate_spf_record` | Builds an SPF record from the services the domain sends with | [SPF generator](https://pipefire.ai/tools/spf-record-generator?utm_source=github) |
| `generate_dmarc_record` | Builds a DMARC record from a policy and a reports address | [DMARC generator](https://pipefire.ai/tools/dmarc-record-generator?utm_source=github) |
| `generate_dkim_record` | Formats a DKIM public key as the TXT record to publish | [DKIM generator](https://pipefire.ai/tools/dkim-record-generator?utm_source=github) |

The server also offers a guides resource and two prompts: a full domain audit with a prioritised fix list, and "why did this land in spam?" from a message's headers.

## From the terminal

The same tools as a command line app. Needs Node 18 or newer, no dependencies.

```
npx pipefire check example.com
```

| Command | What it does |
| --- | --- |
| `pipefire check <domain>` | MX, SPF, DKIM and DMARC in one go |
| `pipefire dmarc <domain>` | DMARC policy and reports |
| `pipefire spf <domain>` | SPF record and the 10 DNS lookup limit |
| `pipefire dkim <domain> [selector]` | DKIM public key |
| `pipefire mx <domain>` | Mail servers and the email provider |
| `pipefire bimi <domain>` | BIMI logo record |
| `pipefire mta-sts <domain>` | MTA-STS policy |
| `pipefire blacklist <domain or ip>` | Spam blacklist lookup |
| `pipefire headers < headers.txt` | Read raw email headers |
| `pipefire subject "<subject line>"` | Score a cold email subject line |
| `pipefire email --subject "..." < body.txt` | Score a whole cold email |
| `pipefire domains <brand>` | Ideas for separate cold email sending domains |
| `pipefire guess <first> <last> <domain>` | Likely email address formats for a person |
| `pipefire gen-dmarc <domain> --policy reject --rua you@x.com` | Build a DMARC record |
| `pipefire gen-spf google microsoft` | Build an SPF record |

Add `--json` to any command for raw output. Install it globally with `npm install -g pipefire`.

```
$ npx pipefire dmarc example.com
DMARC check for example.com

DMARC (policy and reports): WARN
  Record: v=DMARC1;p=reject;sp=reject;adkim=s;aspf=s
  Found: Policy p=reject, with no reports address.
  Fix: Add rua=mailto:you@yourdomain so you receive the daily reports that show who sends as you.
```

## How it works

Every tool calls the same code as the free tools at [pipefire.ai/tools](https://pipefire.ai/tools?utm_source=github), through Pipefire's public MCP endpoint. Checks are rate limited per IP. Nothing you check is stored.

## About Pipefire

[Pipefire](https://pipefire.ai?utm_source=github) is cold email software for agencies that sets up and runs outreach for you. It buys the sending domains, sets up the mailboxes and warms them for 14 days before any cold email goes out. It finds prospects, writes the emails, sends them at a safe daily pace and sorts the replies. You approve every email before it is sent, and your company domain never sends cold email.

- [How Pipefire works](https://pipefire.ai/features?utm_source=github)
- [Pricing](https://pipefire.ai/pricing?utm_source=github)
- [Start with Pipefire](https://pipefire.ai/sign-up?utm_source=github)

## License

MIT
