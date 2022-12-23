import "dotenv/config";
import express from 'express';
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

//get posts
app.get("/posts", async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    res.json({ posts })
  } catch (err: any) {
    next(err.message);
  }
});

//add post
app.post("/posts", async (req, res, next) => {
  try {
    const post = await prisma.post.create({
      data: {
        authorId: 2, ...req.body
      }
    });

    res.json({ post });
  } catch (err: any) {
    next(err.message);
  }
});

//get post by id
app.get("/posts/:id", async (req, res, next) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: Number(req.params.id) } })
    res.json({ post });
  } catch (err: any) {
    next(err.message);
  }
});

//get user's posts
app.get("/users/:id/posts", async (req, res, next) => {
  try {
    const userWithPosts = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        posts: {
          where: {
            published: true
          }
        }
      }
    })
    const posts = userWithPosts?.posts;
    res.json({ posts });
  } catch (err: any) {
    next(err.message);
  }
});

//update post
app.patch("/posts/:id", async (req, res, next) => {
  try {
    const post = await prisma.post.update({
      where: {
        id: Number(req.params.id)
      },
      data: {
        ...req.body
      }
    })

    res.json({ post });
  } catch (err: any) {
    next(err.message);
  }
});

//delete post
app.delete("/posts/:id", async (req, res, next) => {
  try {
    await prisma.post.delete({
      where: {
        id: Number(req.params.id)
      }
    })
    res.send({ message: `Post with id of ${req.params.id} deleted.` })
  } catch (err: any) {
    next(err.message);
  }
});

