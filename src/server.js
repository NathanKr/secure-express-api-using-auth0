console.log("app is loading ...");
const express = require("express");
const morgan = require("morgan");
const { v4: uuidv4 } = require("uuid");

const jwt = require("express-jwt"); // --- security related
const jwksRsa = require("jwks-rsa"); // --- security related
const helmet = require("helmet"); // --- security related

function Todo(id, name) {
  this.id = id;
  this.name = name;
}

let todos = [
  new Todo(uuidv4(), "todo1"),
  new Todo(uuidv4(), "todo2"),
  new Todo(uuidv4(), "todo3"),
];

console.log(todos);

const app = express(),
  PORT = 8080;

app.use(helmet()); // -- what do i get by this ????????

// adding morgan to log HTTP requests
app.use(morgan("combined"));

const AUTH0_DOMAIN = "nynk.auth0.com";
const API_IDENTIFIER = "https://todos";

const jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: `${API_IDENTIFIER}`,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

app.use(jwtCheck); // all route will require jwt

app.get("/todos", (req, res) => {
  res.send(todos);
});

app.get("/todos/:id", (req, res) => {
  const todoFound = todos.find((todo) => todo.id == req.params.id);
  todoFound ? res.send(todoFound) : res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`app is listening on port : ${PORT}`);
});
