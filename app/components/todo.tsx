"use client"
import {Todo as TodoType} from '@prisma/client';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle, faCircleCheck} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {updateTodoType} from "@/app/type/apiType";

export const Todo = ({initialTodo, updateTodoListState}: {
    initialTodo: TodoType,
    updateTodoListState: (todo: TodoType) => void
}) => {
    const [todo, setTodo] = useState<TodoType>(initialTodo);
    const sendPutRequest = async (todo: updateTodoType) => {
        await fetch(`/api/todos`, {
            cache: "no-cache", method: "PUT", body: JSON.stringify({
                id: todo.id,
                title: todo.title,
                isDone: todo.isDone
            })
        });
    }
    const reverseDoneStatus = () => {
        const newTodo = {
            ...todo,
            isDone: !todo.isDone
        }
        setTodo(newTodo);
        sendPutRequest(newTodo);
        return newTodo
    };

    const updateTitleStatus = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        const newTodo = {
            ...todo,
            title: input.value
        }
        setTodo(newTodo);
        return newTodo
    };

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
                        ? <FontAwesomeIcon icon={faCircleCheck} onClick={reverseDoneStatus}/>
                        : <FontAwesomeIcon icon={faCircle} onClick={reverseDoneStatus}/>
                    }
                </div>
            </th>
            <td className="h-full">
                <div className="border-2 hover:border-gray-300 border-white focus:shadow-2xl h-12 outline-none">
                    <input value={todo.title} onInput={(e) => updateTitleStatus(e)}
                           className={`h-full outline-none ${todo.isDone ? "line-through decoration-2" : ""}`}
                           onBlur={() => sendPutRequest(todo)}/>
                </div>
            </td>
        </tr>
    );
};
