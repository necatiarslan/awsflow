# Awsflow: AWS AI Assistant 🤖❤️☁️

![screenshoot](docs/readme/movie.gif)

Awsflow is a Visual Studio Code (and forks including Google Antigravity, Windsurf etc.) extension that brings AWS interaction into your chat experience. Use natural language to inspect and operate AWS resources with your existing credentials. The extension exposes AWS-aware tools that execute actions directly on your behalf.

## 💬 Chat Modes

- **Agent Or Plan Mode**: The extension registers AWS service tools that the AI assistant can invoke based on your requests. You can ask questions, and the assistant will call the appropriate tools to fetch data or perform actions. We recommend starting with this mode for most use cases.

- **Ask Or Edit Mode**: You can also ask questions or issue commands directly using the "@aws" prefix in the chat input. The assistant will respond with the requested information or perform the specified actions. We recommend this mode for quick queries or simple tasks or if you dont have access to Agent/Plan mode.

## 🔌 MCP Support
- **Vscode**: No need to setup MCP server. Awsflow is build in Vscode Chat (Copilot) and no extra setup is required. Just start a chat about your AWS resources.
- **Google Antigravity / Windsurf / Others**: You need a local MCP server to connect these editors with Awsflow. See the "MCP Access (Local Only)" section below for setup instructions.

## 🔑 Supported AWS Services
| | | | |
|---|---|---|---|
| S3 | SQS | SNS | EC2 |
| Lambda | Step Functions | EMR | CloudWatch Logs |
| CloudFormation | RDS | DynamoDB | IAM |
| STS | Glue | API Gateway | |

Click [here](README_AWS_SERVICES.md) for the full list of supported AWS services and actions.

## 🤖 Available Tools
- **Session & STS**: manage profile/region/endpoint, refresh credentials, GetCallerIdentity, session tokens.
- **S3**: list buckets/objects, get/put/delete objects.
- **SQS & SNS**: list queues/topics, send/receive/delete messages, get queue URLs.
- **EC2**: describe instances, images, VPCs, security groups, console output.
- **Lambda & Step Functions**: invoke functions, list state machines and executions.
- **EMR**: describe clusters, steps, studios, notebook executions, and scaling policies.
- **CloudWatch Logs**: search and retrieve log events.
- **CloudFormation**: list stacks, describe stack resources and events.
- **RDS & RDS Data**: list DB instances/clusters; run SQL via RDS Data API.
- **DynamoDB**: list tables, describe tables, scan/query items.
- **IAM & STS**: identity and credential utilities.
- **API Gateway, Glue**: service management and S3-compatible endpoint support.
- **File Operations**: work with local workspace context.

## ❓ Q & A

### Authentication
- **Q**: How does Awsflow authenticate to AWS?  
   **A**: It uses your existing AWS credentials configured locally (via AWS CLI config, SSO, environment variables, etc.) and the AWS SDK provider chain.

- **Q**: Are my AWS credentials stored by the extension?  
   **A**: No, credentials are not persisted outside VS Code global state. You can refresh or clear cached credentials from the Command Palette.

### Permissions
- **Q**: What permissions are required?  
   **A**: The extension invokes AWS APIs using your account permissions. Use least-privilege IAM policies and verify the active profile before running mutating actions.

- **Q**: Can I use this extension with multiple AWS accounts?  
   **A**: Yes, you can switch profiles using the status bar AWS selector or commands in the Command Palette.

### Cost
- **Q**: Is there any cost associated with using this extension?  
   **A**: The extension itself is free to use, but AWS API calls may incur costs based on your usage and AWS pricing.

### Security
- **Q**: Are my AWS Credentials exposed to Copilot or other AI services?  
   **A**: No, your AWS Credentials are handled locally by the extension and are not sent to any external AI services.

### Safety
- **Q**: Is it possible the extension could perform unintended actions on my AWS account?  
   **A**: The extension always gets confirmation from you for the actions below before executing them:
    - put, post, upload, download, delete, copy, create, update, insert, commit, rollback, send, publish, invoke, start, execute. 
    - List, get, describe, search, scan, query actions are read-only and safe.

- **Q**: Can I see the AWS API calls being made?  
   **A**: Yes, you can see the AWS API call history in "Command History" panel and in the output channel named "Awsflow-Log". To open the output channel, go to View -> Output, then select "Awsflow-Log" from the dropdown. Top open the "Command History" panel, click on the "Awsflow: Open Command History" command from the Command Palette. You can see the api call responses when you export the history to a file.

## 📺 Screenshots

| | | |
|---|---|---|
| ![Screenshot 1](docs/readme/1.png) | ![Screenshot 2](docs/readme/2.png) | ![Screenshot 3](docs/readme/3.png) |
| ![Screenshot 4](docs/readme/4.png) | ![Screenshot 5](docs/readme/5.png) | ![Screenshot 6](docs/readme/6.png) |
| ![Screenshot 7](docs/readme/7.png) | ![Screenshot 8](docs/readme/8.png) | ![Screenshot 9](docs/readme/9.png) |
| ![Screenshot 10](docs/readme/10.png) | ![Screenshot 11](docs/readme/11.png) | ![Screenshot 12](docs/readme/12.png) |
| ![Screenshot 13](docs/readme/13.png) | ![Screenshot 14](docs/readme/14.png) | ![Screenshot 15](docs/readme/15.png) |


## ⚙️ Prerequisites

- AWS credentials configured locally (via AWS CLI config, SSO, environment variables, or other supported methods).

## 📋 Quick Start

1. **Set profile/region**: Use the status bar AWS selector or run "Awsflow: Set AWS Profile" / "Awsflow: Set Default Region" from the Command Palette.
2. **Test connectivity**: Run "Awsflow: Test AWS Connection" to verify AWS access.
3. **Open Chat**: Open Chat (use @aws in Ask or Edit Mode) and ask a question, for example:
   - List my S3 buckets
   - Tail the latest CloudWatch log events for /aws/lambda/my-fn
   - Describe EC2 instances in us-west-2
   - Publish a message to my SNS topic
4. **Review results**: The assistant will call the appropriate tool, stream results, and suggest follow-up actions.

## 🛰️ MCP Access (Local Only)

- Start a local MCP stdio session with the Command Palette: **Awsflow: Start MCP Server**. Each session opens in a dedicated terminal and speaks newline-delimited JSON (methods: `list_tools`, `call_tool`).
- Up to 3 concurrent MCP sessions run at once by default; additional start requests queue until a slot is free. Configure the cap and per-service disablement via Settings (`awsflow.mcp.*`).
- Stop all active MCP sessions with **Awsflow: Stop MCP Servers**.
- Mutating actions still prompt for confirmation; MCP enablement/disablement is independent from the Service Access UI.

## 👮 Authentication & Security

- **Credentials**: Resolved via the AWS SDK provider chain. The selected profile is stored in VS Code global state and reapplied across sessions.
- **Privacy**: No credentials are persisted outside VS Code global state. You can refresh or clear cached credentials from the Command Palette.
- **Permissions**: The assistant invokes AWS APIs using your account permissions. Use least-privilege IAM policies and verify the active profile before running mutating actions.


## 💖 Links

- **Issues & Feature Requests**: https://github.com/necatiarslan/awsflow/issues
- **Sponsor**: https://github.com/sponsors/necatiarslan
- **License**: MIT
