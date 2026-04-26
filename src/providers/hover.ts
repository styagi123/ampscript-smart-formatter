import * as vscode from 'vscode';
import { ampFunctions } from '../data/functions';

export function registerHover(context: vscode.ExtensionContext) {

  const provider = vscode.languages.registerHoverProvider(['html'], {
    provideHover(document, position) {

      const range = document.getWordRangeAtPosition(position);
      const word = document.getText(range);

      const func = ampFunctions.find(f => f.name === word);
      if (!func) return;

      return new vscode.Hover(`**${func.name}**\n\n${func.signature}\n\n${func.description}`);
    }
  });

  context.subscriptions.push(provider);
}