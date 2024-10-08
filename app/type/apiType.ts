export type createTodoType = {
    title: string
}
export type updateTodoType = {
    id: string,
    title: string
    isDone: boolean
}

export type deleteTodoType = {
    id: string,
}