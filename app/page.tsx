"use server"

import {Tasks} from "@/app/components/tasks";

export type createTaskType = {
    title: string
}
export type updateTaskType = {
    id: string,
    title: string
    isDone: boolean
}

export default async function Home() {
    const res = await fetch(`${process.env.API_URL}/api/tasks`, {cache: "no-cache"});
    const jsonRes = await res.json()


    return (
        <Tasks initialTasks={jsonRes}/>
    );
}
