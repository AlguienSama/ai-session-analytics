import fs from "node:fs";
import path from "node:path";
import Deps from "./utils/deps";
import { Config } from "./utils/config";
import { Session } from "./utils/session";
import inquirer from "inquirer";
import { Terminal } from "./utils/terminal";
import { Codex } from "./methods/codex";

type PromptOption = { name: string; value: string | null; short: string };

export class AISessionAnalytics {
  private sessions: { [key: string]: Session } = {};
  private readonly CONFIG = Deps.get(Config).getConfig();

  async init() {
    await this.setFiles();
    await this.showPrompt(await this.setPromptFiles());
  }

  private async setFiles() {
    const folderAndFiles = await fs.promises.readdir(this.CONFIG.codexPath, {
      recursive: true,
    });

    folderAndFiles.forEach((faf) => {
      const file = new RegExp(Config.regexFile).exec(faf);
      if (file) {
        const session = new Session({
          day: file.groups?.["day"] ?? "",
          month: file.groups?.["month"] ?? "",
          year: file.groups?.["year"] ?? "",
          time: file.groups?.["time"] ?? "",
          uuid: file.groups?.["uuid"] ?? "",
          filePath: path.join(this.CONFIG.codexPath, file.input),
        });

        if (Boolean(this.CONFIG.currentPath)) {
          if (this.isCurrentPathSession(session)) {
            this.sessions[session.uuid] = session;
          }
        } else {
          this.sessions[session.uuid] = session;
        }
      }
    });
  }

  private async setPromptFiles(): Promise<PromptOption[]> {
    const sessionsChoices: PromptOption[] = [];
    Object.keys(this.sessions).forEach((sessionUuid) => {
      sessionsChoices.push({
        name: Terminal.formatText(`${this.sessions[sessionUuid].day}/${this.sessions[sessionUuid].month}/${this.sessions[sessionUuid].year} ${this.sessions[sessionUuid].time} - ${this.sessions[sessionUuid].summary}`),
        value: sessionUuid,
        short: sessionUuid,
      });
    });

    if (sessionsChoices.length < 1) {
      throw new Error('No files found');
    }

    sessionsChoices.push({ name: "None", value: null, short: "Exit" });
    return sessionsChoices;
  }

  private async showPrompt(options: PromptOption[]) {
    const prompt = await inquirer.prompt<{ sessions: (string | null)[] }>([
      {
        type: "checkbox",
        message: `Select all the sessions you want to analyze - Total${Boolean(this.CONFIG.currentPath) ? " current session" : ""}: ${options.length - 1}`,
        name: "sessions",
        choices: options,
        pageSize: 15,
        loop: false,
        validate(answer: (string | null)[]) {
          if (answer.length === 0) {
            return "You must choose at least one session.";
          }

          if (answer.includes(null) && answer.length > 1) {
            return "Choose sessions or None, not both.";
          }

          return true;
        },
      },
    ]);

    if (prompt.sessions.includes(null)) {
      console.log("No session selected.");
      return;
    }

    const selectedSessions: Session[] = prompt.sessions
      .filter((sessionUuid): sessionUuid is string => sessionUuid !== null)
      .map((sessionUuid) => this.sessions[sessionUuid]);

    console.log("Selected sessions - " + selectedSessions.length);
    selectedSessions.forEach((session) => {
      console.log(`${session.uuid} - ${session.summary}`);
    });

    // OUTPUT OPTIONS
    if (this.CONFIG.options === 'codex') {
      await Codex.execPrompt(selectedSessions);
    }
  }

  private isCurrentPathSession(session: Session): boolean {
    return path.normalize(path.resolve()).toLowerCase() === path.normalize(session.path).toLowerCase();
  }
}
