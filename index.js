const express = require('express');

const server = express();

server.use(express.json());

let totalRequests = 0;
const projects = [];

// Middleware Global
server.use((req, res, next) => {
  totalRequests++;
  console.log(`Número de requisições: ${totalRequests}`);
  return next();
})

// Middleware Route
function checkProjectInArray(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found'});
  }

  return next();
}

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({
    id,
    title,
    tasks: []
  });

  return res.json(projects);
})

server.get('/projects', (req, res) => {
  return res.json(projects);
})

server.put('/projects/:id', checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(projects);
})

server.delete('/projects/:id', checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
})

server.post('/projects/:id/tasks', checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
})

server.listen(3000);