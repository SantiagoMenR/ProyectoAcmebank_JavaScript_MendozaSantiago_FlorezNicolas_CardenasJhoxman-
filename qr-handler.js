// QR Code Handler
class QRHandler {
    constructor() {
        this.qrCanvas = null;
        this.qrData = null;
    }

    // Generate QR code for the current user
    static generateQR() {
        if (!currentUser) {
            console.error('No user logged in');
            return;
        }

        const qrData = {
            type: 'banco_acme_account',
            accountNumber: currentUser.accountNumber,
            accountName: currentUser.name,
            timestamp: new Date().toISOString()
        };

        const qrString = JSON.stringify(qrData);
        const canvas = document.getElementById('qrCanvas');
        
        if (!canvas) {
            console.error('QR Canvas not found');
            return;
        }

        // Clear previous QR code
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Generate new QR code
        QRCode.toCanvas(canvas, qrString, {
            width: 256,
            height: 256,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        }, function(error) {
            if (error) {
                console.error('Error generating QR code:', error);
                showNotification('Error al generar código QR', 'error');
            } else {
                console.log('QR code generated successfully');
                showNotification('Código QR generado exitosamente', 'success');
            }
        });
    }

    // Validate QR code data
    static validateQRData(qrString) {
        try {
            const data = JSON.parse(qrString);
            
            // Check if it's a valid Banco Acme QR code
            if (data.type !== 'banco_acme_account') {
                return { valid: false, error: 'Código QR no válido para Banco Acme' };
            }
            
            // Check required fields
            if (!data.accountNumber || !data.accountName) {
                return { valid: false, error: 'Código QR incompleto' };
            }
            
            // Check if account exists
            const account = DataManager.getUser(data.accountNumber);
            if (!account) {
                return { valid: false, error: 'Cuenta no encontrada' };
            }
            
            // Check if account name matches
            if (account.name !== data.accountName) {
                return { valid: false, error: 'Información de cuenta no coincide' };
            }
            
            return { valid: true, data: data };
            
        } catch (error) {
            return { valid: false, error: 'Formato de código QR inválido' };
        }
    }

    // Process QR payment
    static processQRPayment(recipientData, amount, concept) {
        if (!currentUser) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        if (amount <= 0) {
            return { success: false, error: 'Monto debe ser mayor a 0' };
        }

        if (amount > currentUser.balance) {
            return { success: false, error: 'Saldo insuficiente' };
        }

        if (recipientData.accountNumber === currentUser.accountNumber) {
            return { success: false, error: 'No puedes enviarte dinero a ti mismo' };
        }

        // Create transaction for sender
        const senderTransaction = {
            type: 'Transferencia QR',
            concept: `Pago QR: ${concept} - A: ${recipientData.accountName}`,
            amount: -amount,
            reference: `QR-${Date.now()}`,
            recipientAccount: recipientData.accountNumber
        };

        // Create transaction for recipient
        const recipientTransaction = {
            type: 'Transferencia QR',
            concept: `Pago QR recibido: ${concept} - De: ${currentUser.name}`,
            amount: amount,
            reference: `QR-${Date.now()}`,
            senderAccount: currentUser.accountNumber
        };

        // Process transactions
        const senderSuccess = DataManager.addTransaction(currentUser.accountNumber, senderTransaction);
        const recipientSuccess = DataManager.addTransaction(recipientData.accountNumber, recipientTransaction);

        if (senderSuccess && recipientSuccess) {
            // Update sender balance
            currentUser.balance -= amount;
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Update recipient balance
            const recipient = DataManager.getUser(recipientData.accountNumber);
            if (recipient) {
                recipient.balance += amount;
                DataManager.updateUser(recipient);
            }

            return { success: true, message: 'Pago realizado exitosamente' };
        } else {
            return { success: false, error: 'Error al procesar el pago' };
        }
    }

    // Get QR payment history
    static getQRPaymentHistory(accountNumber) {
        const transactions = DataManager.getTransactions(accountNumber);
        return transactions.filter(t => t.type === 'Transferencia QR');
    }

    // Generate payment QR with amount
    static generatePaymentQR(amount, concept) {
        if (!currentUser) {
            console.error('No user logged in');
            return;
        }

        const qrData = {
            type: 'banco_acme_payment',
            accountNumber: currentUser.accountNumber,
            accountName: currentUser.name,
            amount: amount,
            concept: concept,
            timestamp: new Date().toISOString()
        };

        const qrString = JSON.stringify(qrData);
        
        return new Promise((resolve, reject) => {
            QRCode.toDataURL(qrString, {
                width: 256,
                height: 256,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            }, function(error, url) {
                if (error) {
                    reject(error);
                } else {
                    resolve(url);
                }
            });
        });
    }
}

// Global function to generate QR (called from HTML)
function generateQR() {
    QRHandler.generateQR();
}

// Global function to handle QR scan result
function handleQRScanResult(decodedText) {
    const validation = QRHandler.validateQRData(decodedText);
    
    if (validation.valid) {
        // Show payment form with recipient info
        document.getElementById('recipientAccount').textContent = validation.data.accountNumber;
        document.getElementById('recipientName').textContent = validation.data.accountName;
        document.getElementById('payment-form').classList.remove('hidden');
        
        // Stop scanner
        if (typeof stopQRScanner === 'function') {
            stopQRScanner();
        }
        
        showNotification('Código QR válido. Ingresa el monto a pagar.', 'success');
    } else {
        showNotification(validation.error, 'error');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QRHandler;
}
