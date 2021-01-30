const Modal = {
    open() {
        document.querySelector('.modal-overlay').classList.add('active')
    },
    close() {
        document.querySelector('.modal-overlay').classList.remove('active')

    }
}
const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }

}

const Transactions = {
    all: Storage.get(),
    add(transaction) {
        Transactions.all.push(transaction)
        App.reload()
    },
    remove(index) {
        Transactions.all.splice(index, 1)
        App.reload()
    },

    income() {
        let income = 0
        this.all.forEach(transaction => {
            if (transaction.amount > 0)
                income += transaction.amount
        })
        return income
    },
    expense() {
        let expense = 0
        this.all.forEach(transaction => {
            if (transaction.amount < 0)
                expense += transaction.amount
        })
        return expense
    },
    total() {
        return this.income() + this.expense()
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)

    },

    innerHTMLTransaction(transaction, index) {
        const cssClass = transaction.amount > 0 ? 'income' : 'expense'
        const amount = Utils.formatCurrency(transaction.amount)
        const html = `   
    <td class="description">${transaction.description}</td>
    <td class="${cssClass}">${amount}</td>
    <td class="date">${transaction.date}</td>
    <td>
        <img onclick="Transactions.remove(${index})" src=".//assets/minus.svg" alt="remover transação">
    </td>`

        return html
    },

    updateBalace() {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transactions.income())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transactions.expense())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transactions.total())
    },
    clearTransactions() {
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
    },
    formatAmount(value) {
        value = Number(value) * 100
        return value
    },
    formatDate(value) {
        const splitedDate = value.split('-')
        console.log(splitedDate);
        return splitedDate[2] + '/' + splitedDate[1] + '/' + splitedDate[0]
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    submit(event) {
        event.preventDefault()
        try {
            this.validateField()
            this.save(this.formatValues())
            this.clearField()
            Modal.close()

        } catch (error) {
            alert(error.message)
        }

    },
    getValues() {
        return {
            description: this.description.value,
            amount: this.amount.value,
            date: this.date.value
        }
    },

    validateField() {
        const { description, amount, date } = this.getValues()
        if (description.trim() === '' || amount.trim() === '' || date.trim() === '') {
            throw new Error("Por Favor, preencha todos os campos")
        }

    },
    formatValues() {
        let { description, amount, date } = this.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        return { description, amount, date }
    },

    save(transaction) {
        Transactions.add(transaction)
    },
    clearField() {
        this.description.value = ''
        this.amount.value = ''
        this.date.value = ''
    }

}


const App = {
    init() {
        Transactions.all.forEach(DOM.addTransaction)
        DOM.updateBalace()
        Storage.set(Transactions.all)
    },
    reload() {
        DOM.clearTransactions()
        this.init()
    }
}
Storage.get()

App.init()