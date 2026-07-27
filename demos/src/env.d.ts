/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module 'virtual:blog-posts' {
  import type { Post } from '@/types/blog'
  export const posts: Post[]
  const _default: Post[]
  export default _default
}
