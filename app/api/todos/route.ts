import {NextRequest, NextResponse} from 'next/server';
import {ulid} from "ulid";
import {prisma} from "@/prisma";

export async function GET() {
    const res = await prisma.todo.findMany()
    return NextResponse.json(res)
}

export async function POST(req: NextRequest) {
    const data = await req.json()
    const res = await prisma.todo.create({
        data: {
            id: ulid(),
            isDone: false,
            title: data.title
        }
    })
    return NextResponse.json(res)
}

export async function PUT(req: NextRequest) {
    const data = await req.json()
    const res = await prisma.todo.update({
        where: {
            id: data.id,
        },
        data: {
            title: data.title,
            isDone: data.isDone
        }
    })
    return NextResponse.json(res)
}

