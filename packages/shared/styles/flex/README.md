# Flex Box Literals and Classes for LitElements [![Build Status](https://travis-ci.com/Collaborne/lit-flexbox-literals.svg?branch=master)](https://travis-ci.com/Collaborne/lit-flexbox-literals)

---

**Ported from @polymer/iron-flex-layouts, Configured for LitElement, LitHtml, and Constructable Style Sheets**

_Note that this port is unmaintained and only exists for legacy applications. If you do require the functionality you should fork the repository._

---

## Usage With Classes

```js
import {LitElement, html} from 'lit-element';
import {Layouts} from 'lit-flexbox-literals';

class MyElement extends LitElement {
  static get styles() {
    return [Layouts];
  }

  render() {
    return html`
      <div class="layout horizontal center-center"></div>
    `;
  }
}
```

## Usage With Literals

```js
import {LitElement, html, css} from 'lit-element';
import {
  displayFlex,
  horizontal,
  centerAligned,
  centerJustified,
} from 'lit-flexbox-literals';

class MyElement extends LitElement {
  static get styles() {
    return css`
        :host{
          ${displayFlex}
          ${horizontal}
          ${centerAligned}
          ${centerJustified}

        }

        div{
          ${displayFlex}
          ${horizontal}
          ${centerAligned}
          ${centerJustified}
        }
      `;
  }

  render() {
    return html`
      <div></div>
    `;
  }
}
```
