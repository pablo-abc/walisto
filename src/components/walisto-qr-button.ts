import type { WalistoModalElement } from './walisto-modal';
import { controller, attr, target } from '@github/catalyst';
import { html, render } from '@github/jtml';

import './walisto-modal';
import './walisto-button';

@controller
export class WalistoQrButtonElement extends HTMLElement {
  @attr label = '';

  @attr name = '';

  @attr address = '';

  @attr closeLabel = '';

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

  update() {
    const label = this.label || 'Show QR code';
    render(
      html`
        <style>
          .success {
            --walisto-button-font-color: #6d3;
          }

          #qr-button svg {
            height: 1.3rem;
          }
        </style>
        <walisto-button data-target="walisto-qr-button.button">
          <button
            part="button"
            id="qr-button"
            type="button"
            aria-label="${label}"
            title="${label}"
            data-action="click:walisto-qr-button#openModal"
          >
            ${this._renderContent()}
          </button>
        </walisto-button>
      `,
      this.shadowRoot!
    );
  }

  @target
  button!: HTMLElement;

  modal?: WalistoModalElement;

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.update();
    if (!this.address || !this.name) return;
    if (this.modal) return;
    const modalElement = document.createElement('walisto-modal');
    modalElement.setAttribute('data-address', this.address);
    modalElement.setAttribute('data-name', this.name);
    if (this.closeLabel) modalElement.closeLabel = this.closeLabel;
    document.body.appendChild(modalElement);
    this.modal = modalElement;
  }

  openModal() {
    if (!this.modal) return;
    this.modal.initialFocusRef = this.button.querySelector('button');
    this.modal.open();
  }
}
