import * as vscode from 'vscode';

export function registerVariableCompletion(context: vscode.ExtensionContext) {

  const provider = vscode.languages.registerCompletionItemProvider(
    ['html'],
    {
      provideCompletionItems(document, position) {

        const text = document.getText();
        const line = document.lineAt(position).text;
        const textBeforeCursor = line.substring(0, position.character);
        
        // Get what user typed after @
        const textAfterAt = textBeforeCursor.split('@').pop() || '';
        
        // Extract declared variables (SET @varName = ... or VAR @varName) - case insensitive
        const declaredVars = text.match(/(?:SET|VAR)\s+(@\w+)/gi) || [];
        
        // Extract just the variable names (without @) and remove duplicates
        const uniqueVars = [...new Set(declaredVars.map(v => {
          return v.replace(/^(SET|VAR)\s+/i, '').substring(1); // Remove SET/VAR and @ prefix
        }))];

        return uniqueVars
          .filter(varName => textAfterAt === '' || varName.toLowerCase().startsWith(textAfterAt.toLowerCase()))
          .map(varName => {
            const item = new vscode.CompletionItem('@' + varName, vscode.CompletionItemKind.Variable);
            item.detail = 'Declared variable';
            item.insertText = varName; // Insert without @ prefix
            return item;
          });
      }
    },
    '@'
  );

  context.subscriptions.push(provider);
}