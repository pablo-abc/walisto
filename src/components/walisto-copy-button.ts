import { controller, attr, target } from '@github/catalyst';

import './walisto-button';

const template = document.createElement('template');

template.innerHTML = /* HTML */ `
  <style>
    .success {
      --walisto-button-font-color: #6d3;
    }

    #copy-button svg {
      height: 1.3rem;
    }
  </style>
  <walisto-button data-target="walisto-copy-button.walistoButton">
    <button
      type="button"
      data-action="click:walisto-copy-button#copyAddress"
      id="copy-button"
      part="button"
      data-target="walisto-copy-button.button"
    ></button>
  </walisto-button>
`;

@controller
export class WalistoCopyButtonElement extends HTMLElement {
  @target
  walistoButton!: HTMLElement;

  @target
  button!: HTMLButtonElement;

  @attr
  label = '';

  @attr
  address = '';

  copied = false;

  private _renderContent() {
    if (this.copied) {
      return /* HTML */ `
        <svg
          aria-hidden="true"
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
    return /* HTML */ `
      <svg
        aria-hidden="true"
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

  update() {
    const label = this.label || 'Copy to clipboard';
    this.button.setAttribute('aria-label', label);
    this.button.setAttribute('title', label);
    this.button.innerHTML = this._renderContent();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    const content = document.importNode(template.content, true);
    this.shadowRoot?.appendChild(content);
    this.update();
  }

  copyAddress() {
    if (!this.address) return;
    navigator.clipboard.writeText(this.address);
    this.copied = true;
    this.walistoButton.classList.add('success');
    this.update();
    setTimeout(() => {
      this.walistoButton.classList.remove('success');
      this.copied = false;
      this.update();
    }, 500);
  }
}
