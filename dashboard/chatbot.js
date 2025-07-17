// Chatbot functionality
class BankingChatbot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.chatForm = document.getElementById('chatForm');
        this.chatToggle = document.getElementById('chatToggle');
        this.chatBadge = document.getElementById('chatBadge');
        
        this.conversationHistory = [];
        this.isTyping = false;
        
        this.initializeChat();
        this.setupEventListeners();
        this.populateInitialTime();
    }
    
    initializeChat() {
        // Initialize welcome message
        this.conversationHistory.push({
            type: 'bot',
            message: '¡Hola! Soy tu asistente virtual de Banco Acme. ¿En qué puedo ayudarte hoy?',
            timestamp: new Date()
        });
    }
    
    setupEventListeners() {
        // Chat form submission
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleUserMessage();
        });
        
        // Enter key handling
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleUserMessage();
            }
        });
        
        // Auto-resize input
        this.messageInput.addEventListener('input', () => {
            this.adjustInputHeight();
        });
    }
    
    populateInitialTime() {
        const initialTimeElement = document.getElementById('initialTime');
        if (initialTimeElement) {
            initialTimeElement.textContent = this.formatTime(new Date());
        }
    }
    
    handleUserMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;
        
        // Add user message
        this.addMessage('user', message);
        this.messageInput.value = '';
        
        // Show typing indicator and process response
        this.showTypingIndicator();
        setTimeout(() => {
            this.processUserMessage(message);
        }, 1000 + Math.random() * 1000); // Random delay for realism
    }
    
    addMessage(type, message, showTime = true) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}-message`;
        
        const timestamp = new Date();
        
        messageElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${type === 'bot' ? 'fa-robot' : 'fa-user'}"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
                ${showTime ? `<div class="message-time">
                    <span>${this.formatTime(timestamp)}</span>
                </div>` : ''}
            </div>
        `;
        
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
        
        // Add to conversation history
        this.conversationHistory.push({
            type,
            message,
            timestamp
        });
        
        // Update badge
        this.updateChatBadge();
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        const typingElement = document.createElement('div');
        typingElement.className = 'message bot-message typing-indicator';
        typingElement.id = 'typingIndicator';
        
        typingElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>Escribiendo...</p>
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(typingElement);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const typingElement = document.getElementById('typingIndicator');
        if (typingElement) {
            typingElement.remove();
        }
        this.isTyping = false;
    }
    
    processUserMessage(message) {
        this.hideTypingIndicator();
        
        const response = this.generateResponse(message.toLowerCase());
        this.addMessage('bot', response);
    }
    
    generateResponse(message) {
        // Banking-specific responses
        const responses = {
            // Greeting responses
            greeting: [
                'hola', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos'
            ],
            
            // Account balance queries
            balance: [
                'saldo', 'balance', 'dinero', 'cuenta', 'cuánto tengo', 'disponible'
            ],
            
            // Transfer queries
            transfer: [
                'transferencia', 'enviar dinero', 'transferir', 'envío', 'mandar dinero'
            ],
            
            // Service hours
            hours: [
                'horario', 'hora', 'atención', 'servicio', 'abierto', 'cerrado'
            ],
            
            // Certificates
            certificate: [
                'certificado', 'constancia', 'documento', 'comprobante'
            ],
            
            // Services
            services: [
                'servicio', 'producto', 'oferta', 'qué pueden', 'opciones'
            ],
            
            // Support
            support: [
                'ayuda', 'soporte', 'problema', 'contacto', 'asistencia'
            ],
            
            // Cards
            cards: [
                'tarjeta', 'débito', 'crédito', 'plástico'
            ],
            
            // Loans
            loans: [
                'préstamo', 'crédito', 'financiamiento', 'solicitar dinero'
            ],
            
            // Payments
            payments: [
                'pago', 'pagar', 'factura', 'servicio público'
            ],
            
            // Security
            security: [
                'seguridad', 'clave', 'contraseña', 'bloquear', 'desbloquear'
            ]
        };
        
        // Check for greeting
        if (responses.greeting.some(word => message.includes(word))) {
            return this.getRandomResponse([
                '¡Hola! ¿En qué puedo ayudarte con tus servicios bancarios?',
                '¡Buenos días! Estoy aquí para asistirte con cualquier consulta bancaria.',
                '¡Hola! Soy tu asistente virtual de Banco Acme. ¿Qué necesitas?'
            ]);
        }
        
        // Check for balance queries
        if (responses.balance.some(word => message.includes(word))) {
            return 'Para consultar tu saldo actual, puedes:\n\n• Ingresar al sistema con tus credenciales\n• Usar la sección "Resumen de Cuenta" en el dashboard\n• Llamar a nuestra línea de atención al cliente\n\n¿Necesitas ayuda para acceder a tu cuenta?';
        }
        
        // Check for transfer queries
        if (responses.transfer.some(word => message.includes(word))) {
            return 'Para realizar transferencias puedes:\n\n• Usar la opción "Consignación Electrónica" en el dashboard\n• Transferir entre cuentas propias\n• Enviar dinero a otras cuentas del mismo banco\n\nRecuerda que necesitas:\n✓ Número de cuenta destino\n✓ Cédula del beneficiario\n✓ Saldo suficiente en tu cuenta\n\n¿Te gustaría que te guíe paso a paso?';
        }
        
        // Check for service hours
        if (responses.hours.some(word => message.includes(word))) {
            return 'Nuestros horarios de atención son:\n\n🏦 **Sucursales físicas:**\nLunes a Viernes: 8:00 AM - 4:00 PM\nSábados: 8:00 AM - 12:00 PM\n\n💻 **Banca en línea:**\nDisponible 24/7\n\n📞 **Línea de atención:**\nLunes a Domingo: 24 horas\nTeléfono: 018000-123456\n\n¿Necesitas direcciones de nuestras sucursales?';
        }
        
        // Check for certificates
        if (responses.certificate.some(word => message.includes(word))) {
            return 'Puedes solicitar los siguientes certificados:\n\n📋 **Certificados disponibles:**\n• Certificado de cuenta corriente/ahorros\n• Certificado de ingresos y retenciones\n• Certificado de movimientos de cuenta\n• Paz y salvo\n\n📝 **Proceso:**\n1. Accede a "Certificado Bancario" en el dashboard\n2. Selecciona el tipo de certificado\n3. Completa la información requerida\n4. Descarga tu certificado en PDF\n\n¿Qué tipo de certificado necesitas?';
        }
        
        // Check for services
        if (responses.services.some(word => message.includes(word))) {
            return 'Ofrecemos los siguientes servicios:\n\n💳 **Productos:**\n• Cuentas de ahorro y corriente\n• Tarjetas débito y crédito\n• Préstamos personales e hipotecarios\n• CDT (Certificados de Depósito a Término)\n\n💻 **Servicios digitales:**\n• Banca en línea\n• Transferencias electrónicas\n• Pago de servicios públicos\n• Consulta de movimientos\n\n🏦 **Servicios adicionales:**\n• Giros y remesas\n• Cambio de divisas\n• Cajas de seguridad\n\n¿Te interesa información específica sobre algún servicio?';
        }
        
        // Check for support
        if (responses.support.some(word => message.includes(word))) {
            return 'Estoy aquí para ayudarte. Puedes contactar nuestro soporte:\n\n📞 **Línea de atención:**\n• Teléfono: 018000-123456\n• WhatsApp: +57 300 123 4567\n• Disponible 24/7\n\n📧 **Email:**\n• soporte@bancoacme.com\n• Respuesta en 24 horas\n\n🏦 **Presencial:**\n• Visita cualquiera de nuestras sucursales\n• Lleva tu documento de identidad\n\n💬 **Chat:**\n• Este asistente virtual\n• Disponible siempre\n\n¿En qué específicamente puedo ayudarte?';
        }
        
        // Check for cards
        if (responses.cards.some(word => message.includes(word))) {
            return 'Información sobre tarjetas:\n\n💳 **Tarjetas de débito:**\n• Vinculada a tu cuenta de ahorros\n• Sin cuota de manejo\n• Retiros en cajeros propios gratis\n\n💳 **Tarjetas de crédito:**\n• Diferentes tipos según tu perfil\n• Cupos desde $500.000\n• Programa de puntos y beneficios\n\n🔒 **Seguridad:**\n• Chip y clave\n• Notificaciones por SMS\n• Bloqueo inmediato disponible\n\n¿Qué información específica necesitas sobre las tarjetas?';
        }
        
        // Check for loans
        if (responses.loans.some(word => message.includes(word))) {
            return 'Opciones de crédito disponibles:\n\n💰 **Préstamos personales:**\n• Hasta $50.000.000\n• Tasas desde 1.2% mensual\n• Plazos hasta 60 meses\n\n🏠 **Crédito hipotecario:**\n• Hasta 80% del valor del inmueble\n• Plazos hasta 20 años\n• Tasas preferenciales\n\n🚗 **Crédito vehicular:**\n• Carros nuevos y usados\n• Tasas especiales\n• Plazos hasta 60 meses\n\n📋 **Requisitos generales:**\n• Cédula de ciudadanía\n• Comprobante de ingresos\n• Referencias comerciales\n\n¿Te interesa algún tipo de crédito específico?';
        }
        
        // Check for payments
        if (responses.payments.some(word => message.includes(word))) {
            return 'Puedes pagar servicios públicos de forma fácil:\n\n⚡ **Servicios disponibles:**\n• Energía eléctrica\n• Agua y alcantarillado\n• Gas natural\n• Internet y telefonía\n\n💻 **Cómo pagar:**\n1. Ve a "Pago de Servicios" en el dashboard\n2. Selecciona el tipo de servicio\n3. Ingresa la referencia de pago\n4. Confirma el valor\n5. Autoriza la transacción\n\n💡 **Ventajas:**\n• Sin salir de casa\n• Disponible 24/7\n• Confirmación inmediata\n• Historial de pagos\n\n¿Necesitas ayuda con algún pago específico?';
        }
        
        // Check for security
        if (responses.security.some(word => message.includes(word))) {
            return 'Información de seguridad:\n\n🔐 **Contraseñas:**\n• Cambia tu clave periódicamente\n• Usa combinación de letras, números y símbolos\n• No compartas tus credenciales\n\n🛡️ **Protección:**\n• Nunca ingreses datos en links sospechosos\n• Verifica siempre la URL del banco\n• Cierra sesión después de usar\n\n📱 **En caso de problemas:**\n• Bloquea tu cuenta inmediatamente\n• Llama a: 018000-123456\n• Reporta transacciones no autorizadas\n\n🚨 **Emergencias:**\n• Línea disponible 24/7\n• Bloqueo inmediato de productos\n• Soporte especializado\n\n¿Tienes alguna preocupación específica de seguridad?';
        }
        
        // Check for thanks
        if (message.includes('gracias') || message.includes('muchas gracias')) {
            return this.getRandomResponse([
                '¡De nada! Estoy aquí para ayudarte cuando lo necesites.',
                'Es un placer ayudarte. ¿Hay algo más en lo que pueda asistirte?',
                '¡Con gusto! Para eso estoy aquí. ¿Necesitas algo más?'
            ]);
        }
        
        // Check for goodbye
        if (message.includes('adiós') || message.includes('chao') || message.includes('hasta luego')) {
            return this.getRandomResponse([
                '¡Hasta luego! Que tengas un excelente día.',
                'Nos vemos pronto. ¡Gracias por usar Banco Acme!',
                '¡Adiós! Recuerda que estoy aquí 24/7 para ayudarte.'
            ]);
        }
        
        // Default response for unrecognized queries
        return 'No estoy seguro de haber entendido tu consulta. Puedo ayudarte con:\n\n• Información sobre saldos y cuentas\n• Transferencias y pagos\n• Servicios bancarios\n• Horarios de atención\n• Certificados y documentos\n• Tarjetas y créditos\n• Soporte técnico\n\n¿Podrías ser más específico sobre lo que necesitas? O puedes usar los botones de consultas frecuentes arriba.';
    }
    
    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    adjustInputHeight() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = this.messageInput.scrollHeight + 'px';
    }
    
    formatTime(date) {
        return date.toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    updateChatBadge() {
        const unreadMessages = this.conversationHistory.filter(msg => msg.type === 'bot').length;
        this.chatBadge.textContent = unreadMessages;
    }
}

