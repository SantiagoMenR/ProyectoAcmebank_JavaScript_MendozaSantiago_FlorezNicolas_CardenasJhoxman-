// Data Storage and Management
class BankingSystem {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        // Initialize users array if not exists
        if (!localStorage.getItem('bankUsers')) {
            localStorage.setItem('bankUsers', JSON.stringify([]));
        }
        
        // Initialize transactions array if not exists
        if (!localStorage.getItem('bankTransactions')) {
            localStorage.setItem('bankTransactions', JSON.stringify([]));
        }
        
        // Initialize current user session
        if (!localStorage.getItem('currentUser')) {
            localStorage.setItem('currentUser', JSON.stringify(null));
        }
    }

    // User Management
    createUser(userData) {
        const users = JSON.parse(localStorage.getItem('bankUsers'));
        
        // Check if user already exists
        const existingUser = users.find(user => 
            user.idType === userData.idType && user.idNumber === userData.idNumber
        );
        
        if (existingUser) {
            throw new Error('Ya existe un usuario con este número de identificación');
        }

        // Generate account number
        const accountNumber = this.generateAccountNumber();
        
        // Create new user
        const newUser = {
            ...userData,
            accountNumber: accountNumber,
            balance: 0,
            creationDate: new Date().toISOString(),
            id: Date.now()
        };

        users.push(newUser);
        localStorage.setItem('bankUsers', JSON.stringify(users));
        
        return newUser;
    }

    authenticateUser(idType, idNumber, password) {
        const users = JSON.parse(localStorage.getItem('bankUsers'));
        const user = users.find(u => 
            u.idType === idType && 
            u.idNumber === idNumber && 
            u.password === password
        );
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        }
        
        return null;
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    logoutUser() {
        localStorage.setItem('currentUser', JSON.stringify(null));
    }

    // Account Management
    generateAccountNumber() {
        return '4001' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    }

    updateUserBalance(userId, newBalance) {
        const users = JSON.parse(localStorage.getItem('bankUsers'));
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex].balance = newBalance;
            localStorage.setItem('bankUsers', JSON.stringify(users));
            
            // Update current user session
            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.id === userId) {
                currentUser.balance = newBalance;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
        }
    }

    // Transaction Management
    addTransaction(userId, type, concept, amount, reference = null) {
        const transactions = JSON.parse(localStorage.getItem('bankTransactions'));
        const transactionRef = reference || this.generateReference();
        
        const transaction = {
            id: Date.now(),
            userId: userId,
            date: new Date().toISOString(),
            reference: transactionRef,
            type: type,
            concept: concept,
            amount: amount
        };

        transactions.push(transaction);
        localStorage.setItem('bankTransactions', JSON.stringify(transactions));
        
        return transaction;
    }

    generateReference() {
        return Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    }

    getUserTransactions(userId, limit = null) {
        const transactions = JSON.parse(localStorage.getItem('bankTransactions'));
        const userTransactions = transactions
            .filter(t => t.userId === userId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return limit ? userTransactions.slice(0, limit) : userTransactions;
    }

    getTransactionsByMonth(userId, year, month) {
        const transactions = this.getUserTransactions(userId);
        return transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getFullYear() === parseInt(year) && 
                   transactionDate.getMonth() + 1 === parseInt(month);
        });
    }

    // Password Recovery
    findUserByCredentials(idType, idNumber, email) {
        const users = JSON.parse(localStorage.getItem('bankUsers'));
        return users.find(u => 
            u.idType === idType && 
            u.idNumber === idNumber && 
            u.email === email
        );
    }

    updateUserPassword(userId, newPassword) {
        const users = JSON.parse(localStorage.getItem('bankUsers'));
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('bankUsers', JSON.stringify(users));
            return true;
        }
        
        return false;
    }
}

// Initialize banking system
const bankingSystem = new BankingSystem();

