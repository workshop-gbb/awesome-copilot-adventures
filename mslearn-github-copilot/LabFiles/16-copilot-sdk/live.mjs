import fs from 'node:fs';
import path from 'node:path';
import { answer } from './app.mjs';

const prompt = process.argv.slice(2).join(' ');
if (!prompt.trim()) throw new Error('Usage: node live.mjs "question about ORD-1"');
const { CopilotClient } = await import('@github/copilot-sdk');
const baseDirectory = path.resolve('.copilot-runtime');
fs.mkdirSync(baseDirectory, { recursive: true });
const client = new CopilotClient({ mode: 'empty', baseDirectory, workingDirectory: process.cwd() });
console.log(await answer(client, prompt, 'fixture-alice'));
