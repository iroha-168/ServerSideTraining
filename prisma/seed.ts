import e from "cors"
import { PrismaClient } from "../src/generated/prisma"
import { createHash } from "crypto";

const prisma = new PrismaClient()

async function main() { 
    const encryptSha256 = (str: string) => {
        const hash = createHash('sha256');
        hash.update(str);
        return hash.digest('hex')
    }
    
    const hanako = await prisma.user.create({
        data: 
            {
                name: "花子",
                email: "hanako@example.com",
                password_hash: encryptSha256("password1"),
            },
    })

    const tarou = await prisma.user.create({
        data: 
            {
                name: "太郎",
                email: "tarou@example.com",
                password_hash: encryptSha256("password2"),
            },
    })

    const yamada = await prisma.user.create({
        data: 
            {
                name: "山田",
                email: "yamada@example.com",
                password_hash: encryptSha256("password3"),
            },
    })

    await prisma.blog.createMany({
        data: [
            {
                user_id: hanako.id,
                title: "こんにちは",
                details: "今日は晴れです",
            },
            {
                user_id: hanako.id,
                title: "こんばんは",
                details: "寒い夜ですね",
            },
            {
                user_id: tarou.id,
                title: "おはよう",
                details: "眠い",
            },
            {
                user_id: tarou.id,
                title: "おはよう",
                details: "眠い",
            },
            {
                user_id: yamada.id,
                title: "morning",
                details: "start work",
            },
            {
                user_id: yamada.id,
                title: "hello",
                details: "sleepy",
            },
        ],
    })
}

main().catch(e => {console.error(e)}).finally(() => {prisma.$disconnect})