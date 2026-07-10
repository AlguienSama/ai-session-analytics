# AI Session Analytics

> Analyze your Codex sessions and discover where your time and tokens are really spent.

`ai-session-analytics` is a CLI tool that reads one or more Codex session logs and generates a detailed Markdown report with usage statistics, workflow insights, model breakdowns, and token analytics.

No setup required—just run it with `npx`.

## Usage

```bash
npx ai-session-analytics
```

## Options

| Option | Default | Description |
| -------- | --------- | ------------- |
| `--codexPath` | `~/.codex/sessions/` | Path to the Codex sessions directory. |
| `--currentPath` | `true` | Analyze only sessions belonging to the current working directory. |
| `--resultFile` | `ia_session_analytics_<date>` | Name of the generated report. |
| `--analyzeTools` | `[]` | Tool names to analyze. Empty means all registered tools found in `src/tools`. |
| `--outputOptions` | `codex` | Output format. More formats will be available in future releases. |
| `--codexModel` | `gpt-5.4-mini` | Codex model used to generate the report when `outputOptions` is `codex`. |
| `--codexReasoning` | `low` | Codex reasoning effort when `outputOptions` is `codex`. Allowed values: `minimal`, `low`, `medium`, `high`. |

Configuration is loaded with `rc`, so the same values can be passed as CLI flags or saved in a `.codex_session_statsrc` file:

```json
{
  "codexPath": "C:/Users/you/.codex/sessions",
  "currentPath": true,
  "resultFile": "ia_session_analytics_custom",
  "analyzeTools": ["codex"],
  "outputOptions": "codex",
  "codexModel": "gpt-5.4-mini",
  "codexReasoning": "low"
}
```

When `analyzeTools` is empty, every registered tool is executed. To limit the run, set it to the tool `type` values you want, for example `["codex"]`.

## Output

The generated report includes:

- Session summary
- Token consumption
- Model usage
- Workflow phases
- Skill usage
- Top token consumers
- Top duration consumers
- Executive summary

Perfect for understanding how your Codex sessions evolve, where resources are spent, and how to optimize future AI-assisted development sessions.

## Roadmap

Future versions will include:

- Additional output formats
- Charts and visualizations
- Multi-session comparisons
- Cost estimation
- Team analytics

## License

MIT
