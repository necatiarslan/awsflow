# Model Context Protocol (MCP) Server Guide

The MCP server in this repository allows external tools, AI agents (like Antigravity, Windsurf), or other VS Code instances to leverage the AWS AI capabilities built into the **Awsflow: AWS AI Assistant** extension.

## 1. Prerequisites

*   **Extensions**: [Awsflow: AWS AI Assistant](https://marketplace.visualstudio.com/items?itemName=NecatiARSLAN.awsflow) installed and active.
*   **AWS Setup**: Credentials configured locally (via `~/.aws/credentials` or environment variables) with permissions to perform desired AWS operations.
*   **Runtime**: [Node.js](https://nodejs.org/) installed on your machine.

## 2. Starting the Server

1.  Open the Command Palette (`Cmd+Shift+P`).
2.  Run the command: `Awsflow: Start MCP Server`.
3.  A new terminal labeled `Awsflow MCP 1` will appear.
4.  The extension will start a TCP bridge listening on `127.0.0.1:37114`.

## 3. MCP Server Manager (GUI)

Prefer a UI? Open the Command Palette and run `Awsflow: MCP Management` to launch the MCP Server Manager view. From there you can:

* Start, stop, or check the MCP bridge status.
* Set the bridge host and port without touching environment variables.
* Copy a ready-made `mcp_config.json` snippet that includes your configured endpoint.

## 4. MCP Configuration (Example: Antigravity)

To use this server with an MCP-compatible client like Antigravity, Windsurf, etc. add this to your `mcp_config.json`:
You can get your customized snippet from the MCP Server Manager UI as well.

```json
{
  "mcpServers": {
    "awsflow": {
      "command": "node",
      "args": [
        "/Users/necatiarslan/github/awsflow/out/mcp/cli.js"
      ],
      "env": {
        "AWSFLOW_MCP_PORT": "37114",
        "AWSFLOW_MCP_HOST": "127.0.0.1"
      }
    }
  }
}
```

> **Note**: Ensure the absolute path to `cli.js` is correct for your local machine. The extension must be running for the bridge to accept connections.

## 5. Configuration (Environment Variables)

Override the bridge settings by defining these variables before starting the MCP server:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `AWSFLOW_MCP_PORT` | `37114` | TCP port for the bridge server |
| `AWSFLOW_MCP_HOST` | `127.0.0.1` | Network host for the bridge server |

## 6. Security and Manual Confirmations

To prevent accidental destructive actions, certain AWS commands (e.g., `DeleteBucket`, `TerminateInstances`) require **manual confirmation** within the UI.

If a client sends a destructive command:
1.  The MCP request will hang temporarily.
2.  A notification will appear in the UI asking you to **Proceed** or **Cancel**.
3.  The MCP response will be returned only after you interact with the UI.

