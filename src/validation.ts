import * as vscode from 'vscode';

export function validate(doc: vscode.TextDocument, collection: vscode.DiagnosticCollection) {

  const text = doc.getText();
  const diagnostics: vscode.Diagnostic[] = [];

  const ifCount = (text.match(/\bIF\b/g) || []).length;
  const endifCount = (text.match(/\bENDIF\b/g) || []).length;

  if (ifCount !== endifCount) {
    diagnostics.push(new vscode.Diagnostic(
      new vscode.Range(0,0,0,1),
      "IF / ENDIF mismatch",
      vscode.DiagnosticSeverity.Warning
    ));
  }

  collection.set(doc.uri, diagnostics);
}