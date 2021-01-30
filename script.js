const Modal = {
    open() {
        document.querySelector('.modal-overlay').classList.add('active')
    },
    close() {
        document.querySelector('.modal-overlay').classList.remove('active')

    }
}


const transactions = [
    { description: 'Luz', amount: -50000, date: '18/01/2021' },
    { description: 'Criação de Website', amount: 500000, date: '14/01/2021' },
    { description: 'Internet', amount: -20000, date: '29/01/2021' },
    { description: 'Lanche', amount: -5000, date: '29/01/2021' }
]
const Transactions = {
    all: transactions,
    add(transaction){
        Transactions.all.push(transaction)
        App.reload()
    },
    remove(index){
        Transactions.all.splice(index, 1)
        App.reload()
    },

    income() {
        let income = 0
        transactions.forEach(transaction => {
            if(transaction.amount > 0)
            income += transaction.amount
        })
        return income
    },
    expense() {
        let expense = 0
        transactions.forEach(transaction => {
            if(transaction.amount < 0)
            expense += transaction.amount
        })
        return  expense
    },
    total() {
        return this.income() + this.expense()
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')

        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction) {
        const cssClass = transaction.amount > 0 ? 'income' : 'expense'
        const amount = Utils.formatCurrency(transaction.amount)
        const html = `   
    <td class="description">${transaction.description}</td>
    <td class="${cssClass}">${amount}</td>
    <td class="date">${transaction.date}</td>
    <td>
        <img src=".//assets/minus.svg" alt="remover transação">
    </td>`

        return html
    },
    updateBalace() {
        document.getElementById('incomeDisplay').innerHTML =  Utils.formatCurrency(Transactions.income())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transactions.expense())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transactions.total())
    },
    clearTransactions(){
        this.transactionsContainer.innerHTML = ''

    }
    

}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? '-' : ''
        value = String(value).replace(/\D/g, '')
        value = value / 100
        value = value.toLocaleString('pt-Br', { style: 'currency', currency: 'BRL' })
        return signal + value
    }, areplace(){
        
    }
}

const App = {
    init() {
        
        Transactions.all.forEach(transaction => { DOM.addTransaction(transaction) })
        
        DOM.updateBalace()
    },
    reload() {
        DOM.clearTransactions()
        this.init()
    }
}

App.init()
Transactions.add(,)
