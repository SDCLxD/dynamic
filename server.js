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

app.get('/script/whitelist', (req, res) => {
  const { chave } = req.query;
  
  if (!chave) {
    return res.status(400).json({ message: 'Nenhuma chave fornecida' });
  }

  const query = 'SELECT * FROM whitelist WHERE chave = ?';
  db.query(query, [chave], (error, results) => {
    if (error) throw error;

    if (results.length > 0) {
      res.status(200).json({ message: 'Whitelist realizada com sucesso' });
    } else {
      res.status(403).json({ message: 'Chave não encontrada na whitelist' });
    }
  });
});

app.post('/api/auth', (req, res) => {
  const { rng } = req.body;
  const rng_value = rng;
  const modifiedRng = (rng_value - 6 + 5 * 4 / 3) % 2;
  
  if (!rng) {
    return res.status(400).json({ message: 'RNG ausente' });
  }
  
  console.log('Valor RNG recebido:', rng);
  console.log('Valor RNG modificado:', modifiedRng);

  if (modifiedRng === 1.6666666666860692 ) {
      res.status(200).json({ rng: modifiedRng });
    } else {
      res.status(403).json({ message: 'Trying to crack?' });
    }
  });

app.post('/rc/snd', (req, res) => {
  const { key, hwid, i } = req.body;
  const key = key;
  const hwid = hwid;
  const ip = i
  const { chave } = req.query
  
  if (!key || !hwid || !ip) {
    return res.status(400).json({ message: 'Something went wrong.' });
  }
  
  console.log('Chave recebida:', key);
  console.log('Hwid recebido:', hwid);
  console.log('Ip recebido:', ip);

  if (modifiedRng === 1.6666666666860692 ) {
      res.status(200).json({ rng: modifiedRng });
    } else {
      res.status(403).json({ message: 'Trying to crack?' });
    }
  });
const query = 'SELECT * FROM whitelist WHERE chave = ?';
  db.query(query, [chave], (error, results) => {
    if (error) throw error;

    if (results.length > 0) {
      res.status(200).json({ message: 'i found' });
    } else {
      res.status(403).json({ message: 'not found' });
    }
  });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
