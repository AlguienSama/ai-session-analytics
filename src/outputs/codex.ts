import getStats from '../utils/prompts/getStats'
import { spawn } from "node:child_process";
import ora from 'ora';
import Deps from '../utils/deps';
import { Config } from '../utils/config';
import { Session } from '../utils/session';
import path from 'node:path';
import fs from 'fs';

type SpawnConfig = { command: string; args: string[] };

export class CodexOutput {
  static execPrompt(selectedSessions: Session[]): Promise<void> {
    const prompt = JSON.stringify(getStats(selectedSessions.map(s => s.content)), null, 2);
    const codexProcess = this.getCodexProcess(["exec", "-o", Deps.get(Config).getConfig().resultFile + ".md", "-"]);
    const child = spawn(codexProcess.command, codexProcess.args, {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    return new Promise((resolve, reject) => {
      const spinner = ora('Analyzing data, this process may take a few minutes').start();
      let stderr = '';

      child.stdout?.on('data', () => { });

      child.stderr?.on('data', (chunk: Buffer) => {
        stderr += chunk.toString();
      });

      child.stdin?.end(prompt);

      child.on("error", (error) => {
        spinner.fail('Process error');
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
          reject(new Error(`Could not start "${codexProcess.command}". Check that the Codex CLI is installed and available in PATH.`));
          return;
        }

        reject(error);
      });
      child.on("close", code => {
        if (code && code !== 0) {
          spinner.fail('Process failed');
          reject(new Error(`Codex exited with code ${code}.${stderr ? `\n${stderr.trim()}` : ''}`));
          return;
        }

        spinner.succeed('Process completed, ia_session_analytics.md created!');
        resolve();
      });
    });
  }

  static getCodexProcess(args: string[]): SpawnConfig {
    if (process.platform === "win32") {
      const codexScript = path.join(
        path.dirname(process.execPath),
        "node_modules",
        "@openai",
        "codex",
        "bin",
        "codex.js",
      );

      if (fs.existsSync(codexScript)) {
        return {
          command: process.execPath,
          args: [codexScript, ...args],
        };
      }
    }

    return {
      command: "codex",
      args,
    };
  }
}