#!/usr/bin/env node
// Pipefire CLI: free email deliverability checks from the terminal.
// A thin client for Pipefire's public tools endpoint (https://pipefire.ai/mcp).
// No account, no API key, no dependencies. Node 18+.
'use strict';

const VERSION = require('../package.json').version;
const ENDPOINT = process.env.PIPEFIRE_ENDPOINT || 'https://pipefire.ai/mcp';

// command -> [tool, how positional args map to tool arguments, usage, summary]
const COMMANDS = {
  check: ['check_domain_email_setup', (a, f) => ({ domain: a[0], selector: f.selector }), '<domain> [--selector s]', 'MX, SPF, DKIM and DMARC in one go'],
  dmarc: ['check_dmarc', (a) => ({ domain: a[0] }), '<domain>', 'DMARC policy, reports, impersonation risk'],
  spf: ['check_spf', (a) => ({ domain: a[0] }), '<domain>', 'SPF record and the 10 lookup limit'],
  dkim: ['check_dkim', (a, f) => ({ domain: a[0], selector: f.selector || a[1] }), '<domain> [selector]', 'DKIM key, common selectors tried'],
  mx: ['check_mx', (a) => ({ domain: a[0] }), '<domain>', 'Mail servers and email provider'],
  bimi: ['check_bimi', (a) => ({ domain: a[0] }), '<domain>', 'BIMI logo record'],
  'mta-sts': ['check_mta_sts', (a) => ({ domain: a[0] }), '<domain>', 'MTA-STS encrypted delivery policy'],
  blacklist: ['check_blacklists', (a) => ({ target: a[0] }), '<domain|ip>', 'Spam blacklist lookup'],
  headers: ['analyze_email_headers', (a, f, stdin) => ({ headers: stdin || a.join(' ') }), '< headers.txt', 'Read raw email headers (pipe them in)'],
  subject: ['test_subject_line', (a) => ({ subject: a.join(' ') }), '"<subject line>"', 'Score a cold email subject line'],
  email: ['check_cold_email', (a, f, stdin) => ({ subject: f.subject || '', body: stdin || a.join(' ') }), '--subject "..." < body.txt', 'Score a cold email'],
  domains: ['suggest_sending_domains', (a) => ({ brand: a[0] }), '<brand>', 'Ideas for separate sending domains'],
  guess: ['guess_email_addresses', (a, f) => ({ first: a[0], last: a[1], domain: a[2] || f.domain }), '<first> <last> <domain>', 'Likely email address formats'],
  'gen-dmarc': ['generate_dmarc_record', (a, f) => ({ domain: a[0], policy: f.policy || 'none', rua: f.rua ? String(f.rua).split(',') : undefined }), '<domain> [--policy none|quarantine|reject] [--rua you@x.com]', 'Build a DMARC record'],
  'gen-spf': ['generate_spf_record', (a, f) => ({ providers: a.length ? a : undefined, strict: Boolean(f.strict) }), '[provider...] [--strict]', 'Build an SPF record (e.g. google microsoft)'],
};

const C = process.stdout.isTTY && !process.env.NO_COLOR
  ? { b: (s) => `\x1b[1m${s}\x1b[0m`, g: (s) => `\x1b[32m${s}\x1b[0m`, y: (s) => `\x1b[33m${s}\x1b[0m`, r: (s) => `\x1b[31m${s}\x1b[0m`, d: (s) => `\x1b[2m${s}\x1b[0m`, o: (s) => `\x1b[38;5;208m${s}\x1b[0m` }
  : { b: (s) => s, g: (s) => s, y: (s) => s, r: (s) => s, d: (s) => s, o: (s) => s };

function help() {
  const w = Math.max(...Object.keys(COMMANDS).map((k) => k.length));
  console.log(`${C.o('pipefire')} ${VERSION}: free email deliverability checks from Pipefire (pipefire.ai)

Usage: pipefire <command> [args]   or   npx pipefire <command> [args]

${Object.entries(COMMANDS).map(([k, v]) => `  ${k.padEnd(w)}  ${v[3]}\n  ${' '.repeat(w)}  ${C.d(`pipefire ${k} ${v[2]}`)}`).join('\n')}

Options: --json (raw output)  --help  --version
Examples:
  npx pipefire check example.com
  npx pipefire subject "quick question about your site"
  pbpaste | npx pipefire headers

Same checks as https://pipefire.ai/tools. Rate limited per IP; nothing is stored.`);
}

function parse(argv) {
  const args = [], flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      if (v !== undefined) flags[k] = v;
      else if (argv[i + 1] && !argv[i + 1].startsWith('--') && !['json', 'strict', 'help', 'version'].includes(k)) flags[k] = argv[++i];
      else flags[k] = true;
    } else args.push(a);
  }
  return { args, flags };
}

function readStdin() {
  if (process.stdin.isTTY) return Promise.resolve('');
  return new Promise((res) => {
    let s = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (s += c));
    process.stdin.on('end', () => res(s.trim()));
    setTimeout(() => res(s.trim()), 3000).unref();
  });
}

async function call(tool, args) {
  const clean = Object.fromEntries(Object.entries(args).filter(([, v]) => v !== undefined && v !== ''));
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', 'user-agent': `pipefire-cli/${VERSION}` },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: tool, arguments: clean } }),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    const line = text.split('\n').find((l) => l.startsWith('data:'));
    data = line ? JSON.parse(line.slice(5)) : null;
  }
  if (!data) throw new Error(`Unexpected response (HTTP ${res.status})`);
  if (data.error) throw new Error(data.error.message || 'Request failed');
  return data.result;
}

function paint(text) {
  return text
    .split('\n')
    .map((l) => l
      .replace(/: PASS$/, `: ${C.g('PASS')}`)
      .replace(/: WARN$/, `: ${C.y('WARN')}`)
      .replace(/: FAIL$/, `: ${C.r('FAIL')}`)
      .replace(/^(\s+(Guide|Full tool):.*)$/, (m) => C.d(m))
      .replace(/^(Checked by Pipefire.*)$/, (m) => C.d(m)))
    .join('\n')
    .replace(/^([^\n]+)/, (m) => C.b(m))
    .replace(/utm_source=mcp/g, 'utm_source=cli');
}

async function main() {
  const { args, flags } = parse(process.argv.slice(2));
  if (flags.version) return console.log(VERSION);
  const cmd = args.shift();
  if (!cmd || flags.help || cmd === 'help') return help();
  const spec = COMMANDS[cmd];
  if (!spec) {
    console.error(`Unknown command "${cmd}". Run pipefire --help for the list.`);
    process.exit(2);
  }
  const [tool, map, usage] = spec;
  const stdin = ['headers', 'email'].includes(cmd) ? await readStdin() : '';
  const input = map(args, flags, stdin);
  const required = { headers: 'headers', email: 'body', subject: 'subject', blacklist: 'target', domains: 'brand', guess: 'first' }[cmd] || (tool === 'generate_spf_record' ? null : 'domain');
  if (required && !input[required]) {
    console.error(`Usage: pipefire ${cmd} ${usage}`);
    process.exit(2);
  }
  const result = await call(tool, input);
  const out = (result.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n');
  if (flags.json) console.log(JSON.stringify(result, null, 2).replace(/utm_source=mcp/g, 'utm_source=cli'));
  else console.log(paint(out));
  if (result.isError) process.exit(1);
}

main().catch((e) => {
  console.error(C.r(`pipefire: ${e.message}`));
  process.exit(1);
});
