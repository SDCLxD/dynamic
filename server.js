const express = require('express');
const axios = require('axios');
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
  const chave1 = key;
  const hwid1 = hwid;
  const ip = i;
  const { chave } = req.query;
  
  if (!chave1 || !hwid1 || !ip) {
    return res.status(400).json({ message: 'Something went wrong.' });
  }
  
  console.log('Chave recebida:', chave1);
  console.log('Hwid recebido:', hwid1);
  console.log('Ip recebido:', ip);

    const query = 'SELECT * FROM whitelist WHERE chave = ?';
    db.query(query, [chave1], (error, results) => {
        if (error) throw error;
    
        if (results.length > 0) {
        const user = results[0];
        if (user.hwid === null) {
          const updateQuery = 'UPDATE whitelist SET hwid = ? WHERE chave = ?';
          db.query(updateQuery, [hwid1, chave1], (updateError, updateResults) => {
            if (updateError) throw updateError;
              console.log('HWID atualizado para:', hwid1);
          });
        }
        res.status(200).json({ message: 'User found!', chave: chave1, hwid: hwid1, ip: ip });
          axios.post('https://discord.com/api/webhooks/1157706080147742721/mVlEtHDP2NPjkBa6zJSRXVvVO_FR6QJ5f_u1FwblNGcWkQevTdP2lsIIHJe9CCAX7csH', { content: key, hwid, i })
            .then(response => {
              res.send('Resposta enviada via webhook!');
            })
            .catch(error => {
          console.error('Erro ao enviar resposta via webhook:', error);
        res.status(500).send('Erro ao enviar resposta via webhook');
      });
      } else {
        res.status(403).json({ message: 'User not found.' });
      }
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
