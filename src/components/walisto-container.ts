import { customElement, query } from './decorators';

const template = document.createElement('template');

template.innerHTML = /* HTML */ `
  <style>
    :host {
      --walisto-font-family: monospace;
      --walisto-width: 40rem;
      --walisto-item-gap: 0.5rem;
      font-family: var(--walisto-font-family);
      display: block;
    }

    .container walisto-item:not(:first-child) {
      margin-top: var(--walisto-item-gap);
    }

    .container {
      margin: 0;
      max-width: var(--walisto-width);
    }
  </style>
  <dl class="container" data-target="walisto-container.dl">
    <slot></slot>
  </dl>
`;

@customElement('walisto-container')
export class WalistoContainerElement extends HTMLElement {
  @query('dl')
  dl!: HTMLDListElement;

  get template() {
    const template = this.dl
      .querySelector('slot')!
      .assignedElements()
      .find((el) => el instanceof HTMLTemplateElement) as HTMLTemplateElement;
    return template;
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    const content = document.importNode(template.content, true);
    this.shadowRoot?.appendChild(content);
    const dlContent = document.importNode(this.template.content, true);
    this.dl.appendChild(dlContent);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'walisto-container': WalistoContainerElement;
  }
}
