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
| `--options` | `codex` | Output format. More formats will be available in future releases. |

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
