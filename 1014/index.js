const express = require('express');
const app = express();
const tasks = [];

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.get('/tasks', (req, res) => {
  res.send(JSON.stringify(tasks));
});


// tasks/1 => 0번째 task를 가져오는 함수
app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks[id - 1];

  if (!task) {
    return(res.sendStatus(404));
  }

  res.send(task);
});


// title, description, dueDate
app.post('/tasks', (req, res) => {
  const { title, description, dueDate } = req.body;
  const task = { title, description, dueDate };
  tasks.push(task);

  res.send(task);
});

// ?author=kim&page=1
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, dueDate} = req.body;
  const task = {title, description, dueDate };
  if (!task) {
      return res.sendStatus(404);
  }

  tasks[id - 1] = task;
  task.title = title;
  task.description = description;
  task.dueDate = dueDate;
  res.send(task);
});

app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks[id - 1];
    if(!task) {
        return res.sendStatus(404)};

    tasks.splice(id - 1, 1);
    res.send(task)
});

app.listen(3000);
