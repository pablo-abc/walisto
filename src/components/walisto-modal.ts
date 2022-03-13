import { controller, attr, target } from '@github/catalyst';
import { AwesomeQR } from 'awesome-qr';
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from 'body-scroll-lock';
import type { FocusTrap } from 'focus-trap';
import { createFocusTrap } from 'focus-trap';
import { hideOthers } from 'aria-hidden';

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
  </style>
  <div
    part="backdrop"
    id="backdrop"
    data-target="walisto-modal.backdrop"
    role="presentation"
    data-action="click:walisto-modal#closeFromBackdrop"
  >
    <div
      aria-labelledby="dialog-title"
      id="content"
      aria-modal="true"
      role="dialog"
      part="content"
    >
      <header part="header">
        <h1 part="title" id="dialog-title" data-target="walisto-modal.heading">
          Address
        </h1>
        <walisto-button>
          <button
            part="button"
            id="close-button"
            type="button"
            data-action="click:walisto-modal#close"
            data-target="walisto-modal.button"
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
      <img part="image" alt="QR Code" data-target="walisto-modal.image" />
    </div>
  </div>
`;

@controller
export class WalistoModalElement extends HTMLElement {
  @target backdrop!: HTMLDivElement;

  @target heading!: HTMLHeadingElement;

  @target button!: HTMLButtonElement;

  @target image!: HTMLImageElement;

  @attr address = '';

  @attr name = '';

  @attr closeLabel = '';

  initialFocusRef?: HTMLElement | null;

  open() {
    this.isOpen = true;
    this.backdrop.style.display = 'grid';
    document.addEventListener('keyup', this.#handleKeyup);
    this.#focusTrap?.activate();
    this.#hideUndo = hideOthers(this);
    disableBodyScroll(this.backdrop);
  }

  close() {
    this.isOpen = false;
    this.#focusTrap?.deactivate();
    this.backdrop.style.display = 'none';
    document.removeEventListener('keyup', this.#handleKeyup);
    enableBodyScroll(this.backdrop);
    this.#hideUndo?.();
    const initialFocusRef = this.initialFocusRef;
    if (initialFocusRef) {
      requestAnimationFrame(() => {
        initialFocusRef.focus();
        initialFocusRef.scrollIntoView();
      });
    }
  }

  isOpen = false;

  #focusTrap?: FocusTrap;

  #hideUndo?: () => void;

  #handleKeyup = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
    }
  };

  closeFromBackdrop(e: MouseEvent) {
    const target = e.target as HTMLDivElement;
    if (target === this.backdrop) this.close();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    const content = document.importNode(template.content, true);
    this.shadowRoot?.appendChild(content);
    this.update();
    if (!this.#focusTrap) this.#focusTrap = createFocusTrap(this.backdrop);
    new AwesomeQR({
      text: this.address,
      size: 500,
    })
      .draw()
      .then((dataUrl) => {
        this.image.src = dataUrl?.toString() ?? '';
      });
  }

  disconnectedCallback() {
    this.close();
    this.removeEventListener('keyup', this.#handleKeyup);
    this.#hideUndo?.();
    this.#focusTrap?.deactivate();
    clearAllBodyScrollLocks();
  }

  update() {
    const label = this.closeLabel || 'Close';
    if (this.name) this.heading.textContent = this.name;
    this.button.setAttribute('aria-label', label);
    this.button.setAttribute('title', label);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'walisto-modal': WalistoModalElement;
  }
}
