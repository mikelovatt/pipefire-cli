# pipefire

<img src="assets/logo-400.png" width="72" alt="Pipefire">

Free email deliverability checks from the terminal. Check a domain's SPF, DKIM, DMARC, MX, BIMI and MTA-STS records, look it up on spam blacklists, read raw email headers and score a cold email subject line.

No account. No API key. No dependencies.

```
npx pipefire check example.com
```

## Commands

| Command | What it does |
| --- | --- |
| `pipefire check <domain>` | MX, SPF, DKIM and DMARC in one go, each with pass, warn or fail and how to fix it |
| `pipefire dmarc <domain>` | DMARC policy and reports. Tells you if the domain can be impersonated by email |
| `pipefire spf <domain>` | SPF record and the 10 DNS lookup limit |
| `pipefire dkim <domain> [selector]` | DKIM public key. Google, Microsoft and common selectors are tried |
| `pipefire mx <domain>` | Mail servers and the email provider |
| `pipefire bimi <domain>` | BIMI logo record |
| `pipefire mta-sts <domain>` | MTA-STS policy |
| `pipefire blacklist <domain or ip>` | Spam blacklist lookup |
| `pipefire headers < headers.txt` | Read raw email headers: SPF, DKIM and DMARC results, hops and delays |
| `pipefire subject "<subject line>"` | Score a cold email subject line |
| `pipefire email --subject "..." < body.txt` | Score a whole cold email |
| `pipefire domains <brand>` | Ideas for separate cold email sending domains |
| `pipefire guess <first> <last> <domain>` | Likely email address formats for a person |
| `pipefire gen-dmarc <domain> --policy reject --rua you@x.com` | Build a DMARC record |
| `pipefire gen-spf google microsoft` | Build an SPF record |

Add `--json` to any command for raw output.

## Examples

```
$ npx pipefire dmarc example.com
DMARC check for example.com

DMARC (policy and reports): WARN
  Record: v=DMARC1;p=reject;sp=reject;adkim=s;aspf=s
  Found: Policy p=reject, with no reports address.
  Fix: Add rua=mailto:you@yourdomain so you receive the daily reports that show who sends as you.
```

```
pbpaste | npx pipefire headers
```

## Install

Run it with `npx` as above, or install it globally:

```
npm install -g pipefire
```

Needs Node 18 or newer.

## Use it in Claude, ChatGPT, Cursor, Cline or Gemini CLI

The same sixteen tools run as a remote MCP server at `https://pipefire.ai/mcp`. No install and no API key.

- **Cline / Cursor / any MCP client:** add a remote (streamable HTTP) server with the URL `https://pipefire.ai/mcp`. See [llms-install.md](llms-install.md).
- **Gemini CLI:** `gemini extensions install https://github.com/mikelovatt/pipefire-cli`
- **Claude Code:** `claude mcp add --transport http pipefire https://pipefire.ai/mcp`
- **Claude and ChatGPT:** steps at [pipefire.ai/mcp-server](https://pipefire.ai/mcp-server?utm_source=github).

## How it works

The CLI calls the same free tools as [pipefire.ai/tools](https://pipefire.ai/tools?utm_source=npm), through Pipefire's public MCP endpoint at `https://pipefire.ai/mcp`. Checks are rate limited per IP. Nothing you check is stored.

Use the tools in Claude, ChatGPT or Cursor instead: see [pipefire.ai/mcp-server](https://pipefire.ai/mcp-server?utm_source=npm).

## About Pipefire

[Pipefire](https://pipefire.ai?utm_source=npm) is done-for-you cold email for agencies. It buys and warms the sending domains and mailboxes, finds and verifies the prospects, writes the emails and sorts the replies. You approve every email before it goes out.

## License

MIT
