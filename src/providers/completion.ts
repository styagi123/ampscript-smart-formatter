import * as vscode from 'vscode';
import { ampFunctions } from '../data/functions';

// AMPscript keywords for autocomplete
const ampKeywords = [
  { name: 'if', detail: 'IF condition' },
  { name: 'endif', detail: 'End IF block' },
  { name: 'else', detail: 'ELSE block' },
  { name: 'elseif', detail: 'ELSEIF condition' },
  { name: 'for', detail: 'FOR loop' },
  { name: 'next', detail: 'End FOR loop' },
  { name: 'set', detail: 'SET @variable = value' },
  { name: 'var', detail: 'VAR @variable' },
  { name: 'output', detail: 'Output variable value' },
  { name: 'outputline', detail: 'Output with newline' },
  { name: 'raise', detail: 'Raise error' },
  { name: 'redirectto', detail: 'Redirect to URL' },
  { name: 'treatas', detail: 'Treat as content type' },
  { name: 'contentarea', detail: 'Content area' },
  { name: 'contentblock', detail: 'Content block' },
  { name: 'datasource', detail: 'Data extension' },
  { name: 'row', detail: 'Row from data extension' },
  { name: 'field', detail: 'Field from row' },
  { name: 'array', detail: 'Array' },
  { name: 'index', detail: 'Index' }
];

export function registerCompletion(context: vscode.ExtensionContext) {
  const provider = vscode.languages.registerCompletionItemProvider(
    ['html'],
    {
      provideCompletionItems(document, position) {

        const line = document.lineAt(position).text;
        if (!line.includes('%%')) return [];

        const items: vscode.CompletionItem[] = [];

        // Add AMPscript keywords (lowercase)
        ampKeywords.forEach(kw => {
          const item = new vscode.CompletionItem(kw.name, vscode.CompletionItemKind.Keyword);
          item.detail = kw.detail;
          items.push(item);
        });

        // Add AMPscript functions
        ampFunctions.forEach(f => {
          const item = new vscode.CompletionItem(f.name, vscode.CompletionItemKind.Function);
          item.detail = f.signature;
          item.documentation = f.description;
          items.push(item);
        });

        return items;
      }
    },
    '.', '('
  );

  context.subscriptions.push(provider);
}