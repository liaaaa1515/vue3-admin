// src/vite-env.d.ts
/// <reference types="vite/client" />

declare module "vue-virtual-scroller" {
  import type { Plugin } from "vue"

  const VueVirtualScroller: Plugin
  export default VueVirtualScroller
}
