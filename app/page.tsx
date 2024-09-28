"use client";
import {Todo as TodoType} from "@prisma/client";
import {Todo} from "@/app/components/todo";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {ulid} from "ulid";
import {createTodoType} from "@/app/type/apiType";
import LoadingTodos from "@/app/components/loadingTodos";

export default function TodoList() {
    const [todos, setTodos] = useState<TodoType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const addTodoToState = (newTodo: TodoType): void => {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
    };

    const updateTodoListState = (newTodo: TodoType) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) => (todo.id === newTodo.id ? newTodo : todo))
        );
    };
    const deleteTodoListState = (deletedTodo: TodoType) => {
        setTodos((prevTodos) =>
            prevTodos.filter((todo) => (todo.id !== deletedTodo.id))
        )
    }

    const sendPostRequest = async (todo: createTodoType) => {
        try {
            await fetch(`/api/todos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: todo.title,
                }),
            });
        } catch (error) {
            console.error("Error sending POST request:", error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        if (e.key !== "Enter" || input.value.trim() === "") {
            return;
        }
        const newTodo: TodoType = {title: input.value, isDone: false, id: ulid()};
        addTodoToState(newTodo);
        sendPostRequest({title: input.value});
        input.value = "";
    };

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const res = await fetch(`/api/todos`, {cache: "no-cache"});
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                const jsonRes = await res.json();
                setTodos(jsonRes);
            } catch (error) {
                console.error("Error fetching todos:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTodos();
    }, []);

    return (
        <div className="max-w-xl bg-gray-100 mx-auto max-h-screen h-screen p-2">
            <div className="border-[1px] border-gray-200 shadow-md w-full mt-24">
                {isLoading ? (
                    <input
                        type="text"
                        placeholder="読み込み中"
                        disabled={true}
                        className="p-2 outline-0 w-full"
                        onKeyDown={handleKeyDown}
                    />
                ) : (
                    <input
                        type="text"
                        placeholder="タスクを追加"
                        className="p-2 outline-0 w-full text-gray-600 "
                        onKeyDown={handleKeyDown}
                    />
                )}

            </div>
            <table className="border-[1px] border-gray-200 shadow-md w-full bg-white mt-4 text-left">
                <thead className="text-gray-600">
                <tr>
                    <th scope="col"></th>
                    <th scope="col" className="p-2">タイトル</th>
                </tr>
                </thead>
                <tbody>
                {isLoading ? (
                    <>
                        <LoadingTodos/>
                        <LoadingTodos/>
                    </>


                ) : (
                    <>
                        {todos.filter((todo) => !todo.isDone).map((todo) => (
                            <Todo key={todo.id} initialTodo={todo} updateTodoListState={updateTodoListState}
                                  deleteTodoListState={deleteTodoListState}/>
                        ))}
                    </>
                )}

                <tr className="bg-white text-gray-600 border-[0.1px] border-gray-100">
                    <td className="h-full">
                        <div className="text-gray-600 flex">
                            <FontAwesomeIcon icon={faChevronUp} rotation={180}/>
                            <p>完了済み</p>
                        </div>
                    </td>
                </tr>
                {isLoading ? (
                    <>
                        <LoadingTodos/>
                        <LoadingTodos/>
                    </>

                ) : (
                    <>
                        {todos.filter((todo) => todo.isDone).map((todo) => (
                            <Todo key={todo.id} initialTodo={todo} updateTodoListState={updateTodoListState}
                                  deleteTodoListState={deleteTodoListState}/>
                        ))}
                    </>

                )}

                </tbody>
            </table>
        </div>
    );
}
