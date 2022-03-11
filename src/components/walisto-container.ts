import { controller } from '@github/catalyst';
import { html, render } from '@github/jtml';

@controller
export class WalistoContainerElement extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    render(
      html`
        <style>
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
        </style>
        <dl class="container">
          <slot></slot>
        </dl>
      `,
      this.shadowRoot!
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'walisto-container': WalistoContainerElement;
  }
}
