#!/usr/bin/env bash
set -euo pipefail

npm install --ignore-scripts
npm install --global @github/copilot@1.0.83
dotnet restore solutions/csharp/CopilotAdventures.sln

echo "Copilot Adventures environment is ready."
echo "Run 'npm test' to verify the curriculum and starter labs."
