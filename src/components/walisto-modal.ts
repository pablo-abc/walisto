import type { SlQrCode, SlDialog } from '@shoelace-style/shoelace';
import { customElement, query, attribute } from './decorators';

import '@shoelace-style/shoelace/dist/components/qr-code/qr-code';
import '@shoelace-style/shoelace/dist/components/dialog/dialog';
import './walisto-button';

const template = document.createElement('template');

template.innerHTML = /* HTML */ `
  <style>
    :host {
      --walisto-modal-bg: #222;
      --walisto-modal-backdrop-bg: rgba(250, 250, 250, 0.2);
      --walisto-modal-button-bg: #555;
      --walisto-modal-button-bg-hover: #777;
      --walisto-modal-button-bg-active: #999;
      --walisto-modal-font-color: #ddd;
      --walisto-modal-button-font-color: var(--walisto-modal-font-color);
      --walisto-modal-font-family: monospace;
      --walisto-modal-outline-fv: 2px solid #07d;
      display: block;
    }

    sl-dialog::part(overlay) {
      background: var(--walisto-modal-backdrop-bg);
    }

    sl-dialog::part(panel) {
      width: auto;
      display: block;
      background: var(--walisto-modal-bg);
      border-radius: 10px;
      color: var(--walisto-modal-font-color);
      font-family: var(--walisto-modal-font-family);
      max-width: 50rem;
    }

    sl-dialog header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
    }

    sl-qr-code::part(base) {
      max-width: min(80vw, 80vh);
      max-height: min(80vw, 80vh);
      margin: 1rem;
    }

    sl-dialog header h1 {
      margin: 0;
    }

    #close-button {
      --walisto-button-bg: var(--walisto-modal-button-bg);
      --walisto-button-bg-hover: var(--walisto-modal-button-bg-hover);
      --walisto-button-bg-active: var(--walisto-modal-button-bg-active);
      --walisto-button-font-color: var(--walisto-modal-button-font-color);
      --walisto-outline-fv: var(--walisto-modal-outline-fv);
    }

    #close-button svg {
      height: 1.3rem;
      margin-left: -0.1rem;
    }
  </style>
  <sl-dialog part="dialog" no-header label="Address">
    <header part="header">
      <h1 part="title" id="dialog-title">Address</h1>
      <walisto-button>
        <button part="button" id="close-button" type="button">
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
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </walisto-button>
    </header>
    <sl-qr-code size="254" value="" label="QR Code" />
  </sl-dialog>
`;

@customElement('walisto-modal')
export class WalistoModalElement extends HTMLElement {
  @query('#dialog-title')
  heading!: HTMLHeadingElement;

  @query('#close-button')
  button!: HTMLButtonElement;

  @query('sl-qr-code')
  qrCode!: SlQrCode;

  @query('sl-dialog')
  dialog!: SlDialog;

  @attribute()
  address = '';

  @attribute()
  name = '';

  @attribute({ name: 'close-label' })
  closeLabel = '';

  initialFocusRef?: HTMLElement | null;

  open() {
    this.isOpen = true;
    this.dialog.show();
  }

  close() {
    this.isOpen = false;
    this.dialog.hide();
    requestAnimationFrame(() => {
      this.initialFocusRef?.focus();
    });
  }

  isOpen = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  connectedCallback() {
    const content = document.importNode(template.content, true);
    this.shadowRoot!.appendChild(content);
    this.update();
    this.qrCode.value = this.address;
    this.button.addEventListener('click', this.close);
  }

  disconnectedCallback() {
    this.close();
    this.button.removeEventListener('click', this.close);
  }

  update() {
    const label = this.closeLabel || 'Close';
    if (this.name) {
      this.heading.textContent = this.name;
      this.dialog.label = this.name;
    }
    this.button.setAttribute('aria-label', label);
    this.button.setAttribute('title', label);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'walisto-modal': WalistoModalElement;
  }
}
