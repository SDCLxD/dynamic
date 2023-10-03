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

app.get('/api/whitelist', (req, res) => {
  const { chave } = req.query;
  
  if (!chave) {
    return res.status(400).json({ message: 'Nenhuma chave fornecida' });
  }

  const query = 'SELECT * FROM whitelist WHERE chave = ?';
  db.query(query, [chave], (error, results) => {
    if (error) throw error;

    if (results.length > 0) {
      res.status(200).json('Whitelist realizada com sucesso');
    } else {
      res.status(403).json({ message: 'Chave não encontrada na whitelist' });
    }
  });
});

app.post('/api/auth', (req, res) => {
  const { rng } = req.body;
  
  if (!rng) {
    return res.status(400).json({ message: 'RNG ausente' });
  }

  const rng_value = rng;
  const modifiedRng = rng_value * 2 + 5;
  console.log('Valor RNG recebido:', rng);
  console.log('Valor RNG modificado:', modifiedRng);

  if (modifiedRng === 25) {
        res.status(200).json({ rgn: modifiedRng });
    } else {
      res.status(403).json({ message: 'Chave não encontrada na whitelist' });
    }
  });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
