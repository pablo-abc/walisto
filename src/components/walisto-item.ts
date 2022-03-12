import './walisto-copy-button';
import './walisto-qr-button';

export class WalistoItemElement extends HTMLElement {
  [key: string]: unknown;

  name = '';

  address = '';

  qrLabel = '';

  copyLabel = '';

  modalCloseLabel = '';

  static get observedAttributes() {
    return ['name', 'address', 'qr-label', 'copy-label', 'modal-close-label'];
  }

  static attributeMap: { [key: string]: string } = {
    name: 'name',
    address: 'address',
    'qr-label': 'qrLabel',
    'copy-label': 'copyLabel',
    'modal-close-label': 'modalCloseLabel',
  };

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    const attributeMap = WalistoItemElement.attributeMap;
    this[attributeMap[name]] = newValue;
  }

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
          data-label="${this.copyLabel}"
          data-address="${this.address}"
        ></walisto-copy-button>
        <walisto-qr-button
          exportparts="button"
          data-address="${this.address}"
          data-label="${this.qrLabel}"
          data-name="${this.name}"
          data-close-label="${this.modalCloseLabel}"
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

customElements.define('walisto-item', WalistoItemElement);

declare global {
  interface HTMLElementTagNameMap {
    'walisto-item': WalistoItemElement;
  }
}
