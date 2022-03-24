type CustomElement = {
  new (...args: any[]): any;
  properties?: {
    [key: string]: AttributeOptions;
  };
  observedAttributes?: string[];
};

type AttributeDefinition = {
  property: string;
  name: string;
  converter: (value: any) => any;
  hasChanged: (oldValue: any, newValue: any) => boolean;
  descriptor?: PropertyDescriptor;
};

type AttributeOptions = {
  name?: string;
  converter?: (value: any) => any;
  hasChanged?: (oldValue: any, newValue: any) => boolean;
  type?: typeof String | typeof Boolean | typeof Number;
};

const attributeDefinitions: WeakMap<
  any,
  Set<AttributeDefinition>
> = new WeakMap();

const defaultConverterters = {
  [String.toString()]: String,
  [Boolean.toString()]: (value: string) =>
    value === '' || (!!value && value !== 'false'),
  [Number.toString()]: Number,
};

function getConverter(attribute: AttributeOptions) {
  if (attribute.converter) return attribute.converter;
  if (attribute.type) return defaultConverterters[attribute.type.toString()];
  return String;
}

function hasChanged(oldValue: any, newValue: any) {
  return oldValue !== newValue;
}

export function attribute(options: AttributeOptions = {}) {
  return function (target: any, key: string, descriptor?: PropertyDescriptor) {
    if (!attributeDefinitions.has(target))
      attributeDefinitions.set(target, new Set());
    const property: AttributeDefinition = {
      name: options.name || key.toLowerCase(),
      property: key,
      converter: getConverter(options),
      hasChanged: options.hasChanged || hasChanged,
      descriptor,
    };
    attributeDefinitions.get(target)?.add(property);
  };
}

export function query(selector: string) {
  return function (target: any, key: string) {
    Object.defineProperty(target, key, {
      configurable: true,
      get() {
        if (this.shadowRoot) {
          return this.shadowRoot.querySelector(selector);
        }
        return this.querySelector(selector);
      },
    });
  };
}

export function queryAll(selector: string) {
  return function (target: HTMLElement, key: string) {
    Object.defineProperty(target, key, {
      configurable: true,
      get() {
        if (this.shadowRoot) {
          return this.shadowRoot.querySelectorAll(selector);
        }
        return this.querySelectorAll(selector);
      },
    });
  };
}

function definitionsFromStatic(target: CustomElement) {
  const properties = target.properties;
  if (!properties) return;
  const keys = Object.keys(properties);
  for (const key of keys) {
    attribute(properties[key])(target.prototype, key);
  }
}

function capitalizeFirst(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function customElement<T extends CustomElement>(name: string) {
  return function (classObject: T) {
    let observed = classObject.observedAttributes || [];
    definitionsFromStatic(classObject);
    const attributes = Array.from(
      attributeDefinitions.get(classObject.prototype) || []
    );

    const changed = classObject.prototype.attributeChangedCallback;

    classObject.prototype.attributeChangedCallback = function (
      name: string,
      oldValue: any,
      newValue: any
    ) {
      const attribute = attributes.find((property) => property.name === name);
      if (attribute && attribute.hasChanged(oldValue, newValue)) {
        this[attribute.property] = attribute.converter(newValue);
      }
      changed?.call(this, name, oldValue, newValue);
    };

    Object.defineProperty(classObject, 'observedAttributes', {
      configurable: true,
      get() {
        return attributes.map((attr) => attr.name).concat(observed);
      },
      set(attributes: string[]) {
        observed = attributes;
      },
    });

    class WrappedElement extends classObject {
      constructor(...args: any[]) {
        super(...args);
        for (const attr of attributes) {
          const key = attr.property;
          const descriptor = attr.descriptor;
          if (descriptor && !descriptor.set) continue;
          let internalValue: any;
          Object.defineProperty(this, key, {
            configurable: true,
            set(value: any) {
              if (!attr.hasChanged(internalValue, value)) return;
              const capitalized = capitalizeFirst(key);
              const oldValue = internalValue;
              internalValue = this[`before${capitalized}Change`]
                ? this[`before${capitalized}Change`]!(oldValue, value)
                : value;
              descriptor?.set?.(value);
              this[`after${capitalized}Change`]?.(oldValue, value);
            },
            get() {
              if (descriptor?.get) return descriptor.get();
              return internalValue;
            },
          });
        }
      }
    }

    if (!customElements.get(name)) customElements.define(name, WrappedElement);
    return WrappedElement;
  };
}
