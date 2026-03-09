// Sistema de Chat Interactiva (Bot)
document.addEventListener('DOMContentLoaded', () => {
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatModal = document.getElementById('chat-modal');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');

    if (!chatToggleBtn || !chatModal) return; // Si no hay chat en esta página, salir

    // Abrir/Cerrar Chat
    function toggleChat() {
        chatModal.classList.toggle('hidden');
        if (!chatModal.classList.contains('hidden')) {
            // Foco en input al abrir
            setTimeout(() => chatInput?.focus(), 100);
            scrollToBottom();
        }
    }

    chatToggleBtn.addEventListener('click', toggleChat);
    if (chatCloseBtn) chatCloseBtn.addEventListener('click', toggleChat);

    // Enviar Mensaje
    function sendMessage() {
        const message = chatInput.value.trim().substring(0, 200);
        if (!message) return;

        // Mostrar mensaje usuario
        appendMessage('user', message);
        chatInput.value = '';

        // Simular respuesta del bot
        showTypingIndicator();
        
        setTimeout(() => {
            removeTypingIndicator();
            const response = getBotResponse(message);
            appendMessage('bot', response);
        }, 1500);
    }

    if (chatSendBtn) chatSendBtn.addEventListener('click', sendMessage);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // Funciones auxiliares
    function appendMessage(sender, text) {
        const div = document.createElement('div');
        div.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
        
        const bubble = document.createElement('div');
        bubble.className = `max-w-[80%] p-3 rounded-lg ${
            sender === 'user' 
                ? 'bg-accent text-white rounded-br-none' 
                : 'bg-border text-foreground rounded-bl-none'
        }`;
        bubble.textContent = text;
        
        div.appendChild(bubble);
        chatMessages.appendChild(div);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const div = document.createElement('div');
        div.id = 'typing-indicator';
        div.className = 'flex justify-start';
        div.innerHTML = `
            <div class="bg-border text-foreground p-3 rounded-lg rounded-bl-none flex gap-1">
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
            </div>
        `;
        chatMessages.appendChild(div);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    // Respuestas básicas simuladas
    function getBotResponse(input) {
        input = input.toLowerCase();
        
        if (input.includes('hola') || input.includes('buenas')) 
            return '¡Hola! Soy el asistente de Status Code 418. ¿En qué puedo ayudarte con tu código hoy?';
        
        if (input.includes('ruby')) 
            return 'Ruby es genial. Recuerda que es un lenguaje orientado a objetos puro. ¿Tienes dudas con la sintaxis?';
        
        if (input.includes('python')) 
            return 'Python es excelente para ciencia de datos y backend. No olvides la indentación.';
            
        if (input.includes('error') || input.includes('bug')) 
            return 'Los bugs son normales. Revisa la consola (F12) y asegúrate de cerrar todas las llaves y paréntesis.';
            
        if (input.includes('gracias')) 
            return '¡De nada! Aquí estoy si necesitas más ayuda. ☕';

        return 'Interesante pregunta. Como soy una IA en entrenamiento, te sugiero revisar la documentación o preguntar en la comunidad.';
    }
});
