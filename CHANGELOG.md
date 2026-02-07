# Changelog

All notable changes to tree-sitter-better-vento will be documented in this file.

Version 1.0.0 changes are relative to the original.

## 1.0.0

### Added

- `locals.scm` query file for local scope and variable reference tracking
- Support for single-character variable names (e.g., `{{ i }}`, `{{ x }}`)
- Example file `examples/for-loop-scoping.vto` demonstrating variable scoping in loops

### Changed

- Modified `code_snippet` rule in `grammar.js` to make external code scanner optional
- This allows single-character variables to be parsed correctly
- Updated precedence levels for expression parsing to ensure correct keyword vs. variable resolution

### Fixed

- **Critical**: Single-character loop variables (like `i` in `for i of items`) are now properly recognized as code blocks instead of parse errors
- Variable scoping now works correctly in for loops - variables like `i` in `aria-label="Page {{ i }}"` are properly scoped within their containing for loop
- Editors using Tree-sitter (like Zed) can now provide accurate code intelligence for loop variables

## Technical Details

The main issue was that the `code_snippet` grammar rule required:

1. A character matching `/[a-zA-Z>\.\(\)\!_\?]/`
2. Followed by the external `$._code` scanner

For single-character variables like `{{ i }}`, the external scanner would see the closing `}` and return false, causing parse errors.

**Solution**: Made the external `$._code` scanner optional in the `code_snippet` rule:

```javascript
// Before
code_snippet: ($) => seq(/[a-zA-Z>\.\(\)\!_\?]/, $._code),

// After
code_snippet: ($) => seq(/[a-zA-Z>\.\(\)\!_\?]/, optional($._code)),
```

This allows single characters to be valid code snippets while maintaining backward compatibility with multi-character variables and complex expressions.
