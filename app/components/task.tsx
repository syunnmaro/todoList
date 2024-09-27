"use client"
import {Todo} from '@prisma/client';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle, faCircleCheck} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {updateTaskType} from "@/app/page";

export const Task = ({initialTask, updateTaskList}: {
    initialTask: Todo,
    updateTaskList: (task: Todo) => void
}) => {
    const [task, setTask] = useState<Todo>(initialTask);
    const updateData = async (task: updateTaskType) => {
        await fetch(`/api/tasks`, {
            cache: "no-cache", method: "PUT", body: JSON.stringify({
                id: task.id,
                title: task.title,
                isDone: task.isDone
            })
        });
    }
    const reverseDoneStatus = () => {
        const newTask = {
            ...task,
            isDone: !task.isDone
        }
        setTask(newTask);
        updateData(newTask);
        return newTask
    };

    const updateTitleStatus = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        const newTask = {
            ...task,
            title: input.value
        }
        setTask(newTask);
        return newTask
    };

    useEffect(() => {
        if (initialTask !== task) {
            updateTaskList(task);
        }
    }, [task, updateTaskList]);

    return (
        <tr className="bg-white text-gray-600 border-[0.1px] border-gray-100 ">
            <th className="">
                <div className="border-2 hover:border-gray-300 border-white p-2">
                    {task.isDone
                        ? <FontAwesomeIcon icon={faCircleCheck} onClick={reverseDoneStatus}/>
                        : <FontAwesomeIcon icon={faCircle} onClick={reverseDoneStatus}/>
                    }
                </div>
            </th>
            <td className="h-full">
                <div className="border-2 hover:border-gray-300 border-white focus:shadow-2xl h-12 outline-none">
                    <input value={task.title} onInput={(e) => updateTitleStatus(e)}
                           className={`h-full outline-none ${task.isDone ? "line-through decoration-2" : ""}`}
                           onBlur={() => updateData(task)}/>
                </div>
            </td>
        </tr>
    );
};
