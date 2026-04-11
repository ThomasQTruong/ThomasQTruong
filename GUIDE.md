# Tutorials

- [Build a Responsive Personal Portfolio with HTML & CSS](https://www.youtube.com/watch?v=Slxdo0Dqxlk)
- [Stop using so many Media Queries - Use clamp() instead!](https://www.youtube.com/watch?v=pYW3O0AxpI8)
- [The Easy Way to Build Responsive Websites](https://www.youtube.com/watch?v=l04dDYW-QaI)
- [5 CSS Tips & Tricks for better Responsive Web Design](https://www.youtube.com/watch?v=2IV08sP9m3U)
- [Build Navbar Menus That Actually Work for Everyone](https://www.youtube.com/watch?v=m7YDWNz65iI)
- [New CSS viewport units and minimum heights — Webflow tutorial](https://www.youtube.com/watch?v=7judyqwqmKo)

# Tools

- [Clamp Calculator](https://utopia.fyi/type/calculator/)
- [What Unit To Use](https://whatunit.com/)

# Portfolio Examples

- [Oak Harbor](https://oakharborwebdesigns.com/)
- [Hamad](https://hamad.no/)
- [Radnaabazar](https://www.radnaabazar.com/en)

# Takeaways

### General

- Recommended min size of 44x44px for interactive elements for mobile.
- Site for Free Icons: [FontAwesome](https://fontawesome.com/).
  - Code for referring in HTML: [FontAwesome CDN](https://cdnjs.com/libraries/font-awesome).
- Free fonts to use: [GoogleFonts](https://fonts.google.com/).
  - This site uses: [Poppins](https://fonts.google.com/specimen/Poppins) (Regular 400 and SemiBold 600).
- Avoid using onclick() for buttons use addEventListener() instead.

### Responsive Techniques

- Recommended approach is to do mobile-first design.
  - Building for mobile and media queries set for larger screens.
- Recommended units (or [What Unit To Use](https://whatunit.com/)):
  | Property | Unit |
  | :------: | :--: |
  | Media Queries | `em` |
  | Borders | `px` |
  | Typography | `rem` or `clamp` |
  | Layout Spacing | `rem` |
  | Component Gaps | `em` |
  | Touch Targets | `px` |
  | Border Radius | `px` |
- clamp()
  - For dynamic font sizes and padding.
  - Use the [Utopia Clamp Calculator](https://utopia.fyi/type/calculator/).
- @media screen and (min-width: `...`em)
  - For layout shifts per screen size.
  - Breakpoints:
    - 32em = Mobile
    - 48em = Tablets
    - 64em = Laptops / Small PC

### Accessibility (A11y) Standards

- ARIA (Accessible Rich Internet Applications)
  - Some of the ARIA attributes:
    - `aria-expanded`: i.e. button opens UI, is UI open? \[T/F]
    - `aria-controls`: the id of the other element that this element controls.
    - `aria-label`: what this element is.
    - `aria-hidden`: add to purely decorative elements (i.e. `<i>`).
    - `aria-haspopup`: i.e. button opens a UI.
- inert
  - Basically disables the interactivity of the element.
  - Use for elements that arent supposed to be on the screen yet (i.e. a closed side menu).
  - Use JS to add/remove `inert` attributes accordingly.

### Linters/Tools

- Initial Setup (CSS/JS)
  - Run `npm init -y`.
  - .gitignore
    - ```
      node_modules/
      dist/
      ```
- HTML
  - HTMLHint
    - Install: VS Code Extension.
- CSS
  - Stylelint
    1. Install: VS Code Extension.
    2. Install: Run `npm install --save-dev stylelint stylelint-config-standard`.
    3. Config: Create `.stylelintrc.json`.
       - ```json
         {
           "extends": "stylelint-config-standard"
         }
         ```
- Javascript
  - ESLint (Google)
    1. Install: VS Code Extension.
    2. Install: Run `npm install -D eslint eslint-config-google eslint-config-prettier eslint-plugin-jsdoc`.
    3. Initialize: Run `npx eslint --init`.
    4. Config: Edit `eslint.config.mjs`.
       - ```json
         import js from "@eslint/js";
         import globals from "globals";
         import jsdoc from "eslint-plugin-jsdoc";
         import { createRequire } from "module";

         const require = createRequire(import.meta.url);
         const googleConfig = require("eslint-config-google");
         const prettierConfig = require("eslint-config-prettier");

         const sanitizedGoogleRules = { ...googleConfig.rules };
         delete sanitizedGoogleRules["valid-jsdoc"];
         delete sanitizedGoogleRules["require-jsdoc"];

         export default [
           js.configs.recommended,
           {
             files: ["**/*.{js,mjs,cjs}"],
             plugins: {
               jsdoc: jsdoc,
             },
             languageOptions: {
               ecmaVersion: "latest",
               sourceType: "module",
               globals: {
                 ...globals.browser,
               },
             },
             rules: {
               ...sanitizedGoogleRules,
               "jsdoc/require-jsdoc": "warn",
               "jsdoc/require-description": "warn",
               "no-unused-vars": "warn",
             },
           },
           prettierConfig,
           {
             ignores: ["node_modules/", "dist/"],
           },
         ];
         ```

- Automatic Formatter
  - Prettier - Code Formatter
    - Install: VS Code Extension.
    1. Config: Create `.prettierrc`.
       - ```json
         {
           "tabWidth": 2,
           "semi": true,
           "singleQuote": true,
           "printWidth": 80
         }
         ```
    2. Ignore: Create `.prettierignore`.
       - ```
         node_modules/
         dist/
         ```
    3. Right-click anywhere in .js file.
    4. Select `Format Document with` and select `Prettier` as default.
    5. Press `Ctrl + ,` and enable `Format on Save`.
