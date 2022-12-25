const express = require("express");
const cors = require("cors");

const { v4: uuid } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const repositories = [];

// Middleware
function getRepository(req, res, next) {
  const { id: repositoryId } = req.params;

  const repository = repositories.find(
    (repository) => repository.id === repositoryId
  );
  if (!repository) {
    return res.status(404).json({ error: "Repository not found" });
  }

  req.repository = repository;
  return next();
}

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);
  return res.json(repository);
});

app.put("/repositories/:id", getRepository, (req, res) => {
  const { title, url, techs } = req.body;
  const { repository } = req;

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return res.json(repository);
});

app.delete("/repositories/:id", getRepository, (req, res) => {
  const { repository } = req;
  const { id } = req.params;

  const indexRepos = repositories.findIndex(
    (repository) => repository.id === id
  );
  repositories.splice(indexRepos, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", getRepository, (req, res) => {
  const { repository } = req;

  const likes = ++repository.likes;

  return res.json({ likes });
});

module.exports = app;