// Utility Functions
function showError(message, containerId = 'errorMessage') {
    const errorDiv = document.getElementById(containerId);
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    }
}

function showSuccess(message, containerId = 'successMessage') {
    const successDiv = document.getElementById(containerId);
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.classList.remove('hidden');
        
        setTimeout(() => {
            successDiv.classList.add('hidden');
        }, 5000);
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Page-specific JavaScript

// Login Page
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const idType = document.getElementById('idType').value;
        const idNumber = document.getElementById('idNumber').value;
        const password = document.getElementById('password').value;
        
        if (!idType || !idNumber || !password) {
            showError('Por favor complete todos los campos');
            return;
        }
        
        const user = bankingSystem.authenticateUser(idType, idNumber, password);
        
        if (user) {
            window.location.href = './dashboard/dashboard.html';
        } else {
            showError('No se pudo validar su identidad. Verifique sus credenciales.');
        }
    });
}

// Register Page
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const userData = {
            idType: formData.get('regIdType'),
            idNumber: formData.get('regIdNumber'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            gender: formData.get('gender'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            address: formData.get('address'),
            city: formData.get('city'),
            password: formData.get('regPassword')
        };
        
        // Validate all fields
        const requiredFields = Object.keys(userData);
        const missingFields = requiredFields.filter(field => !userData[field]);
        
        if (missingFields.length > 0) {
            showError('Por favor complete todos los campos obligatorios');
            return;
        }
        
        try {
            const newUser = bankingSystem.createUser(userData);
            
            // Show success message with account details
            const successMessage = `
                <div class="success-summary">
                    <h3>¡Registro exitoso!</h3>
                    <p><strong>Número de cuenta asignado:</strong> ${newUser.accountNumber}</p>
                    <p><strong>Fecha de creación:</strong> ${formatDate(newUser.creationDate)}</p>
                    <p><a href="../index.html">Ir al inicio de sesión</a></p>
                </div>
            `;
            
            document.getElementById('successMessage').innerHTML = successMessage;
            document.getElementById('successMessage').classList.remove('hidden');
            
            // Hide form
            document.getElementById('registerForm').style.display = 'none';
            
        } catch (error) {
            showError(error.message);
        }
    });
}

// Recovery Page
if (document.getElementById('recoveryForm')) {
    let userForRecovery = null;
    
    document.getElementById('recoveryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const idType = document.getElementById('recIdType').value;
        const idNumber = document.getElementById('recIdNumber').value;
        const email = document.getElementById('recEmail').value;
        
        if (!idType || !idNumber || !email) {
            showError('Por favor complete todos los campos');
            return;
        }
        
        userForRecovery = bankingSystem.findUserByCredentials(idType, idNumber, email);
        
        if (userForRecovery) {
            // Hide recovery form and show new password form
            document.getElementById('recoveryForm').classList.add('hidden');
            document.getElementById('newPasswordForm').classList.remove('hidden');
            showSuccess('Datos verificados correctamente. Ingrese su nueva contraseña.');
        } else {
            showError('Los datos ingresados no coinciden con ninguna cuenta registrada');
        }
    });
    
    document.getElementById('newPasswordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!newPassword || !confirmPassword) {
            showError('Por favor complete todos los campos');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showError('Las contraseñas no coinciden');
            return;
        }
        
        if (newPassword.length < 6) {
            showError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        
        if (bankingSystem.updateUserPassword(userForRecovery.id, newPassword)) {
            showSuccess('Contraseña actualizada exitosamente. Será redirigido al inicio de sesión.');
            
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
        } else {
            showError('Error al actualizar la contraseña');
        }
    });
}

// Dashboard redirect if not logged in
if (window.location.pathname.includes('dashboard.html')) {
    const currentUser = bankingSystem.getCurrentUser();
    if (!currentUser) {
        window.location.href = 'index.html';
    }
}

// Logout function
function logout() {
    bankingSystem.logoutUser();
    window.location.href = '../index.html';
}
