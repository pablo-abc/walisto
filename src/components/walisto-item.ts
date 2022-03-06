import type { TemplateResult } from 'lit';
import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import './walisto-copy-button';
import './walisto-qr-button';

@customElement('walisto-item')
export class WalistoItem extends LitElement {
  // Define scoped styles right with your component, in plain CSS
  static styles = css`
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
  `;

  @property()
  name?: string;

  @property()
  address?: string;

  @property({ attribute: 'qr-label' })
  qrLabel?: string;

  @property({ attribute: 'copy-label' })
  copyLabel?: string;

  @property({ attribute: 'modal-close-label' })
  modalCloseLabel?: string;

  @state()
  inContainer?: boolean = false;

  private _termTag(children?: string) {
    if (this.inContainer)
      return html` <dt part="term" id="term">${children}</dt> `;
    else return html` <div part="term" id="term">${children}</div> `;
  }

  private _definitionTag(children?: TemplateResult) {
    if (this.inContainer)
      return html` <dd part="definition" id="definition">${children}</dd> `;
    else
      return html` <div part="definition" id="definition">${children}</div> `;
  }

  private _definitionContent() {
    return html`
      <span part="address" id="address">${this.address}</span>
      <div id="buttons" part="buttons">
        <walisto-copy-button
          exportparts="button"
          label=${this.copyLabel}
          address=${this.address}
        ></walisto-copy-button>
        <walisto-qr-button
          exportparts="button"
          address=${this.address}
          label=${this.qrLabel}
          name=${this.name}
          close-label=${this.modalCloseLabel}
        >
        </walisto-qr-button>
      </div>
    `;
  }

  render() {
    return html`
      ${this._termTag(this.name)}
      ${this._definitionTag(this._definitionContent())}
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.inContainer = !!this.closest('walisto-container');
    this.setAttribute('role', this.inContainer ? 'presentation' : 'group');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'walisto-item': WalistoItem;
  }
}
