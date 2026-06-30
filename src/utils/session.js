import fs from "node:fs";
export class Session {
    day;
    month;
    year;
    time;
    uuid;
    path;
    filePath;
    summary;
    jsonContent;
    content;
    constructor(sessionData) {
        this.day = sessionData.day;
        this.month = sessionData.month;
        this.year = sessionData.year;
        this.time = sessionData.time;
        this.uuid = sessionData.uuid;
        this.filePath = sessionData.filePath;
        this.content = fs.readFileSync(this.filePath, { encoding: 'utf-8' });
        this.jsonContent = JSON.parse(`[${this.content.split('\n').filter(c => c).join(',')}]`);
        const userMessage = this.jsonContent.find(c => c['payload']['type'] === 'user_message');
        this.summary = userMessage?.payload.message.slice(0, 15) + '...';
        const sessionMeta = this.jsonContent.find(c => c['type'] === 'session_meta');
        this.path = sessionMeta?.payload.cwd ?? '';
    }
}
