import { type Request, type Response } from "express"

const express = require('express')
const app = express()
const port = 3000


// ブログを投稿するためのエンドポイント
app.post('/api/v1/blog/', (req: Request, res: Response) => {
    res.sendStatus(201)
})

// ブログを削除するAPI
app.delete('/api/v1/blog/:id/', (req: Request, res: Response) => {
    res.status(204)
})

// ブログをブログIDから取得するエンドポイント
app.get('/api/v1/blog/:id/', (req: Request, res: Response) => {
    res.json({
        "title":"きょうのできごと",
        "details":"今日は............でした",
        "created_at":"2025-08-25T12:00:00Z",
        "is_favorite":true, 
        "user":{ 
            "id": 1,
            "name":"花子"
        },
        "comments":[
            {
                "id":1,
                "comment":"カスブログやなあ",
                "user":{
                    "id": 1,
                    "name":"花子"
                }
            },
            {
                "id":2,
                "comment":"良いブログでした",
                "user":{
                    "id": 2,
                    "name":"太郎"
                }
            },
            {
                "id":3,
                "comment":"まあまあですね",
                "user":{
                    "id": 3,
                    "name":"山田"
                }
            },
        ]
    })
})

// ブログ一覧を取得するAPI
app.get('/api/v1/blogs', (req: Request, res: Response) => {
    // TODO: 後でis_favoriteの値を動的に決定する時に使う
    const {user_id} = req.query
    // TODO: 誰が花子のブログをいいねしているかを取得するために、AuthorizationHeaderの中身を見てゴニョゴニョする必要あり

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

// コメントを送信するためのAPI
app.post('/api/v1/comment/', (req: Request, res: Response) => {
    res.status(201)
})

// いいねをするAPI
app.post('/api/v1/favorite/', (req: Request, res: Response) => {
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

  