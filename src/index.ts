import Deps from "./utils/deps";
import { Config } from "./utils/config";
import { Session } from "./utils/session";
import inquirer from "inquirer";
import { Terminal } from "./utils/terminal";
import { CodexOutput } from "./outputs/codex";
import Tools from "./tools";

type PromptOption = { name: string; value: string | null; short: string };

export class AISessionAnalytics {
  private readonly CONFIG = Deps.get(Config).getConfig();

  async init() {
    Tools.registerAvailableTools();
    const tools = this.CONFIG.analyzeTools.length
      ? this.CONFIG.analyzeTools
        .map((requestedTool) => Tools.findByType(requestedTool))
        .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool))
      : [...Tools.getAll()];

    for (const tool of tools) {
      await tool.setSessionFiles();
    }

    await this.showPrompt(await this.setPromptFiles());
  }

  private async setPromptFiles(): Promise<PromptOption[]> {
    const sessionsChoices: PromptOption[] = [];
    Object.keys(Session.list).forEach((sessionUuid) => {
      sessionsChoices.push({
        name: Terminal.formatText(`${Session.list[sessionUuid].day}/${Session.list[sessionUuid].month}/${Session.list[sessionUuid].year} ${Session.list[sessionUuid].time} - ${Session.list[sessionUuid].summary}`),
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
      .map((sessionUuid) => Session.list[sessionUuid]);

    console.log("Selected sessions - " + selectedSessions.length);
    selectedSessions.forEach((session) => {
      console.log(`${session.uuid} - ${session.summary}`);
    });

    // OUTPUT OPTIONS
    if (this.CONFIG.outputOptions === 'codex') {
      await CodexOutput.execPrompt(selectedSessions);
    }
  }
}
