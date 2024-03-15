const socket = io();

const form = document.querySelector('form');
const input = document.querySelector('#input');
const messages = document.querySelector('#messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    const userMessage = input.value;
    const userMessageElement = document.createElement('li');
    userMessageElement.className = 'message user-message';
    userMessageElement.innerHTML = `Roniere: ${userMessage}`;
    messages.appendChild(userMessageElement);
    
    socket.emit('chat message', userMessage);
    input.value = '';
  }
});

socket.on('chat message', (msg) => {
  const botMessageElement = document.createElement('li');
  botMessageElement.className = 'message bot-message';
  botMessageElement.innerHTML = `Professor Vitor: ${msg}`;
  messages.appendChild(botMessageElement);

  // Scroll down para exibir a última mensagem
  messages.scrollTop = messages.scrollHeight;

  // Remover a animação de digitação quando a resposta da IA chega
  const typingAnimations = document.querySelectorAll('.typing-animation');
  typingAnimations.forEach(animation => animation.remove());
});
