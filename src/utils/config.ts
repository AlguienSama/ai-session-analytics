import { homedir } from "node:os";
import rc from 'rc';
import { getFormattedDate } from "./utils";

export type ConfigParams = {
  codexPath: string;
  currentPath: boolean | string;
  resultFile: string;
  options: 'codex';
}

export class Config {
  static readonly regexFile = /^(?<year>\d{4})\\(?<month>\d{2})\\(?<day>\d{2})\\rollout-(?<fileDate>\d{4}-\d{2}-\d{2})T(?<time>\d{2}-\d{2}-\d{2})-(?<uuid>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.jsonl$/;
  static readonly codexPath: ConfigParams['codexPath'] = homedir() + '/.codex/sessions/';
  static readonly currentPath: ConfigParams['currentPath'] = true;
  static readonly resultFile: ConfigParams['resultFile'] = 'ia_session_analytics_' + getFormattedDate();
  static readonly options: ConfigParams['options'] = 'codex';

  private config?: ConfigParams;

  init() {
    this.config = this.loadConfig();
    return this;
  }

  getConfig(): ConfigParams {
    if (!this.config) {
      this.config = this.loadConfig();
      if (!this.config) {
        throw new Error('Failed to load configuration');
      }
    }
    return this.config;
  }

  private loadConfig(): ConfigParams {
    return rc('codex_session_stats', {
      codexPath: Config.codexPath,
      currentPath: Config.currentPath,
      resultFile: Config.resultFile,
      options: Config.options,
    });
  }
}
