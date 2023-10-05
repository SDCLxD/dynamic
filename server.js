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
  const { key, hwid, i, userId, username, exploit } = req.body;
  const chave1 = key;
  const hwid1 = hwid;
  const ip = i;
  const user = userId;
  const name = username;
  const executor = exploit;
  const { chave } = req.query;
  
  if (!chave1 || !hwid1 || !ip || !user || !name || !executor) {
    return res.status(400).json({ message: 'Something went wrong.' });
  }

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

    const userID = user.userid;
    console.log('UserID recebido:', userID);
    console.log('Chave recebida:', chave1);
    console.log('Hwid recebido:', hwid1);
    console.log('Ip recebido:', ip);
    console.log('Username roblox:', name);
    console.log('Exploit usado:', executor);
    }
  });

  const embed = {
    title: 'Execution detected!',
    color: 0x9932CC, // Cor roxa em hexadecimal
    fields: [
      { name: 'UserID', value: userId },
      { name: 'HWID', value: hwid1 },
      { name: 'CHAVE', value: chave1 },
      { name: 'IPV4', value: ip },
      { name: 'Horário da execução', value: new Date().toLocaleString() },
      { name: 'Username do Roblox', value: username },
      { name: 'Exploit usado', value: exploit }
    ]
  };

  axios.post('https://discord.com/api/webhooks/WEBHOOK_ID/TOKEN', { embeds: [embed] })
    .then(response => {
      console.log('Resposta enviada via webhook:', response.data);
    })
    .catch(error => {
      console.error('Erro ao enviar resposta via webhook:', error);
    });

  res.status(200).json({ message: 'User found!', chave: chave1, hwid: hwid1, ip: ip });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
