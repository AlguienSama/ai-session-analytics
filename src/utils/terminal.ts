export class Terminal {
  static get width(): number {
    return process.stdout.columns;
  }

  static formatText(text: string) {
    if (text.length > Terminal.width) return text.replaceAll('\n', '').slice(0, Terminal.width - 6) + '...';
    else return text;
  }
}