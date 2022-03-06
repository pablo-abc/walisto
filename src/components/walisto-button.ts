import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('walisto-button')
export class WalistoButton extends LitElement {
  // Define scoped styles right with your component, in plain CSS
  static styles = css`
    ::slotted(button) {
      background: var(--walisto-button-bg);
      border: none;
      border-radius: 10px;
      padding: 0.6rem 0.5rem 0.4rem 0.7rem;
      color: var(--walisto-button-font-color);
      cursor: pointer;
      transition: background 0.1s, transform 0.1s;
    }

    ::slotted(button:focus-visible) {
      outline: var(--walisto-outline-fv);
      outline-offset: 2px;
    }

    ::slotted(button:hover) {
      background: var(--walisto-button-bg-hover);
    }

    ::slotted(button:active) {
      background: var(--walisto-button-bg-active);
      transform: scale(0.95);
    }
  `;

  @property()
  type?: string = 'button';

  @property()
  label?: string;

  render() {
    return html`<slot></slot>`;
  }
}
