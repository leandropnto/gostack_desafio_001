const express = require('express');
const server = express();
server.use(express.json());

let projects = [];
let requestCount = 0;

function checkForId(req, res, next) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({ error: 'Id Not found' });
  }

  const project = projects.filter(pj => pj.id == id);

  if (!project || project.length == 0) {
    return res.status(400).send({ error: 'Project not found' });
  }

  return next();
}

function requestsLog(req, res, next) {
  console.log(`Total de requisições: ${++requestCount}`);
  return next();
}

server.use(requestsLog);

server.get('/', (req, res) => {
  res.send('OK')
});

server.post('/projects', (req, res) => {
  const { id, title, tasks } = req.body;
  projects.push({ id, title, tasks });
  return res.json(projects);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkForId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.filter(project => {
    if (project.id == id) {
      project.title = title;
    }
    return project;
  });
  return res.json(project);
});

server.delete('/projects/:id', checkForId, (req, res) => {
  const { id } = req.params;
  projects = projects.filter(project => project.id != id);
  return res.send();
});

server.post('/projects/:id/tasks', checkForId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.filter(project => {
    if (project.id == id) {
      project.tasks.push(title);
    }
    return project;
  });
  return res.json(project);
});

server.listen(3000, () => console.log('servidor online'));