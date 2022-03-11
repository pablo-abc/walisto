import { controller } from '@github/catalyst';

const template = document.createElement('template');

template.innerHTML = /* HTML */ `
  <style>
    ::slotted(button) {
      background: var(--walisto-button-bg);
      border: none;
      border-radius: 10px;
      padding: 0.6rem 0.5rem 0.4rem 0.7rem;
      color: var(--walisto-button-font-color);
      cursor: pointer;
      transition: background 0.1s, transform 0.1s;
    }

    ::slotted(button:focus-visible) {
      outline: var(--walisto-outline-fv);
      outline-offset: 2px;
    }

    ::slotted(button:hover) {
      background: var(--walisto-button-bg-hover);
    }

    ::slotted(button:active) {
      background: var(--walisto-button-bg-active);
      transform: scale(0.95);
    }
  </style>
  <slot></slot>
`;

@controller
export class WalistoButtonElement extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    const content = document.importNode(template.content, true);
    this.shadowRoot?.appendChild(content);
  }
}
