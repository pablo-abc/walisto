import type { WalistoModal } from './walisto-modal';
import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import './walisto-modal';
import './walisto-button';

@customElement('walisto-qr-button')
export class WalistoQrButton extends LitElement {
  static styles = css`
    .success {
      --walisto-button-font-color: #6d3;
    }

    #qr-button svg {
      height: 1.3rem;
    }
  `;

  @property()
  label?: string;

  @property()
  name?: string;

  @property()
  address?: string;

  @property({ attribute: 'close-label' })
  closeLabel?: string;

  private _renderContent() {
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
          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
        ></path>
      </svg>
    `;
  }

  render() {
    const label = this.label || 'Show QR code';
    return html`
      <walisto-button label=${this.label || 'Show QR code'}>
        <button
          part="button"
          id="qr-button"
          @click=${this._openModal}
          type="button"
          aria-label=${label}
          title=${label}
        >
          ${this._renderContent()}
        </button>
      </walisto-button>
    `;
  }

  @query('walisto-button')
  buttonElement?: LitElement;

  modal?: WalistoModal;

  connectedCallback() {
    super.connectedCallback();
    if (!this.address || !this.name) return;
    if (this.modal) return;
    const modalElement = document.createElement('walisto-modal');
    modalElement.setAttribute('address', this.address);
    modalElement.setAttribute('name', this.name);
    if (this.closeLabel) modalElement.closeLabel = this.closeLabel;
    document.body.appendChild(modalElement);
    this.modal = modalElement;
  }

  private _openModal() {
    if (!this.modal) return;
    this.modal.initialFocusRef = this.buttonElement?.querySelector('button');
    this.modal.open();
  }
}
