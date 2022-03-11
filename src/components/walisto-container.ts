import { controller, target } from '@github/catalyst';
import { html, render } from '@github/jtml';

@controller
export class WalistoContainerElement extends HTMLElement {
  @target dl!: HTMLDListElement;

  get template() {
    const template = this.dl
      .querySelector('slot')!
      .assignedElements()
      .find((el) => el instanceof HTMLTemplateElement) as HTMLTemplateElement;
    return template;
  }

  content?: DocumentFragment;

  update() {
    render(
      html`
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
          ${this.content}
        </dl>
      `,
      this.shadowRoot!
    );
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.update();
    this.content = document.importNode(this.template.content, true);
    this.update();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'walisto-container': WalistoContainerElement;
  }
}
