let displayCalculation = document.getElementById('display-calculations');
let displayResult = document.getElementById('display-result');
let values = [];
let buttonsNodeList = document.querySelectorAll('.num');
let actionsNodeList = document.querySelectorAll('.action');
console.log(buttonsNodeList)
let actionsList = ['+', '-', '*', '/']
let resultActionList = ['%', '^2']

const handleReset = () => {
    displayCalculation.innerText = ''
    displayResult.innerText = ''
    values = []
}

const updateDisplay = () => {
    displayCalculation.innerText = values.join(" ")
}

const handleNumberInput = (e) => {
    let currentValue = e.target.getAttribute('data-value')
    if (values.length === 0) {
        if (currentValue === '.') {
            values.push('0.')
        } else {
            values.push(currentValue)
        }
        updateDisplay()
        return
    }

    let lastItem = values[values.length - 1]
    if (Object.is(NaN, parseFloat(lastItem))) {
        if (currentValue === '.') {
            values.push('0.')
        } else {
            values.push(currentValue)
        }
    } else {
        values.splice(values.length - 1, 1, `${lastItem}${currentValue}`)
    }
    updateDisplay()
}

const handleCalculation = () => {
    let result = 0
    let currentAction = null
    values.forEach(item => {
        if (item == '(') {
            return;
        } else if (actionsList.includes(item)) {
            currentAction = item;
        } else if (resultActionList.find(it => item.includes(it))) { // ['%', '^2']; )%, )^2
        // } else if (resultActionList.includes(item.substring(1))) {
            result = performCalculation(result, null, item)
        } else {
            result = performCalculation(result, parseFloat(item), currentAction)
        }
    })
    displayResult.innerText = result
}

const performCalculation = (result, item, action) => {
    console.log(result, item, action)
    switch (action) {
        case '+':
            return result + item;
        case '-':
            return result - item;
        case '*':
            return result * item;
        case '/':
            return result / item;
        case ')%':
            return result / 100;
        case ')^2':
            return result * result;
        default:
            return item;
    }
}

const handleExecution = (action) => {
    let lastItem = values[values.length - 1]
    if (actionsList.includes(lastItem)) {
        if (resultActionList.includes(action)) {
            values.unshift('(')
            values.splice(values.length - 1, 1, `)${action}`)
        } else {
            values.splice(values.length - 1, 1, action)
        }
    } else if (resultActionList.includes(action)) {
        values.unshift('(')
        values.push(`)${action}`)
    } else {
        values.push(action)
    }
    updateDisplay()
}

const handleClear = () => {
    displayResult.innerText = ''
    let lastItem = values[values.length - 1]
    let copiedValues = [...values]
    if (actionsList.includes(lastItem)) {
        copiedValues.pop()
        values = copiedValues;
    } else if (resultActionList.find(it => lastItem.includes(it))) {
        copiedValues.pop()
        copiedValues.shift()
        values = copiedValues
    } else {
        if (lastItem.length > 1) {
            if (lastItem.length == 2 && lastItem[1] === '.' && lastItem[0] === '0') {
                values.pop()
            } else {
                lastItem = lastItem.substring(0, lastItem.length - 1)
                values.splice(values.length - 1, 1, lastItem)    
            }
        } else {
            copiedValues.pop();
            values = copiedValues;            
        }
    }
    updateDisplay()
}

const handleAction = (e) => {
    if (values.length === 0) {
        return
    }

    let dataAction = e.target.getAttribute('data-action')
    switch (dataAction) {
        case 'plus':
            handleExecution('+')
            break;
        case 'minus':
            handleExecution('-')
            break;
        case 'times':
            handleExecution('*')
            break;
        case 'divide':
            handleExecution('/')
            break;
        case 'percent':
            handleExecution('%')
            break;
        case 'square':
            handleExecution('^2')
            break;
        case 'equals':
            handleCalculation()
            break;
        case 'reset':
            handleReset()
            break;
        case 'clear':
            handleClear()
            break;
        default:
            break;
    }
}



buttonsNodeList.forEach(buttonNode => buttonNode.addEventListener('click', handleNumberInput))
actionsNodeList.forEach(actionNode => actionNode.addEventListener('click', handleAction))
