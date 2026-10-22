# Installing the Pipefire MCP server

Pipefire is a remote MCP server. There is nothing to clone, build or install, and it needs no API key or account.

Add this to the MCP settings file (for Cline: `cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "pipefire": {
      "type": "streamableHttp",
      "url": "https://pipefire.ai/mcp",
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

To confirm it works, call the `check_dmarc` tool with `{"domain": "pipefire.ai"}`. It returns the DMARC record and a PASS, WARN or FAIL verdict.

All sixteen tools are read-only: check_domain_email_setup, check_dmarc, check_spf, check_dkim, check_mx, check_bimi, check_mta_sts, check_blacklists, analyze_email_headers, check_cold_email, test_subject_line, suggest_sending_domains, guess_email_addresses, generate_spf_record, generate_dmarc_record, generate_dkim_record.

Optional: the same checks also run in a terminal with `npx pipefire <command>` (Node 18+). See README.md.
