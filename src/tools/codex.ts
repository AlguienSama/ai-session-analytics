import { REGISTRED_TOOLS, Tool } from ".";
import fs from "node:fs";
import { Session } from "../utils/session";
import path from "node:path";
import { isCurrentPathSession } from "../utils/utils";

export class CodexTool extends Tool {
  type = REGISTRED_TOOLS.CODEX;
  toolPath = this.config.codexPath;
  static regexFile = /^(?<year>\d{4})[\\/](?<month>\d{2})[\\/](?<day>\d{2})[\\/]rollout-(?<fileDate>\d{4}-\d{2}-\d{2})T(?<time>\d{2}-\d{2}-\d{2})-(?<uuid>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.jsonl$/i;

  private getFileContent(filePath: string): Pick<Session, 'content' | 'jsonContent' | 'summary' | 'path'> {
    const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const jsonContent: Session['jsonContent'] = JSON.parse(`[${content.split('\n').filter(c => c).join(',')}]`);

    const messageTypes = ['user_message', 'turn_context', 'task_started', 'task_complete'];
    const summaryContent = jsonContent.filter((c) => messageTypes.some(t => t === c.type));

    const userMessage = jsonContent.find(c => c['payload']['type'] === 'user_message')
    const summary = userMessage?.payload.message ?? '';

    const sessionMeta = jsonContent.find(c => c['type'] === 'session_meta');
    const path = sessionMeta?.payload.cwd ?? '';

    console.log(JSON.stringify(summaryContent).length, content.length)

    return { content: JSON.stringify(summaryContent), jsonContent, summary, path };
  }

  setSessionFiles() {
    return (async () => {
      const folderAndFiles = await fs.promises.readdir(this.toolPath, {
        recursive: true,
      });

      folderAndFiles.forEach((faf) => {
        const file = new RegExp(CodexTool.regexFile).exec(faf);
        if (file) {
          const filePath = path.join(this.toolPath, file.input);
          const fileContent = this.getFileContent(path.join(this.toolPath, file.input));
          const session = new Session({
            day: file.groups?.["day"] ?? "",
            month: file.groups?.["month"] ?? "",
            year: file.groups?.["year"] ?? "",
            time: file.groups?.["time"] ?? "",
            uuid: file.groups?.["uuid"] ?? "",
            filePath,
            ...fileContent,
          });

          if (Boolean(this.config.currentPath)) {
            if (isCurrentPathSession(session)) {
              Session.list[session.uuid] = session;
            }
          } else {
            Session.list[session.uuid] = session;
          }
        }
      });
    })();

  }
}