#!/usr/bin/env node

import { Config } from "./utils/config";
import Deps from "./utils/deps";
import { AISessionAnalytics } from './index';
import { CodexTool } from "./tools/codex";

Deps.set(Config, new Config()).init();
try {
  (async () => {
    await Deps.set(AISessionAnalytics, new AISessionAnalytics()).init();
  })();
} catch (e) {
  console.error('ERROR - ', e);
}