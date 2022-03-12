# Walisto

A web component widget to list your crypto wallets

## Installation

You can use a CDN and add the followin to the `head` of your page:

```html
<!-- using unpkg -->
<script type="module" src="https://unpkg.com/walisto@<VERSION>/dist/index.min.js"></script>
```

## Usage

There's two components: `<walisto-container>` and `<walisto-item>`. `<walisto-container>` is only used for styling and it is completely optional.

`<walisto-item>` accepts the following props:

* `data-address`: The address to display
* `data-name`: The name of the currency

```html
<walisto-container>
  <template>
    <walisto-item part="item" data-name="BTC" data-address="testbtcaddress"></walisto-item>
    <walisto-item part="item" data-name="ETH" data-address="testethaddress"></walisto-item>
  </template>
</walisto-container>
```

> **NOTE**: You can add a `part` attribute to whatever you have in the template to style it.

The following CSS custom properties can be overriden on `<walisto-item>`:

```css
walisto-item {
  --walisto-item-bg: #222;
  --walisto-font-color: #ddd;
  --walisto-button-font-color: var(--walisto-font-color);
  --walisto-button-bg: #555;
  --walisto-button-bg-hover: #777;
  --walisto-button-bg-active: #999;
  --walisto-outline-fv: 2px solid #07d;
}
```

And you can style the following parts:

* `term`: the name of the currency
* `definition`: the address and buttons
* `address`: the address only
* `buttons`: the buttons container
* `button`: the buttons themselves

### Modal styling

Since the modal gets added on the `body` itself, styling should be done separately using the following CSS custom properties:

```css
walisto-modal {
  --walisto-modal-bg: #222;
  --walisto-modal-backdrop-bg: rgba(250, 250, 250, 0.2);
  --walisto-modal-button-bg: #555;
  --walisto-modal-button-bg-hover: #777;
  --walisto-modal-button-bg-active: #999;
  --walisto-modal-font-color: #ddd;
  --walisto-modal-button-font-color: var(--walisto-modal-font-color);
  --walisto-modal-font-family: monospace;
  --walisto-modal-outline-fv: 2px solid #07d;
}
```

And the following parts are available:

* `backdrop`: the backdrop of the modal
* `content`: the modal content itself
* `header`: the header of the modal
* `title`: the title (h1) on the header
* `button`: the button for closing the modal
* `image`: the QR code image
