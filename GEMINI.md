# Portfolio Rules

## 1. Style Preservation (Strict)

- **DO NOT** modify layout properties (`gap`, `margin`, `padding`, `width`, `height`) unless explicitly requested.
- **DO NOT** "beautify" or "improve" spacings based on personal preference.
- **ONLY** modify the specific properties mentioned in the prompt (e.g., if I ask for typography, only touch `font-family`, `font-size`, etc.).

## 2. CSS Architecture

- **BEM Pattern:** Always follow the `block__element--modifier` pattern.
- **Hierarchy:** State modifiers (like `:hover`, `:active`) and media queries MUST be placed at the bottom of the respective component file.
- **Specificity:** Avoid nesting selectors more than 2 levels deep. Prefer flat BEM classes.

## 3. Workflow

- Always provide a **Plan** before applying changes.
- If a requested change conflicts with existing Stylelint rules, point it out before editing.
