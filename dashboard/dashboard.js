// Dashboard Management
class Dashboard {
    constructor() {
        this.currentUser = bankingSystem.getCurrentUser();
        if (!this.currentUser) {
            window.location.href = 'index.html';
            return;
        }
        
        this.initializeDashboard();
        this.setupEventListeners();
    }

    initializeDashboard() {
        this.loadUserInfo();
        this.loadAccountSummary();
        this.loadTransactions();
        this.setupYearOptions();
        this.loadCertificateInfo();
    }

    loadUserInfo() {
        const userName = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        document.getElementById('userName').textContent = userName;
        
        // Update all user name displays
        const userNameElements = [
            'depositName', 'withdrawalName', 'paymentName', 'statementName'
        ];
        userNameElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = userName;
        });
        
        // Update all account number displays
        const accountElements = [
            'depositAccount', 'withdrawalAccount', 'paymentAccount', 'statementAccount'
        ];
        accountElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = this.currentUser.accountNumber;
        });
    }

    loadAccountSummary() {
        document.getElementById('accountNumber').textContent = this.currentUser.accountNumber;
        document.getElementById('accountBalance').textContent = formatCurrency(this.currentUser.balance);
        document.getElementById('creationDate').textContent = formatDate(this.currentUser.creationDate);
    }

    loadTransactions() {
        const transactions = bankingSystem.getUserTransactions(this.currentUser.id, 10);
        const tbody = document.getElementById('transactionsBody');
        
        if (transactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay transacciones registradas</td></tr>';
            return;
        }
        
        tbody.innerHTML = transactions.map(transaction => `
            <tr>
                <td>${formatDateTime(transaction.date)}</td>
                <td>${transaction.reference}</td>
                <td>${transaction.type}</td>
                <td>${transaction.concept}</td>
                <td>${formatCurrency(transaction.amount)}</td>
            </tr>
        `).join('');
    }

    setupYearOptions() {
        const yearSelect = document.getElementById('statementYear');
        const currentYear = new Date().getFullYear();
        
        for (let year = currentYear; year >= currentYear - 5; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
    }

    loadCertificateInfo() {
        const idTypeNames = {
            'CC': 'Cédula de Ciudadanía',
            'TI': 'Tarjeta de Identidad',
            'CE': 'Cédula de Extranjería',
            'PP': 'Pasaporte'
        };
        
        document.getElementById('certificateUserName').textContent = 
            `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        document.getElementById('certificateIdType').textContent = 
            idTypeNames[this.currentUser.idType];
        document.getElementById('certificateIdNumber').textContent = 
            this.currentUser.idNumber;
        document.getElementById('certificateAccountNumber').textContent = 
            this.currentUser.accountNumber;
        document.getElementById('certificateCreationDate').textContent = 
            formatDate(this.currentUser.creationDate);
        document.getElementById('certificateCurrentDate').textContent = 
            formatDate(new Date().toISOString());
    }

    setupEventListeners() {
        // Deposit form
        document.getElementById('depositForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleDeposit();
        });

        // Withdrawal form
        document.getElementById('withdrawalForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleWithdrawal();
        });

        // Payment form
        document.getElementById('paymentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePayment();
        });

        // Statement form
        document.getElementById('statementForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleStatement();
        });
    }

    handleDeposit() {
        const amount = parseFloat(document.getElementById('depositAmount').value);
        
        if (!amount || amount <= 0) {
            showError('Por favor ingrese un monto válido');
            return;
        }
        
        const newBalance = this.currentUser.balance + amount;
        
        // Add transaction
        bankingSystem.addTransaction(
            this.currentUser.id,
            'Consignación',
            'Consignación por canal electrónico',
            amount
        );
        
        // Update balance
        bankingSystem.updateUserBalance(this.currentUser.id, newBalance);
        this.currentUser.balance = newBalance;
        
        // Refresh displays
        this.loadAccountSummary();
        this.loadTransactions();
        
        // Reset form
        document.getElementById('depositForm').reset();
        
        showSuccess(`Consignación realizada exitosamente. Nuevo saldo: ${formatCurrency(newBalance)}`);
    }

    handleWithdrawal() {
        const amount = parseFloat(document.getElementById('withdrawalAmount').value);
        
        if (!amount || amount <= 0) {
            showError('Por favor ingrese un monto válido');
            return;
        }
        
        if (amount > this.currentUser.balance) {
            showError('Fondos insuficientes para realizar el retiro');
            return;
        }
        
        const newBalance = this.currentUser.balance - amount;
        
        // Add transaction
        bankingSystem.addTransaction(
            this.currentUser.id,
            'Retiro',
            'Retiro de dinero',
            -amount
        );
        
        // Update balance
        bankingSystem.updateUserBalance(this.currentUser.id, newBalance);
        this.currentUser.balance = newBalance;
        
        // Refresh displays
        this.loadAccountSummary();
        this.loadTransactions();
        
        // Reset form
        document.getElementById('withdrawalForm').reset();
        
        showSuccess(`Retiro realizado exitosamente. Nuevo saldo: ${formatCurrency(newBalance)}`);
    }

    handlePayment() {
        const serviceType = document.getElementById('serviceType').value;
        const serviceReference = document.getElementById('serviceReference').value;
        const amount = parseFloat(document.getElementById('paymentAmount').value);
        
        if (!serviceType || !serviceReference || !amount || amount <= 0) {
            showError('Por favor complete todos los campos con datos válidos');
            return;
        }
        
        if (amount > this.currentUser.balance) {
            showError('Fondos insuficientes para realizar el pago');
            return;
        }
        
        const newBalance = this.currentUser.balance - amount;
        
        // Add transaction
        bankingSystem.addTransaction(
            this.currentUser.id,
            'Pago de servicios',
            `Pago de ${serviceType} - Ref: ${serviceReference}`,
            -amount
        );
        
        // Update balance
        bankingSystem.updateUserBalance(this.currentUser.id, newBalance);
        this.currentUser.balance = newBalance;
        
        // Refresh displays
        this.loadAccountSummary();
        this.loadTransactions();
        
        // Reset form
        document.getElementById('paymentForm').reset();
        
        showSuccess(`Pago de ${serviceType} realizado exitosamente. Nuevo saldo: ${formatCurrency(newBalance)}`);
    }

    handleStatement() {
        const year = document.getElementById('statementYear').value;
        const month = document.getElementById('statementMonth').value;
        
        if (!year || !month) {
            showError('Por favor seleccione año y mes');
            return;
        }
        
        const transactions = bankingSystem.getTransactionsByMonth(
            this.currentUser.id, 
            year, 
            month
        );
        
        const monthNames = {
            '1': 'Enero', '2': 'Febrero', '3': 'Marzo', '4': 'Abril',
            '5': 'Mayo', '6': 'Junio', '7': 'Julio', '8': 'Agosto',
            '9': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
        };
        
        const tbody = document.getElementById('statementBody');
        
        if (transactions.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center">No hay transacciones para ${monthNames[month]} de ${year}</td></tr>`;
        } else {
            tbody.innerHTML = transactions.map(transaction => `
                <tr>
                    <td>${formatDateTime(transaction.date)}</td>
                    <td>${transaction.reference}</td>
                    <td>${transaction.type}</td>
                    <td>${transaction.concept}</td>
                    <td>${formatCurrency(transaction.amount)}</td>
                </tr>
            `).join('');
        }
        
        document.getElementById('statementResult').classList.remove('hidden');
    }
}

