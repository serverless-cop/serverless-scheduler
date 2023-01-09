export interface TodoGetParams{
    id: string
    userId: string
}
export interface TodoEntity{
    id: string
    userId: string
    name: string
    description: string
    deadline: string
}
export interface TodoCreateParams{
    userId: string
    name: string
    description: string
    deadline: string
}

export type TodoEditParams = TodoEntity
export type TodoDeleteParams = TodoGetParams
