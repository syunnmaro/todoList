"use client"
import React, {useState} from "react";
import {Task} from "@/app/components/task";
import {faChevronUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ulid} from "ulid";

export type TaskType = {
    id: string
    title: string,
    isDone: Boolean,

}

export default function Home() {
    const [tasks, setTasks] = useState<TaskType[]>([]);

    const addTask = (newTask: TaskType): void => {
        setTasks(prevTasks => [...prevTasks, newTask]);
    };

    const taskSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        if (e.key !== "Enter" || input.value === "") {
            return;
        }
        addTask({title: input.value, isDone: false, id: ulid()});
        input.value = "";
    };

    const updateTaskList = (newTask: TaskType) => {
        setTasks(tasks.map(task =>
            task.id === newTask.id ? newTask : task
        ));
    };

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
                {tasks.filter((task: TaskType) => !task.isDone).map((task: TaskType) => (
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
                {tasks.filter((task: TaskType) => task.isDone).map((task: TaskType) => (
                    <Task key={task.id} initialTask={task} updateTaskList={updateTaskList}/>
                ))}
                </tbody>
            </table>
        </div>
    );
}
