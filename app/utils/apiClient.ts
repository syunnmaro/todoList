import {createTodoType, deleteTodoType, updateTodoType} from "@/app/type/apiType";

// API系をまとめた。エンドポイントを変更できるようにするともっといい。
export const sendPostRequest = async (todo: createTodoType) => {
    const res = await fetch(`/api/todos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: todo.title,
        }),
    });
    return res
};
export const sendPutRequest = async (todo: updateTodoType) => {
    return await fetch(`/api/todos`, {
        cache: "no-cache", method: "PUT", body: JSON.stringify({
            id: todo.id,
            title: todo.title,
            isDone: todo.isDone
        })
    });
}
export const sendDeleteRequest = async (todo: deleteTodoType) => {
    return await fetch(`/api/todos`, {
        cache: "no-cache", method: "DELETE", body: JSON.stringify({
            id: todo.id,
        })
    });
}