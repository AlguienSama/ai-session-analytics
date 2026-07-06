import { Config, ConfigParams } from "../utils/config";
import Deps from "../utils/deps";
import fs from "node:fs";
import path from "node:path";

export const REGISTRED_TOOLS = {
  CODEX: 'codex',
} as const;

export type RegisteredTool = (typeof REGISTRED_TOOLS)[keyof typeof REGISTRED_TOOLS] | string;

export abstract class Tool {
  abstract readonly type: RegisteredTool;
  protected config: ConfigParams = Deps.get(Config).getConfig();
  protected abstract toolPath: string;
  static regexFile: RegExp;

  constructor() {
    Tools.set(this.constructor as Constructor<this>, this)
  }

  abstract setSessionFiles(): Promise<void>;
}

type Constructor<T extends Tool = Tool> = new (...args: any[]) => T;
export default class Tools {
  static deps = new Map<Constructor<Tool>, Tool>();

  static get<T extends Tool>(type: Constructor<T>): T {
    return (this.deps.get(type) as T) ?? this.set(type, new type());
  }
  static set<T extends Tool>(type: Constructor<T>, instance: T): T {
    this.deps.set(type, instance);
    return instance;
  }

  static getAll() {
    return this.deps.values();
  }

  static registerAvailableTools() {
    const extension = path.extname(__filename);
    const files = fs.readdirSync(__dirname);

    files.forEach((file) => {
      if (file === `index${extension}` || !file.endsWith(extension)) {
        return;
      }

      const toolModule = require(path.join(__dirname, file)) as Record<string, unknown>;

      Object.values(toolModule).forEach((exportedValue) => {
        if (this.isToolConstructor(exportedValue)) {
          this.get(exportedValue);
        }
      });
    });
  }

  static findByType(type: RegisteredTool): Tool | undefined {
    for (const tool of this.getAll()) {
      if (tool.type === type) {
        return tool;
      }
    }

    return undefined;
  }

  private static isToolConstructor(value: unknown): value is Constructor {
    return typeof value === "function" && value.prototype instanceof Tool;
  }
}
