import {TaskType} from "@/app/page";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle, faCircleCheck} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";

export const Task = ({initialTask, updateTaskList}: {
    initialTask: TaskType,
    updateTaskList: (task: TaskType) => void
}) => {
    const [task, setTask] = useState<TaskType>(initialTask);

    const reverseStatus = () => {
        setTask(prevTask => ({
            ...prevTask,
            isDone: !prevTask.isDone
        }));
    };

    const updateTitle = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        setTask(prevTask => ({
            ...prevTask,
            title: input.value
        }));
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
                        ? <FontAwesomeIcon icon={faCircleCheck} onClick={reverseStatus}/>
                        : <FontAwesomeIcon icon={faCircle} onClick={reverseStatus}/>
                    }
                </div>
            </th>
            <td className="h-full">
                <div className="border-2 hover:border-gray-300 border-white focus:shadow-2xl h-12 outline-none">
                    <input value={task.title} onInput={(e) => updateTitle(e)}
                           className={`h-full outline-none ${task.isDone ? "line-through decoration-2" : ""}`}/>
                </div>
            </td>
        </tr>
    );
};
