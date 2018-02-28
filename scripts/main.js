

// CREATE THE VARIABLES FOR THE DOM ELEMENTS WE NEED TO WORK WITH
var orders = document.querySelector('.list-orders');
var coffeeForm = document.querySelector("[data-coffee-order='form']");
var coffeeOrder = document.querySelector("[name='coffee']");
var emailAddress = document.querySelector("[name='emailAddress']");
var size = document.querySelector("[name='size']");
var flavor = document.querySelector("[name='flavor']");
var strength = document.querySelector("[name='strength']");

allOrders = []
var count = 0;
var generateID = function() {
    return ++count;
}
var removerOrder = function(event) {
    allOrders.forEach(function(item, index){
        if (item.uniqueID === event.currentTarget.getAttribute("thisID")) {
            allOrders.splice(index, 1);
        };
    });
    orders.removeChild(event.currentTarget);
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
    var order = document.createElement('li');
    order.textContent = currentOrder['order'] + currentOrder['email'] + currentOrder['size'] + currentOrder['flavor'] + currentOrder['strength'];
    order.setAttribute('thisID', currentOrder['uniqueID']);
    order.addEventListener("click", removerOrder);
    orders.appendChild(order);
    allOrders.push(currentOrder);
};
coffeeForm.addEventListener("submit", recordOrder);

