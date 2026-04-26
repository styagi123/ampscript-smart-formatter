import * as vscode from 'vscode';
import { ampFunctions } from '../data/functions';

export function registerCompletion(context: vscode.ExtensionContext) {
  const provider = vscode.languages.registerCompletionItemProvider(
    ['html'],
    {
      provideCompletionItems(document, position) {

        const line = document.lineAt(position).text;
        if (!line.includes('%%')) return [];

        return ampFunctions.map(f => {
          const item = new vscode.CompletionItem(f.name, vscode.CompletionItemKind.Function);
          item.detail = f.signature;
          item.documentation = f.description;
          return item;
        });
      }
    },
    '.', '('
  );

  context.subscriptions.push(provider);
}