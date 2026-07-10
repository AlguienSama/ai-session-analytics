import { homedir } from "node:os";
import rc from 'rc';
import { getFormattedDate } from "./utils";
import { RegisteredTool } from "../tools";

export type ConfigParams = {
  codexPath: string;
  axetPluginPath: string;
  currentPath: boolean | string;
  resultFile: string;
  analyzeTools: RegisteredTool[];
  outputOptions: 'codex';
  codexModel: 'gpt-5.4-mini';
  codexReasoning: 'minimal' | 'low' | 'medium' | 'high';
}

export class Config {
  static readonly regexFile = /^(?<year>\d{4})[\\/](?<month>\d{2})[\\/](?<day>\d{2})[\\/]rollout-(?<fileDate>\d{4}-\d{2}-\d{2})T(?<time>\d{2}-\d{2}-\d{2})-(?<uuid>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.jsonl$/i;
  static readonly codexPath: ConfigParams['codexPath'] = homedir() + '/.codex/sessions/';
  static readonly axetPluginPath: ConfigParams['axetPluginPath'] = homedir() + '/AppData/Roaming/Code/User/globalStorage/ntt-data.axet-plugin/tasks'
  static readonly currentPath: ConfigParams['currentPath'] = true;
  static readonly resultFile: ConfigParams['resultFile'] = 'ia_session_analytics_' + getFormattedDate();
  static readonly analyzeTools: ConfigParams['analyzeTools'] = [];
  static readonly outputOptions: ConfigParams['outputOptions'] = 'codex';
  static readonly codexModel: ConfigParams['codexModel'] = 'gpt-5.4-mini';
  static readonly codexReasoning: ConfigParams['codexReasoning'] = 'low';

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
      axetPluginPath: Config.axetPluginPath,
      currentPath: Config.currentPath,
      resultFile: Config.resultFile,
      analyzeTools: Config.analyzeTools,
      outputOptions: Config.outputOptions,
      codexModel: Config.codexModel,
      codexReasoning: Config.codexReasoning,
    });
  }
}
