#!/usr/bin/env node

import { Config } from "./utils/config";
import Deps from "./utils/deps";
import { CodexSessionStats } from './index';

Deps.set(Config, new Config()).init();
(async () => {
  await Deps.set(CodexSessionStats, new CodexSessionStats()).init();
})();
