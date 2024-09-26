"use server"

import {Task} from "@/app/components/task";
import {faChevronUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ulid} from "ulid";
import { Prisma, Todo } from '@prisma/client';

import {Tasks} from "@/app/components/tasks";
import {json} from "node:stream/consumers";

export type createTaskType = {
    title:string
}
export type updateTaskType = {
    id:string,
    title:string
    isDone:boolean
}

export default async function Home() {
    const res = await fetch("http://localhost:3000/api/tasks",{cache:"no-cache"});
    const jsonRes = await res.json()


    return (
        <Tasks initialTasks={jsonRes} />
    );
}
