import fs from "node:fs";
import path from "node:path";
import Deps from "./utils/deps";
import { Config } from "./utils/config";
import { Session } from "./utils/session";
import inquirer from "inquirer";
export class CodexSessionStats {
    sessions = {};
    CONFIG = Deps.get(Config).getConfig();
    async init() {
        await this.setFiles();
        await this.showPrompt(await this.setPromptFiles());
    }
    async setFiles() {
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
                if (this.CONFIG.currentPath) {
                    if (this.isCurrentPathSession(session)) {
                        this.sessions[session.uuid] = session;
                    }
                }
                else {
                    this.sessions[session.uuid] = session;
                }
            }
        });
    }
    async setPromptFiles() {
        const sessionsChoices = [];
        Object.keys(this.sessions).forEach((sessionUuid) => {
            sessionsChoices.push({
                name: `${this.sessions[sessionUuid].day}/${this.sessions[sessionUuid].month}/${this.sessions[sessionUuid].year} ${this.sessions[sessionUuid].time} - ${this.sessions[sessionUuid].summary}`,
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
    async showPrompt(options) {
        const prompt = await inquirer.prompt([
            {
                type: "checkbox",
                message: `Select all the sessions you want to analyze - Total${this.CONFIG.currentPath ? " current session" : ""}: ${options.length - 1}`,
                name: "sessions",
                choices: options,
                pageSize: 15,
                loop: false,
                validate(answer) {
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
        const selectedSessions = prompt.sessions
            .filter((sessionUuid) => sessionUuid !== null)
            .map((sessionUuid) => this.sessions[sessionUuid]);
        console.log("Selected sessions:");
        selectedSessions.forEach((session) => {
            console.log(session.uuid);
        });
    }
    isCurrentPathSession(session) {
        return path.normalize(path.resolve()).toLowerCase() === path.normalize(session.path).toLowerCase();
    }
}
