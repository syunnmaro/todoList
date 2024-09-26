import {NextRequest, NextResponse} from 'next/server';
import { Prisma, Todo } from '@prisma/client';
import { PrismaClient } from '@prisma/client'
import {ulid} from "ulid";
import {prisma} from "@/prisma";

export async function GET() {
    const res = await prisma.todo.findMany()
    return  NextResponse.json(res)
}

export async function POST(req:NextRequest,) {
    const data = await req.json()
    const res = await prisma.todo.create({
        data:{
            id:ulid(),
            isDone:false,
            title: data.title
        }
    })
    console.log(res)
    return  NextResponse.json("success")
}

export async function PUT(req:NextRequest,) {
    const data = await req.json()
    console.log(data)
    const res = await prisma.todo.update({
        where:{
            id:data.id,
        },
        data:{
            title:data.title,
            isDone:data.isDone
        }
    })
    console.log(res)
    return  NextResponse.json("success")
}

