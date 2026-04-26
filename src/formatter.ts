import { html as beautify } from 'js-beautify';

export function formatAmpScript(text: string): string {

  const ampBlocks: string[] = [];
  let index = 0;

  // Extract AMPscript and handle v() cursor placement
  let replaced = text.replace(/%%\[.*?\]%%|%%=.*?=%%/gs, (match) => {
    // Check if this is a v() function that needs cursor positioning
    const vMatch = match.match(/%%=v\(\s*\)=%%/);
    if (vMatch) {
      // Replace with cursor placeholder inside parentheses
      const formatted = '%%=v(${1:}) =%%';
      ampBlocks.push(formatted);
      return `__AMP_BLOCK_${index++}__`;
    }
    
    ampBlocks.push(match);
    return `__AMP_BLOCK_${index++}__`;
  });

  // 🔥 Force newline after AMPscript before HTML
  replaced = replaced.replace(/(__AMP_BLOCK_\d+__)(<)/g, '$1\n$2');

  // Format HTML
  let formatted = beautify(replaced, {
    indent_size: 2,
    preserve_newlines: true,
    wrap_line_length: 0
  });

  // Restore AMPscript
  ampBlocks.forEach((block, i) => {
    formatted = formatted.replace(`__AMP_BLOCK_${i}__`, block);
  });

  return formatted;
}