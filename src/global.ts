export const isProd = false
export const childrenKey = isProd ? "_a" : "children"
export const contentKey = isProd ? "_b" : "content"
export const tagNameKey = isProd ? "_c" :  "tagName"
export const attributesKey = isProd ? "_d":  "attributes"
export const vdomsKey = isProd ? "_e":  "vdoms"

export interface AppJson {
  pages: string[],
  
}