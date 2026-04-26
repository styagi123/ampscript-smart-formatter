import * as vscode from 'vscode';
import { formatAmpScript } from './formatter';

/**
 * Check if inside AMPscript
 */
function isInsideAmpScript(document: vscode.TextDocument, position: vscode.Position): boolean {
  const text = document.getText();
  const offset = document.offsetAt(position);

  const before = text.substring(0, offset);

  const lastOpen = before.lastIndexOf('%%[');
  const lastClose = before.lastIndexOf(']%%');
  const lastInline = before.lastIndexOf('%%=');

  return lastOpen > lastClose || lastInline > lastClose;
}

export function activate(context: vscode.ExtensionContext) {

  console.log('AMPscript Smart Formatter activated');

  /**
   * FORMATTER
   */
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider('html', {
      provideDocumentFormattingEdits(document) {

        const text = document.getText();
        if (!text.includes('%%')) return [];

        const formatted = formatAmpScript(text);

        return [
          vscode.TextEdit.replace(
            new vscode.Range(
              document.positionAt(0),
              document.positionAt(text.length)
            ),
            formatted
          )
        ];
      }
    })
  );

  /**
   * COMMAND
   */
  context.subscriptions.push(
    vscode.commands.registerCommand('ampscript.format', () => {
      vscode.commands.executeCommand('editor.action.formatDocument');
    })
  );

  /**
   * 🔥 COMPLETION (FIXED VARIABLE LOGIC ONLY)
   */
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      ['html'],
      {
        provideCompletionItems(document, position) {

          const line = document.lineAt(position).text;
          const textBeforeCursor = line.substring(0, position.character);

          const items: vscode.CompletionItem[] = [];

          // ✅ BLOCK: %%
          const lastChar = textBeforeCursor.slice(-1);
          const lastTwo = textBeforeCursor.slice(-2);
          if (lastChar === '%' && lastTwo !== '%%') {
            const item = new vscode.CompletionItem('AMP Block', vscode.CompletionItemKind.Snippet);
            item.insertText = new vscode.SnippetString('%[\n  $1\n]%%');
            item.range = new vscode.Range(position, position);
            items.push(item);
          }

          // ✅ BLOCK: %%[
          if (textBeforeCursor.endsWith('%%[]')) {
            const item = new vscode.CompletionItem('AMP Block', vscode.CompletionItemKind.Snippet);
            item.insertText = new vscode.SnippetString('\n  $1\n]%%');
            item.range = new vscode.Range(
              new vscode.Position(position.line, position.character - 2),
              position
            );
            items.push(item);
          }

          // ✅ INLINE: %%=
          if (textBeforeCursor.endsWith('%%=')) {
            const item = new vscode.CompletionItem('v() output', vscode.CompletionItemKind.Snippet);
            item.insertText = new vscode.SnippetString('v(${1:varName})=%%');
            item.range = new vscode.Range(position, position);
            items.push(item);
          }

          // ✅ INLINE: %%=v
          if (textBeforeCursor.endsWith('%%=v')) {
            const item = new vscode.CompletionItem('v() output', vscode.CompletionItemKind.Snippet);
            item.insertText = new vscode.SnippetString('v(${1:varName})=%%');
            items.push(item);
          }

          // ✅ Only inside AMPscript → functions + variables
          if (isInsideAmpScript(document, position)) {

            const fullText = document.getText();
            const declaredVars = fullText.match(/(?:SET|VAR)\s+(@\w+)/gi) || [];

            const uniqueVarNames = [...new Set(
              declaredVars.map(v => v.replace(/^(SET|VAR)\s+/i, '').substring(1))
            )];

            /**
             * 🔥 FIXED LOGIC (IMPORTANT)
             * Detect only when cursor is after @ or typing variable
             */
            const atMatch = textBeforeCursor.match(/@(\w*)$/);
            const textAfterAt = atMatch ? atMatch[1] : '';

            if (atMatch) {
              uniqueVarNames.forEach(varName => {
                if (
                  textAfterAt === '' ||
                  varName.toLowerCase().startsWith(textAfterAt.toLowerCase())
                ) {
                  const item = new vscode.CompletionItem('@' + varName, vscode.CompletionItemKind.Variable);
                  item.insertText = varName; // keeps @ already typed
                  items.push(item);
                }
              });

              return items; // stop other suggestions
            }

            // FUNCTIONS (unchanged)
            const functions = [
              { name: 'v', snippet: 'v($1)', desc: 'Output variable value' },
              { name: 'Lookup', snippet: 'Lookup(${1:DataExtension}, ${2:Column}, ${3:SearchColumn}, ${4:SearchValue})', desc: 'Lookup value in Data Extension' },
              { name: 'LookupOrderedRows', snippet: 'LookupOrderedRows(${1:DataExtension}, ${2:RowCount}, ${3:SortColumn}, ${4:Column}, ${5:Value})', desc: 'Lookup ordered rows' },
              { name: 'Concat', snippet: 'Concat(${1:string1}, ${2:string2})', desc: 'Join strings' },
              { name: 'Now', snippet: 'Now()', desc: 'Current date/time' },
              { name: 'FormatDate', snippet: 'FormatDate(${1:date}, ${2:format}, ${3:timezone})', desc: 'Format date' },
              { name: 'AttributeValue', snippet: 'AttributeValue(${1:Name})', desc: 'Get subscriber attribute' },
              { name: 'Empty', snippet: 'Empty(${1:value})', desc: 'Check if value is empty' },
              { name: 'TreatAs', snippet: 'TreatAs(${1:ContentType})', desc: 'Treat content as type' },
              { name: 'Output', snippet: 'Output(${1:value})', desc: 'Output value' },
              { name: 'RedirectTo', snippet: 'RedirectTo(${1:url})', desc: 'Redirect to URL' },
              { name: 'RaiseError', snippet: 'RaiseError(${1:errorMessage}, ${2:addToError})', desc: 'Raise error' },
              { name: 'Set', snippet: 'Set(@${1:varName}, ${2:value})', desc: 'Set variable' },
              { name: 'if', snippet: 'if ${1:condition} then\n  ${2}\nendif', desc: 'IF statement' },
              { name: 'ifelse', snippet: 'if ${1:condition} then\n  ${2:true}\nelse\n  ${3:false}\nendif', desc: 'IF/ELSE statement' },
              { name: 'for', snippet: 'for @${1:i} = ${2:1} to ${3:10} do\n  ${4}\nnext', desc: 'FOR loop' },
            ];

            functions.forEach(fn => {
              const item = new vscode.CompletionItem(fn.name, vscode.CompletionItemKind.Function);
              item.insertText = new vscode.SnippetString(fn.snippet);
              item.detail = fn.desc;
              items.push(item);
            });

            // SYSTEM VARIABLES (unchanged)
            const systemVars = [
              '_SubscriberKey', '_MessageContext', '_JobSubscriberKey',
              '_ListID', '_CampaignID', '_TenantID', '_Language',
              'AttributeGetValue', 'RequestParameter', 'Now', 'Today'
            ];

            systemVars.forEach(v => {
              const item = new vscode.CompletionItem(v, vscode.CompletionItemKind.Variable);
              items.push(item);
            });

            // ALSO SHOW VARIABLES
            uniqueVarNames.forEach(varName => {
              const item = new vscode.CompletionItem('@' + varName, vscode.CompletionItemKind.Variable);
              item.insertText = varName;
              items.push(item);
            });
          }

          return items;
        }
      },
      '%', '=', '@', '['
    )
  );

  /**
   * HOVER (unchanged)
   */
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(['html'], {
      provideHover(document, position) {

        const range = document.getWordRangeAtPosition(position);
        if (!range) return;

        const word = document.getText(range);

        const docs: Record<string, string> = {
          v: 'Outputs variable value',
          Lookup: 'Fetch data from Data Extension',
          Concat: 'Join strings',
          Now: 'Current date/time',
          FormatDate: 'Format date',
          AttributeValue: 'Subscriber attribute',
          Empty: 'Checks if value is empty'
        };

        if (docs[word]) {
          return new vscode.Hover(`**${word}**\n\n${docs[word]}`);
        }
      }
    })
  );
}

export function deactivate() {}