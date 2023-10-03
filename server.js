const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: '177.71.141.244',
  user: 'maquinaremota',
  password: 'senha123',
  database: 'sistemawhitelist'
});

db.connect((error) => {
  if (error) throw error;
  console.log('Conectado ao servidor MySQL.');
});

app.get('/api/auth', (req, res) => {
  const { chave, rng } = req.query;
  
  if (!chave) {
    return res.status(400).json({ message: 'Chave ou valor RNG ausente' });
  }

  const rng_value = Math.floor(Math.random() * (2009 - 27 + 1)) + 27;
  const modifiedRng = rng_value + 2
  console.log('Valor RNG recebido:', rng);
  console.log('Valor RNG modificado:', modifiedRng);

  const query = 'SELECT * FROM whitelist WHERE chave = ?';
  db.query(query, [chave], (error, results) => {
    if (error) throw error;

    if (results.length > 0) {
      res.status(200).json({ message: 'Whitelist realizada com sucesso', rgn: rng });
    } else {
      res.status(403).json({ message: 'Chave ou valor RNG inválido' });
    }
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
