var orders = document.querySelector('.list-orders');
var coffeeForm = document.querySelector("[data-coffee-order='form']");
var coffeeOrder = document.querySelector("[name='coffee']");
var emailAddress = document.querySelector("[name='emailAddress']");
var size = document.querySelector("[name='size']");
var flavor = document.querySelector("[name='flavor']");
var strength = document.querySelector("[name='strength']");
var allOrders = [];

var saveOrders = function(array) {
    var string = JSON.stringify(array);
    localStorage.setItem('submittedOrders', string);
    console.log('I saved data!')
}

var getOrders = function() {
    var savedOrders = localStorage.getItem('submittedOrders');
    var parsedOrders = JSON.parse(savedOrders);
    if (savedOrders !== null) {
        allOrders = parsedOrders;
        allOrders.forEach(function(item){
            generateOrder(item);
    })
}
}

var saveCounter = function(counter) {
    var string = JSON.stringify(counter);
    localStorage.setItem('uniqueCount', string);
    console.log('I saved counter!')
}
var getCounter = function() {
    var savedCount = localStorage.getItem('uniqueCount');
    parsedCount = JSON.parse(savedCount)
    if (parsedCount === null){
        return 0;
    } else {
        return parsedCount;
    }
};

var removeOrder = function(event) {
    allOrders.forEach(function(item, index){
        if (item.uniqueID === event.currentTarget.getAttribute("thisID")) {
            allOrders.splice(index, 1);
        };
    });
    orders.removeChild(event.currentTarget);
    saveOrders(allOrders);
}
var generateOrder = function(currentOrder) {
    var order = document.createElement('li');
    order.textContent = currentOrder['order'] + currentOrder['email'] + currentOrder['size'] + currentOrder['flavor'] + currentOrder['strength'] + " Remove: X";
    order.setAttribute('thisID', currentOrder['uniqueID']);
    order.addEventListener("click", removeOrder);
    orders.appendChild(order);
}
getOrders();
var count = getCounter();
var generateID = function() {
    ++count
    saveCounter(count);
    return count;
}

var recordOrder = function(event) {
    event.preventDefault();
    var currentOrder = {order: coffeeOrder.value,
        email: emailAddress.value,
        size: size.value,
        flavor: flavor.value,
        strength: strength.value,
        uniqueID: generateID().toString()
    };
    allOrders.push(currentOrder);
    generateOrder(currentOrder);
    saveOrders(allOrders);
};

coffeeForm.addEventListener("submit", recordOrder);