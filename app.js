const express = require('express');
const prisma = require('./prisma');

const app = express();
app.use(express.json());

// get all user
app.get('/', async (req, res) => {
  try {
    const TodoData = await prisma.todo.findMany();
    const UserData = await prisma.user.findMany();
    return res.status(200).send({
      message: 'data has been successfully fetched',
      TodoData,
      UserData,
    });
  } catch (er) {
    return res.status(400).send({ message: er.message });
  }
});

// get todos of paticular user
app.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const TodoData = await prisma.todo.findMany({
      where: {
        userId: Number(id),
      },
    });
    return res.status(200).send({
      message: 'data has been successfully fetched',
      TodoData,
    });
  } catch (er) {
    return res.status(400).send({ message: er.message });
  }
});

// add user
app.post('/user', async (req, res) => {
  try {
    const { email, password } = req.body;
    const CheckUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (CheckUser) {
      return res.status(500).send({ message: 'user already exists' });
    }
    await prisma.user.create({
      data: {
        email: email,
        password: password,
      },
    });
    return res
      .status(201)
      .send({ message: 'User has been created sucessfully' });
  } catch (er) {
    return res.status(400).send({ message: er.message });
  }
});

// add todo for particular user
app.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, description } = req.body;
    await prisma.todo.create({
      data: {
        text: title + ' ' + description,
        // isCompleted: fal,
        userId: userId,
      },
    });
    return res
      .status(201)
      .send({ message: 'Todo has been created sucessfully' });
  } catch (er) {
    return res.status(400).send({ message: er.message });
  }
});

app.listen(8080, () => {
  console.log('Server started on port 3000');
});
