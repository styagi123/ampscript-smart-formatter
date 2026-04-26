import * as vscode from 'vscode';
import { ampFunctions } from '../data/functions';

export function registerSignature(context: vscode.ExtensionContext) {

  const provider = vscode.languages.registerSignatureHelpProvider(['html'], {
    provideSignatureHelp(document, position) {

      const line = document.lineAt(position).text;
      const match = line.match(/(\w+)\(/);

      if (!match) return;

      const func = ampFunctions.find(f => f.name === match[1]);
      if (!func) return;

      const sig = new vscode.SignatureInformation(func.signature);
      sig.documentation = func.description;

      const help = new vscode.SignatureHelp();
      help.signatures = [sig];

      return help;
    }
  }, '(');

  context.subscriptions.push(provider);
}