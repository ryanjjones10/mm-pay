declare const emptyObjectSymbol: unique symbol
export type EmptyObject = { [emptyObjectSymbol]?: never }

export type Emptyish = null | undefined | '' | [] | EmptyObject | 0
