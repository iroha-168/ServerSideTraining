import { type Request, type Response } from "express"
import { PrismaClient } from './generated/prisma'
import {createHash} from 'crypto'
import express from 'express'
import cors from 'cors'

const app = express()
const port = 3000
const prisma = new PrismaClient()
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors({
    allowedHeaders: ['X-User-Id'],
}))


// ブログを投稿するためのエンドポイント
app.post('/api/v1/blog/', async(req: Request, res: Response) => {

    console.log(req.headers)
    console.log(req.headers["x-user-id"])

    const {title, details}: {title: string, details: string} = req.body
    const user_id = Number.parseInt(req.headers["x-user-id"] as string)

    await prisma.blog.create({
        data: {
            user_id: user_id,
            title: title,
            details: details,
        },
    })

    res.sendStatus(201)
})

// ブログを削除するAPI
app.delete('/api/v1/blog/:id/', async(req: Request, res: Response) => {

    console.log("before delete")

    await prisma.blog.delete({
        where: {
            id: Number.parseInt(req.params.id as string),
        },
    })

    console.log("after delete")

    res.sendStatus(204)
})

// ブログをブログIDから取得するエンドポイント
app.get('/api/v1/blog/:id/', async(req: Request, res: Response) => {
    const id = req.params.id

    const blog = await prisma.blog.findUnique({
        where: {
            id: Number.parseInt(id as string),
        },
    })

    res.json(blog)
})

// ブログ一覧を取得するAPI
app.get('/api/v1/blogs', async(req: Request, res: Response) => {
    const user_id = req.query.user_id

    if(!user_id) {
        // 自分のブログ一覧を取得してくる
        const user_id = req.headers["x-user-id"]
        const blogs = await prisma.blog.findMany({
            where:{
                user_id: Number.parseInt(user_id as string),
            },
        })
        res.json(blogs)
    } else {
        // 指定されたユーザーのブログ一覧を取得してくる
        console.log(user_id)
        const blogs = await prisma.blog.findMany({
            where:{
                user_id: Number.parseInt(user_id as string),
            },
        })
        res.json(blogs)
    }
})

// コメントを送信するためのAPI
app.post('/api/v1/comment/', async(req: Request, res: Response) => {
    const user_id = req.headers["x-user-id"]
    const {blog_id, comment}: {blog_id: string, comment: string} = req.body

    await prisma.comment.create({
        data: {
            user_id: Number.parseInt(user_id as string),
            blog_id: Number.parseInt(blog_id as string),
            comment: comment,
        }
    })

    res.status(201)
})

// いいねをするAPI
app.post('/api/v1/favorite/', async(req: Request, res: Response) => {
    const user_id = req.headers["x-user-id"]
    const {blog_id}: {blog_id: string} = req.body

    await prisma.like.create({
        data: {
            user_id: Number.parseInt(user_id as string),
            blog_id: Number.parseInt(blog_id as string),
        }
    })
    
    res.status(201)
})

// ユーザーIDに紐づくいいねしたブログを全て取得するAPI
app.get('/api/v1/favorite/blogs', (req: Request, res: Response) => {
    res.json(
        [
            {
                "id":1,
                "title":"こんにちは",
                "created_at":"2025-08-25T12:00:00Z",
                "is_favorite": true,
                "user":{
                    "id": 1,
                    "name":"花子"
                },
            },
            {
                "id":2,
                "title":"おはようございます",
                "created_at":"2025-08-25T12:00:00Z",
                "is_favorite": true,
                "user":{
                    "id": 1,
                    "name":"花子"
                },
            },
            {
                "id":3,
                "title":"おやすみ",
                "created_at":"2025-08-25T12:00:00Z",
                "is_favorite": true,
                "user":{
                    "id": 1,
                    "name":"花子"
                },
            },   
        ]
    )
})

// ユーザーを作成するAPI
app.post('/api/v1/user/', async(req: Request, res: Response) => {
    const {name, email, password}: {name: string, email: string, password: string} = req.body

    const encryptSha256 = (str: string) => {
        const hash = createHash('sha256');
        hash.update(str);
        return hash.digest('hex')
    }

    await prisma.user.create({
        data: {
            name: name,
            email: email,
            password_hash: encryptSha256(password),
        },
    })
    
    res.status(201)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

  