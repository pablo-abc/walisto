import { LitElement, css, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { AwesomeQR } from 'awesome-qr';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import type { FocusTrap } from 'focus-trap';
import { createFocusTrap } from 'focus-trap';

import './walisto-button';

@customElement('walisto-modal')
export class WalistoModal extends LitElement {
  static styles = css`
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

    #backdrop {
      position: fixed;
      display: none;
      place-items: center;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--walisto-modal-backdrop-bg);
      overflow: auto;
    }

    #content {
      display: block;
      background: var(--walisto-modal-bg);
      padding: 1rem;
      border-radius: 10px;
      color: var(--walisto-modal-font-color);
      font-family: var(--walisto-modal-font-family);
      max-width: 50rem;
    }

    #content img {
      max-width: 90vw;
      max-height: 90vh;
    }

    #content header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
    }

    #content header h1 {
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
  `;

  @property()
  address?: string;

  @property()
  name?: string;

  @property()
  closeLabel?: string;

  @property()
  initialFocusRef?: HTMLElement | null;

  @property({ attribute: false })
  open() {
    this.isOpen = true;
  }

  @property({ attribute: false })
  close() {
    this.isOpen = false;
  }

  @state()
  imgSrc?: string;

  @state()
  isOpen?: boolean = false;

  @query('#backdrop')
  backdropElement?: HTMLDivElement;

  focusTrap?: FocusTrap;

  updated(changedProperties: Map<string, any>) {
    if (!this.backdropElement) return;
    if (!changedProperties.has('isOpen')) return;
    if (!this.focusTrap) this.focusTrap = createFocusTrap(this.backdropElement);
    if (this.isOpen) {
      this.backdropElement.style.display = 'grid';
      document.addEventListener('keyup', this._handleKeyup);
      this.focusTrap.activate();
      disableBodyScroll(this.backdropElement);
    } else {
      this.focusTrap.deactivate();
      this.backdropElement.style.display = 'none';
      document.removeEventListener('keyup', this._handleKeyup);
      enableBodyScroll(this.backdropElement);
      if (this.initialFocusRef) this.initialFocusRef.focus();
    }
  }

  private _handleKeyup = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
    }
  };

  private _onBackdropClick(e: MouseEvent) {
    const target = e.target as HTMLDivElement;
    if (target === this.backdropElement) this.close();
  }

  connectedCallback() {
    super.connectedCallback();
    new AwesomeQR({
      text: this.address,
      size: 500,
    })
      .draw()
      .then((dataUrl) => {
        this.imgSrc = dataUrl?.toString() ?? '';
      });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.close();
    this.removeEventListener('keyup', this._handleKeyup);
    if (this.backdropElement) enableBodyScroll(this.backdropElement);
  }

  render() {
    return html`
      <div
        part="backdrop"
        id="backdrop"
        role="presentation"
        @click=${this._onBackdropClick}
      >
        <div
          aria-labelledby="dialog-title"
          id="content"
          aria-modal="true"
          role="dialog"
          part="content"
        >
          <header part="header">
            <h1 part="title" id="dialog-title">${this.name ?? 'Address'}</h1>
            <walisto-button>
              <button
                aria-label=${this.closeLabel || 'Close'}
                part="button"
                title=${this.closeLabel || 'Close'}
                id="close-button"
                type="button"
                @click=${() => this.close()}
              >
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
          <img part="image" src=${this.imgSrc} alt="QR Code" />
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'walisto-modal': WalistoModal;
  }
}
