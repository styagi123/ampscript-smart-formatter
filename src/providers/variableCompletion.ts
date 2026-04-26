import * as vscode from 'vscode';

export function registerVariableCompletion(context: vscode.ExtensionContext) {

  const provider = vscode.languages.registerCompletionItemProvider(
    ['html'],
    {
      provideCompletionItems(document, position) {

        const text = document.getText();
        
        // Extract only declared variables (SET @varName = ... or VAR @varName)
        const declaredVars = text.match(/(?:SET|VAR)\s+(@\w+)/g) || [];
        
        // Extract just the variable names (without @) and remove duplicates
        const uniqueVars = [...new Set(declaredVars.map(v => {
          return v.replace(/^(SET|VAR)\s+/, '').substring(1); // Remove SET/VAR and @ prefix
        }))];

        return uniqueVars.map(varName => {
          const item = new vscode.CompletionItem(varName, vscode.CompletionItemKind.Variable);
          item.filterText = '@' + varName; // Match when user types @
          item.detail = 'Declared variable';
          return item;
        });
      }
    },
    '@'
  );

  context.subscriptions.push(provider);
}