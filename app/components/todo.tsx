"use client"
import {Todo as TodoType} from '@prisma/client';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle, faCircleCheck, faTrash} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {sendDeleteRequest, sendPutRequest} from "@/app/utils/apiClient";

export const Todo = ({initialTodo, updateTodoListState, deleteTodoListState}: {
    initialTodo: TodoType,
    updateTodoListState: (todo: TodoType) => void,
    deleteTodoListState: (todo: TodoType) => void,
}) => {
    const [todo, setTodo] = useState<TodoType>(initialTodo);
    const reverseDoneState = () => {
        const newTodo = {
            ...todo,
            isDone: !todo.isDone
        }
        setTodo(newTodo);
        return newTodo
    };

    const updateTitleState = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        const newTodo = {
            ...todo,
            title: input.value
        }
        setTodo(newTodo);
        return newTodo
    };

    const handleUpdateTitle = () => {
        try {
            // stateが更新される前にリクエストが送られる可能性がある。
            sendPutRequest(todo)
        } catch (e) {
            // エラーハンドリングをしっかりして、ユーザーにUIとして知らせたい。
            console.error("Internal Server Error");
        }

    }
    const handleDeleteTodo = () => {
        deleteTodoListState(todo)
        try {
            sendDeleteRequest(todo)
        } catch (e) {
            console.error("Internal Server Error");
        }
    }

    const handleUpdateDone = () => {
        const newTodo = reverseDoneState()
        try {
            sendPutRequest(newTodo)
        } catch (e) {
            console.error("Internal Server Error");
        }
    }

    useEffect(() => {
        if (initialTodo !== todo) {
            updateTodoListState(todo);
        }
    }, [todo, updateTodoListState]);

    return (
        <tr className="bg-white text-gray-600 border-[0.1px] border-gray-100 ">
            <th>
                <div className="border-2 hover:border-gray-300 border-white p-2">
                    {todo.isDone
                        ? <FontAwesomeIcon icon={faCircleCheck} onClick={handleUpdateDone}/>
                        : <FontAwesomeIcon icon={faCircle} onClick={handleUpdateDone}/>
                    }
                </div>
            </th>
            <td className="h-full">
                <div className="border-2 hover:border-gray-300 border-white focus:shadow-2xl h-12 outline-none">
                    <input value={todo.title} onInput={(e) => updateTitleState(e)}
                           className={`h-full outline-none ${todo.isDone ? "line-through decoration-2" : ""}`}
                           onBlur={handleUpdateTitle}/>
                </div>
            </td>
            <td className="h-full">
                <div className="border-2 hover:border-gray-300 border-white focus:shadow-2xl h-12 outline-none ">
                    <FontAwesomeIcon icon={faTrash} onClick={handleDeleteTodo}/>
                </div>
            </td>

        </tr>
    );
};
