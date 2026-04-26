export function containsAmpScript(text: string): boolean {
  return /%%\[.*?\]%%|%%=.*?=%%/s.test(text);
}