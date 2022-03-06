import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('walisto-container')
export class WalistoContainer extends LitElement {
  // Define scoped styles right with your component, in plain CSS
  static styles = css`
    :host {
      --walisto-font-family: monospace;
      --walisto-width: 40rem;
      --walisto-item-gap: 0.5rem;
      font-family: var(--walisto-font-family);
      display: block;
    }

    .container ::slotted(walisto-item:not(:first-child)) {
      margin-top: var(--walisto-item-gap);
    }

    .container {
      margin: 0;
      max-width: var(--walisto-width);
    }
  `;

  // Render the UI as a function of component state
  render() {
    return html`
      <dl class="container">
        <slot></slot>
      </dl>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'walisto-container': WalistoContainer;
  }
}
