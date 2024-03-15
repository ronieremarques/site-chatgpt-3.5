const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const OpenAI = require('openai');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const openai = new OpenAI({
  apiKey: "your-tokne-here",
  organization: "id-organization",
  baseURL: `https://api.openai.com/v1`
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Um novo usuário se conectou');

  // Mensagem de boas-vindas do Professor Vitor ao conectar
  const welcomeMessage = "Olá, seja bem-vindo ao chat! Me chamo Professor Vitor. Como posso ajudá-lo hoje?";
  io.emit('chat message', welcomeMessage);

  socket.on('chat message', async (msg) => {
    console.log('Mensagem recebida: ' + msg);

    // Obter o histórico de conversas do socket
    const history = socket.history || [];

    // Enviar a mensagem do usuário para a OpenAI e obter uma resposta
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "Seu nome é Professor Vitor é você está dando aula de robótica para o aluno Roniere Marques, que já sabe muito sobre tecnologia então você pode usar termos mais complexo é não usar interface de bloco para programação." },
          { role: "system", content: `Historico de conversa com o aluno: ${history}` },
          { role: "user", content: msg },
        ],
        model: "gpt-3.5-turbo",
      });

      const response = completion.choices[0].message.content;

      // Adicionar a mensagem do usuário ao histórico
      history.push(`Mensagem do aluno: ${msg}`, `Você respondeu: ${response}`);

      // Enviar a resposta da IA para todos os clientes conectados
      io.emit('chat message', response);

      // Atualizar o histórico de conversas do socket
      socket.history = history;
    } catch (error) {
      console.error('Erro ao enviar mensagem para OpenAI:', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado');
  });
});

server.listen(8080, () => {
  console.log('Servidor escutando na porta 3000');
});
