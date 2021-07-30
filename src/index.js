const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

const customers = [];

/**
 * cpf - string
 * name - string
 * id - uuid
 * statement []
 */

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;
  const id = uuidv4();

  const customerAlreadyExists = customers.some(
    (customers) => customers.cpf === cpf
  );

  if (customerAlreadyExists) {
    return response.status(400).json({ error: "Customer already exists!" });
  }
  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });

  return response.status(201).send();
});

app.get("/statement/:cpf", (request, response) => {
  const { cpf } = request.params;

  const customer = customers.find((customer) => customer.cpf === cpf);
  if (!customer) {
    return response
      .status(400)
      .json({ error: "Não foi possível encontrar o cliente" });
  }

  return response.json(customer.statement);
});

const port = 3333;

app.listen(port, console.log(`Servidor iniciado : ${port}`));
