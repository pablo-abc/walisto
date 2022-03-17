import { customElement, attribute } from './decorators';

import './walisto-copy-button';
import './walisto-qr-button';

@customElement('walisto-item')
export class WalistoItemElement extends HTMLElement {
  [key: string]: unknown;

  @attribute()
  name = '';

  @attribute()
  address = '';

  @attribute({ name: 'qr-label' })
  qrLabel = '';

  @attribute({ name: 'copy-label' })
  copyLabel = '';

  @attribute({ name: 'modal-close-label' })
  modalCloseLabel = '';

  inContainer?: boolean = false;

  #termTag(children?: string) {
    if (this.inContainer)
      return /* HTML */ `<dt part="term" id="term">${children}</dt>`;
    else return /* HTML */ `<div part="term" id="term">${children}</div>`;
  }

  #definitionTag(children?: string) {
    if (this.inContainer)
      return /* HTML */ `<dd part="definition" id="definition">
        ${children}
      </dd>`;
    else
      return /* HTML */ `<div part="definition" id="definition">
        ${children}
      </div>`;
  }

  #definitionContent() {
    return /* HTML */ `
      <span part="address" id="address">${this.address}</span>
      <div id="buttons" part="buttons">
        <walisto-copy-button
          exportparts="button"
          label="${this.copyLabel}"
          address="${this.address}"
        ></walisto-copy-button>
        <walisto-qr-button
          exportparts="button"
          address="${this.address}"
          label="${this.qrLabel}"
          name="${this.name}"
          close-label="${this.modalCloseLabel}"
        >
        </walisto-qr-button>
      </div>
    `;
  }

  get template() {
    const template = document.createElement('template');
    template.innerHTML = /* HTML */ `
      <style>
        :host {
          --walisto-item-bg: #222;
          --walisto-font-color: #ddd;
          --walisto-button-font-color: var(--walisto-font-color);
          --walisto-button-bg: #555;
          --walisto-button-bg-hover: #777;
          --walisto-button-bg-active: #999;
          --walisto-outline-fv: 2px solid #07d;
          color: var(--walisto-font-color);
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          align-items: center;
          background: var(--walisto-item-bg);
          border-radius: 10px;
          line-height: 1.5rem;
        }

        div {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
        }

        #term {
          font-weight: 700;
          margin: 0;
          padding: 0.5rem 1rem;
        }

        #definition {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          overflow: hidden;
          margin: 0;
          margin-left: 1rem;
        }

        #address {
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0.5rem 1rem;
          font-size: 0.875em;
          opacity: 0.7;
        }

        #buttons {
          margin-left: auto;
          padding: 0.5rem 1rem;
        }

        #buttons > walisto-copy-button {
          margin-right: 0.5rem;
        }
      </style>
      ${this.#termTag(this.name)}
      ${this.#definitionTag(this.#definitionContent())}
    `;
    return template;
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.inContainer = !!this.closest('dl');
    this.setAttribute('role', this.inContainer ? 'presentation' : 'group');
    const content = document.importNode(this.template.content, true);
    this.shadowRoot?.appendChild(content);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'walisto-item': WalistoItemElement;
  }
}
