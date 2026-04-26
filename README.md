# AMPscript Smart Formatter

A VS Code extension for intelligent AMPscript formatting, autocomplete, and syntax support in HTML files.

## Features

### 1. Smart Formatting
Automatically formats AMPscript blocks within HTML files while preserving the AMPscript code structure.

- **Block Syntax**: `%%[ ... ]%%`
- **Inline Syntax**: `%%= ... =%%`
- Adds proper newlines between AMPscript and HTML
- Uses js-beautify for HTML formatting

### 2. Intelligent Autocomplete

#### Trigger Characters
The extension provides context-aware completions triggered by:
- `%` - For AMPscript blocks
- `=` - For inline AMPscript
- `@` - For variable suggestions
- `[` - For block syntax completion

#### AMPscript Functions
When typing inside AMPscript blocks (triggered by `=` or other characters), you'll get suggestions for:

| Function | Description |
|----------|-------------|
| `v()` | Output variable value |
| `Lookup()` | Lookup value in Data Extension |
| `LookupOrderedRows()` | Lookup ordered rows from DE |
| `Concat()` | Join multiple strings |
| `Now()` | Current date/time |
| `FormatDate()` | Format date with timezone |
| `AttributeValue()` | Get subscriber attribute |
| `Empty()` | Check if value is empty |
| `TreatAs()` | Treat content as type |
| `Output()` | Output value |
| `RedirectTo()` | Redirect to URL |
| `RaiseError()` | Raise custom error |
| `Set()` | Set variable value |

#### Control Structures
- `IF` - IF statement with THEN/ENDIF
- `IFELSE` - IF/THEN/ELSE/ENDIF statement
- `FOR` - FOR loop with DO/NEXT

#### System Variables
- `_SubscriberKey`
- `_MessageContext`
- `_JobSubscriberKey`
- `_ListID`
- `_CampaignID`
- `_TenantID`
- `_Language`
- `AttributeGetValue`
- `RequestParameter`
- `Now`
- `Today`

### 3. Variable Autocomplete

#### Smart Variable Detection
- Only shows **declared variables** (from `SET @varName` or `VAR @varName`)
- Filters out functions and statements when typing `@`
- No duplicate suggestions
- Automatically removes the `@` prefix from display names for clean insertion

**Example:**
```ampscript
%%[
  SET @firstName = 'Sagar'
  SET @lastName = 'Tyagi'
  SET @country = 'India'
]%%
```

When you type `%%=v(@`, you'll see: `firstName`, `lastName`, `country`

### 4. Cursor Positioning
- When typing `%%=v()=%%`, the cursor automatically lands inside the parentheses
- Use Tab to move to the next placeholder in snippets

### 5. Hover Documentation
Hover over AMPscript functions to see brief descriptions:
- `v` - Outputs variable value
- `Lookup` - Fetch data from Data Extension
- `Concat` - Join strings
- `Now` - Current date/time
- `FormatDate` - Format date
- `AttributeValue` - Subscriber attribute
- `Empty` - Checks if value is empty

### 6. Syntax Highlighting
Includes custom syntax highlighting for AMPscript in HTML files via `ampscript-html.tmLanguage.json`.

### 7. Code Snippets

#### Block Snippet
Type `%` (not `%%`) to get:
```
%[
  $1
]%%
```

#### Inline Snippet
Type `%%=` to get:
```
%%=v(${1:varName})=%%
```

## Usage

### Formatting
1. Open an HTML file containing AMPscript
2. Press `Shift+Alt+F` (or your configured format shortcut)
3. The extension will format both HTML and preserve AMPscript blocks

### Autocomplete
1. Type inside an AMPscript block (`%%[...]%%` or `%%=...=%%`)
2. Trigger autocomplete with `Ctrl+Space`
3. Or wait for suggestions to appear automatically after typing trigger characters

### Variable Suggestions
1. Type `@` inside an AMPscript block
2. You'll see only declared variables from your code
3. Select a variable to insert it (without the `@` prefix)


## Requirements

- VS Code 1.70.0 or higher
- No additional dependencies required

## Extension Settings

This extension contributes the following settings:

- `ampscript.format`: Enable/disable formatting (default: enabled)
- Currently uses VS Code's built-in HTML formatting configuration

## Supported File Types

- `.html` files
- `.htm` files

