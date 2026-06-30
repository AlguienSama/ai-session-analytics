#!/usr/bin/env node

import { Config } from "./utils/config";
import Deps from "./utils/deps";
import { AISessionAnalytics } from './index';

Deps.set(Config, new Config()).init();
(async () => {
  await Deps.set(AISessionAnalytics, new AISessionAnalytics()).init();
})();
