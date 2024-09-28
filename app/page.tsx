"use client"
import {Todo as TodoType} from "@prisma/client";
import {Todo} from "@/app/components/Todo";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {ulid} from "ulid";
import {createTodoType} from "@/app/type/apiType";

export default function () {
    const [todos, setTodos] = useState<TodoType[]>([]);
    const addTodoToState = (newTodo: TodoType): void => {
        setTodos([...todos, newTodo]);
    };
    const updateTodoListState = (newTodo: TodoType) => {
        setTodos(todos.map(todo =>
            todo.id === newTodo.id ? newTodo : todo
        ));
    };
    const sendPostRequest = async (todo: createTodoType) => {
        await fetch(`/api/todos`, {
            cache: "no-cache", method: "POST", body: JSON.stringify({
                title: todo.title,
            })
        });
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        if (e.key !== "Enter" || input.value === "") {
            return;
        }
        addTodoToState({title: input.value, isDone: false, id: ulid()});
        sendPostRequest({title: input.value});
        input.value = "";
    };
    useEffect(() => {
        const fetchFunction = async () => {
            const res = await fetch(`/api/todos`, {cache: "no-cache"});
            const jsonRes = await res.json()
            setTodos(jsonRes);
        };
        fetchFunction();
    }, []);
    return (
        <div className="max-w-xl bg-gray-100 mx-auto max-h-screen h-screen p-2">
            <div className="border-[1px] border-gray-200 shadow-md w-full mt-24">
                <input type="text" placeholder="タスクを追加" className="text-blue-400 p-2 outline-0 w-full"
                       onKeyDown={(e) => handleKeyDown(e)}/>
            </div>
            <table className="border-[1px] border-gray-200 shadow-md w-full bg-white mt-4 text-left">
                <thead className="text-gray-600">
                <tr>
                    <th scope="col"></th>
                    <th scope="col" className="p-2">タイトル</th>
                </tr>
                </thead>
                <tbody>
                {todos.filter((todo: TodoType) => !todo.isDone).map((todo: TodoType) => (
                    <Todo key={todo.id} initialTodo={todo} updateTodoListState={updateTodoListState}/>
                ))}
                <tr className="bg-white text-gray-600 border-[0.1px] border-gray-100">
                    <td className="h-full">
                        <div className="text-gray-600 flex">
                            <FontAwesomeIcon icon={faChevronUp} rotation={180}/>
                            <p>完了済み</p>
                        </div>
                    </td>
                </tr>
                {todos.filter((todo: TodoType) => todo.isDone).map((todo: TodoType) => (
                    <Todo key={todo.id} initialTodo={todo} updateTodoListState={updateTodoListState}/>
                ))}
                </tbody>
            </table>
        </div>
    )
}