// Navigation Functions
function showSection(sectionId) {
    // Remove active class from all sections and menu items
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked menu item
    event.target.classList.add('active');
}

// Print Functions
function printTransactions() {
    const printWindow = window.open('', '_blank');
    const transactionsTable = document.getElementById('transactionsTable').outerHTML;
    const currentUser = bankingSystem.getCurrentUser();
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Resumen de Transacciones - Banco Acme</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { color: #2563eb; }
                .account-info { margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .print-date { margin-top: 20px; text-align: right; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>BANCO ACME</h1>
                <h2>Resumen de Transacciones</h2>
            </div>
            <div class="account-info">
                <p><strong>Titular:</strong> ${currentUser.firstName} ${currentUser.lastName}</p>
                <p><strong>Cuenta:</strong> ${currentUser.accountNumber}</p>
                <p><strong>Últimas 10 transacciones</strong></p>
            </div>
            ${transactionsTable}
            <div class="print-date">
                <p>Impreso el: ${formatDateTime(new Date().toISOString())}</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

function printStatement() {
    const printWindow = window.open('', '_blank');
    const statementTable = document.getElementById('statementTable').outerHTML;
    const currentUser = bankingSystem.getCurrentUser();
    const year = document.getElementById('statementYear').value;
    const month = document.getElementById('statementMonth').value;
    
    const monthNames = {
        '1': 'Enero', '2': 'Febrero', '3': 'Marzo', '4': 'Abril',
        '5': 'Mayo', '6': 'Junio', '7': 'Julio', '8': 'Agosto',
        '9': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
    };
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Extracto Bancario - Banco Acme</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { color: #2563eb; }
                .account-info { margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .print-date { margin-top: 20px; text-align: right; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>BANCO ACME</h1>
                <h2>Extracto Bancario</h2>
            </div>
            <div class="account-info">
                <p><strong>Titular:</strong> ${currentUser.firstName} ${currentUser.lastName}</p>
                <p><strong>Cuenta:</strong> ${currentUser.accountNumber}</p>
                <p><strong>Período:</strong> ${monthNames[month]} de ${year}</p>
            </div>
            ${statementTable}
            <div class="print-date">
                <p>Impreso el: ${formatDateTime(new Date().toISOString())}</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

function printCertificate() {
    const printWindow = window.open('', '_blank');
    const certificateContent = document.getElementById('certificateContent').innerHTML;
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Certificado Bancario - Banco Acme</title>
            <style>
                body { font-family: 'Times New Roman', serif; margin: 20px; }
                .certificate-header-content { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
                .certificate-logo i { font-size: 48px; color: #2563eb; margin-bottom: 10px; }
                .certificate-logo h1 { font-size: 32px; color: #1f2937; margin-bottom: 10px; }
                .certificate-header-content h2 { font-size: 24px; color: #2563eb; font-weight: 600; }
                .certificate-body { line-height: 1.8; }
                .certificate-text { margin-bottom: 20px; text-align: justify; color: #374151; font-size: 16px; }
                .certificate-footer { margin-top: 40px; text-align: center; }
                .signature-section { margin-top: 60px; }
                .signature-line { width: 300px; height: 2px; background: #374151; margin: 0 auto 10px; }
            </style>
        </head>
        <body>
            ${certificateContent}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    new Dashboard();
});

function qr() {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <body>
            <div style="display:flex; flex-direction:column; justify-content:center;">
                <img style="display:flex; justify-content:center;" class="img" src="./assets/Captura desde 2025-07-16 16-11-39.png" alt="">
                <h1 style="text-align:center;">QR - Banco ACME</h1>
            <div/>
            
            
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Menú hamburguesa responsive
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');

function openSidebar() {
    sidebar.classList.add('open');
    sidebarBackdrop.style.display = 'block';
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarBackdrop.style.display = 'none';
}

if (sidebarToggle && sidebar && sidebarBackdrop) {
    sidebarToggle.addEventListener('click', openSidebar);
    sidebarBackdrop.addEventListener('click', closeSidebar);
    // Cerrar menú al hacer clic en un enlace del menú
    sidebar.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', closeSidebar);
    });
}
