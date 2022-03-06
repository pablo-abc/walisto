import { LitElement, css, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import './walisto-button';

@customElement('walisto-copy-button')
export class WalistoCopyButton extends LitElement {
  static styles = css`
    .success {
      --walisto-button-font-color: #6d3;
    }

    #copy-button svg {
      height: 1.3rem;
    }
  `;

  @property()
  label?: string;

  @property()
  address?: string;

  @state()
  copied?: boolean = false;

  private _renderContent() {
    if (this.copied) {
      return html`
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          ></path>
        </svg>
      `;
    }
    return html`
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
        ></path>
      </svg>
    `;
  }

  // Render the UI as a function of component state
  render() {
    const label = this.label || 'Copy to clipboard';
    return html`
      <walisto-button>
        <button
          type="button"
          @click=${this._copyAddress}
          aria-label=${label}
          title=${label}
          id="copy-button"
          part="button"
        >
          ${this._renderContent()}
        </button>
      </walisto-button>
    `;
  }

  @query('walisto-button')
  buttonElement?: HTMLElement;

  private _copyAddress() {
    if (!this.address) return;
    navigator.clipboard.writeText(this.address);
    this.copied = true;
    this.buttonElement?.classList.add('success');
    setTimeout(() => {
      this.buttonElement?.classList.remove('success');
      this.copied = false;
    }, 500);
  }
}
