"use client"
import {Todo} from "@prisma/client";
import {Task} from "@/app/components/task";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {ulid} from "ulid";

export type createTaskType = {
    title: string
}
export type updateTaskType = {
    id: string,
    title: string
    isDone: boolean
}


export default function () {
    const getTasks = async () => {
        const res = await fetch(`/api/tasks`, {cache: "no-cache"});
        return await res.json()
    }

    const [tasks, setTasks] = useState<Todo[]>([]);
    const addTask = (newTask: Todo): void => {
        setTasks(prevTasks => [...prevTasks, newTask]);
    };
    const updateTaskList = (newTask: Todo) => {
        setTasks(tasks.map(task =>
            task.id === newTask.id ? newTask : task
        ));
    };
    const saveData = async (task: createTaskType) => {
        await fetch(`/api/tasks`, {
            cache: "no-cache", method: "POST", body: JSON.stringify({
                title: task.title,
            })
        });
    }
    const taskSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        if (e.key !== "Enter" || input.value === "") {
            return;
        }
        addTask({title: input.value, isDone: false, id: ulid()});
        saveData({title: input.value});
        input.value = "";
    };
    useEffect(() => {
        // 非同期関数の作成
        const fetchFunction = async () => {
            const res = await getTasks();
            // set関数で値の更新
            setTasks(res);
        };
        // 非同期関数の実行
        fetchFunction();
    }, []);
    return (
        <div className="max-w-xl bg-gray-100 mx-auto max-h-screen h-screen p-2">
            <div className="border-[1px] border-gray-200 shadow-md w-full mt-24">
                <input type="text" placeholder="タスクを追加" className="text-blue-400 p-2 outline-0 w-full"
                       onKeyDown={(e) => taskSubmit(e)}/>
            </div>
            <table className="border-[1px] border-gray-200 shadow-md w-full bg-white mt-4 text-left">
                <thead className="text-gray-600">
                <tr>
                    <th scope="col"></th>
                    <th scope="col" className="p-2">タイトル</th>
                </tr>
                </thead>
                <tbody>
                {tasks.filter((task: Todo) => !task.isDone).map((task: Todo) => (
                    <Task key={task.id} initialTask={task} updateTaskList={updateTaskList}/>
                ))}
                <tr className="bg-white text-gray-600 border-[0.1px] border-gray-100">
                    <td className="h-full">
                        <div className="text-gray-600 flex">
                            <FontAwesomeIcon icon={faChevronUp} rotation={180}/>
                            <p>完了済み</p>
                        </div>
                    </td>
                </tr>
                {tasks.filter((task: Todo) => task.isDone).map((task: Todo) => (
                    <Task key={task.id} initialTask={task} updateTaskList={updateTaskList}/>
                ))}
                </tbody>
            </table>
        </div>
    )
}

