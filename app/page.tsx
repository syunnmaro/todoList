"use client";
import {Todo as TodoType} from "@prisma/client";
import {Todo} from "@/app/components/todo";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import LoadingTodos from "@/app/components/loadingTodos";
import {sendPostRequest} from "@/app/utils/apiClient";

export default function TodoList() {
    const [todos, setTodos] = useState<TodoType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const addTodoToState = (newTodo: TodoType): void => {
        setTodos((prevTodos) => {
            return [...prevTodos, newTodo];
        });
    };

    const updateTodoListState = (newTodo: TodoType) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) => (todo.id === newTodo.id ? newTodo : todo))
        );
        console.log(todos)
    };
    const replaceTodoListState = (todos: TodoType[]) => {
        setTodos(todos)
    }
    const deleteTodoListState = (deletedTodo: TodoType) => {
        setTodos((prevTodos) =>
            prevTodos.filter((todo) => (todo.id !== deletedTodo.id))
        )
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        if (e.key !== "Enter" || input.value.trim() === "") {
            return;
        }
        // // フロントでいち早く反映するために、入力されたタイトルをもとに仮のTodoを追加する
        // const temporaryNewTodo: TodoType = {title: input.value, isDone: false, id: ulid()};
        // console.log(temporaryNewTodo)
        // addTodoToState(temporaryNewTodo);

        // ここの実装がうまくいかなかった。addTodoToStateによってstateに追加される前にupdateTodoListStateが該当のIDを検索しようとして、見つからず値が更新されないということが起きているみたい。
        try {
            sendPostRequest({title: input.value}).then(async res => {
                if (res.status === 200) {
                    const jsonRes = await res.json()
                    addTodoToState(jsonRes);
                }
            });
        } catch (e) {
            console.error("Internal Server Error");
        }

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
                // ユーザーに知らせるUIがあるともっといい。
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
