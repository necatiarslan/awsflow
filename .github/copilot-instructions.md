This is a vscode extension that provides AI-assisted AWS management capabilities. It allows users to interact with AWS services using natural language prompts directly within VS Code.

When you are asked to add a new language tool for an aws service
- use the same architecture like src/s3/S3Tool.ts
- create a new folder under src for the service (e.g., src/ec2)
- create a new tool file (e.g., EC2Tool.ts) following the structure of S3Tool.ts
- update the README.md and README_AWS_SERVICES.md
- update package.json
- update src/common/ServiceAccessView.ts
- update src/extension.ts