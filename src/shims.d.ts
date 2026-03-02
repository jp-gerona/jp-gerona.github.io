import type { AttributifyAttributes } from "@unocss/preset-attributify";

declare global {
  namespace svelteHTML {
    interface HTMLAttributes<T> extends AttributifyAttributes {}
  }

  namespace astroHTML.JSX {
    interface HTMLAttributes extends AttributifyAttributes {}
  }
}
