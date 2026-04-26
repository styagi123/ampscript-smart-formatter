import { html as beautify } from 'js-beautify';

// Keywords to convert to lowercase
const lowercaseKeywords = [
  'IF', 'THEN', 'ENDIF', 'ELSE', 'ELSEIF', 'ENDELSEIF',
  'FOR', 'NEXT', 'ENDFOR',
  'SET', 'VAR', 'OUTPUT', 'OUTPUTLINE',
  'RAISE', 'REDIRECTTO', 'TREATAS',
  'CONTENTAREA', 'CONTENTBLOCK', 'DATASOURCE',
  'ROW', 'FIELD', 'ARRAY', 'INDEX',
  'AND', 'OR', 'NOT', 'EMPTY', 'NULL'
];

function lowercaseAmpScript(block: string): string {
  // Lowercase keywords
  lowercaseKeywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'g');
    block = block.replace(regex, kw.toLowerCase());
  });
  
  // Also lowercase function names
  block = block.replace(/\b(Lookup|Concat|Now|v|AttributeValue|RequestParameter|RequestQueryParameter|RequestCookie|Replace|RegexReplace|Format|DateAdd|DateDiff|StringToDate|DateToString|AddToString|Concat|IIF)\b/gi, (match) => match.toLowerCase());
  
  return block;
}

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
    
    // Lowercase the AMPscript content
    const formatted = lowercaseAmpScript(match);
    ampBlocks.push(formatted);
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