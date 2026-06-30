import { homedir } from "node:os";
import rc from 'rc';
export class Config {
    static regexFile = /^(?<year>\d{4})\\(?<month>\d{2})\\(?<day>\d{2})\\rollout-(?<fileDate>\d{4}-\d{2}-\d{2})T(?<time>\d{2}-\d{2}-\d{2})-(?<uuid>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.jsonl$/;
    static codexPath = homedir() + '/.codex/sessions/';
    static currentPath = true;
    config;
    init() {
        this.config = this.loadConfig();
        return this;
    }
    getConfig() {
        if (!this.config) {
            this.config = this.loadConfig();
            if (!this.config) {
                throw new Error('Failed to load configuration');
            }
        }
        return this.config;
    }
    loadConfig() {
        return rc('codex_session_stats', {
            codexPath: Config.codexPath,
            currentPath: Config.currentPath,
        });
    }
}