// Quick message functionality
function sendQuickMessage(message) {
    const chatbot = window.bankingChatbot;
    if (chatbot) {
        chatbot.messageInput.value = message;
        chatbot.handleUserMessage();
    }
}

// Chat reset functionality
function resetChat() {
    const chatMessages = document.getElementById('chatMessages');
    
    // Clear all messages except the initial welcome
    chatMessages.innerHTML = `
        <div class="message bot-message">
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>¡Hola! Soy tu asistente virtual de Banco Acme. ¿En qué puedo ayudarte hoy?</p>
                <div class="message-time">
                    <span>${new Date().toLocaleTimeString('es-CO', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</span>
                </div>
            </div>
        </div>
    `;
    
    // Reset conversation history
    window.bankingChatbot.conversationHistory = [{
        type: 'bot',
        message: '¡Hola! Soy tu asistente virtual de Banco Acme. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date()
    }];
    
    // Reset badge
    window.bankingChatbot.updateChatBadge();
    
    // Clear input
    window.bankingChatbot.messageInput.value = '';
}

// Toggle chat visibility (for integration with dashboard)
function toggleChat() {
    const chatModal = document.getElementById('chatModal');
    const chatToggle = document.getElementById('chatToggle');
    
    if (chatModal && chatToggle) {
        if (chatModal.classList.contains('active')) {
            chatModal.classList.remove('active');
            chatToggle.style.display = 'flex';
        } else {
            chatModal.classList.add('active');
            chatToggle.style.display = 'none';
            // Focus on input when opening chat
            setTimeout(() => {
                const messageInput = document.getElementById('messageInput');
                if (messageInput) {
                    messageInput.focus();
                }
            }, 300);
        }
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (!window.bankingChatbot) {
        window.bankingChatbot = new BankingChatbot();
    }
});
