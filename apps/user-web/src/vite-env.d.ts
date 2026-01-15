/// <reference types="vite/client" />

// Fix JSX namespace for React 19 + TypeScript
import type { JSX as ReactJSX } from 'react';

/* eslint-disable @typescript-eslint/no-empty-object-type */
declare global {
  namespace JSX {
    interface Element extends ReactJSX.Element {}
    interface ElementClass extends ReactJSX.ElementClass {}
    interface ElementAttributesProperty extends ReactJSX.ElementAttributesProperty {}
    interface ElementChildrenAttribute extends ReactJSX.ElementChildrenAttribute {}
    interface IntrinsicAttributes extends ReactJSX.IntrinsicAttributes {}
    interface IntrinsicClassAttributes<T> extends ReactJSX.IntrinsicClassAttributes<T> {}
    interface IntrinsicElements extends ReactJSX.IntrinsicElements {}
  }
}
/* eslint-enable @typescript-eslint/no-empty-object-type */
