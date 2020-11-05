//깃헙에서 붙여넣기,,


const express = require('express');
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://zinoo:scot1015@cluster0.bzrdg.mongodb.net/Cluster0?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const Task = mongoose.model('Task',
  {
    title: String,
    description: String,
    dueDate: String,
  },
);


const app = express()

app.use(express.urlencoded({extended:true}))

app.get('/tasks', async (req, res)=> {
    const tasks = await Task.find()
    res.send(tasks)
})

// tasks/1 => 0번째 task를 가져오는 함수
app.get('/tasks/:id', async (req, res) => {
    const id = await parseInt(req.params.id);
    const task = await tasks[id - 1];
  
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
    const id = req.params.id;
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