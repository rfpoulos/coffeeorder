var URL = 'http://dc-coffeerun.herokuapp.com/api/coffeeorders';
var orders = document.querySelector('.list-orders');
var coffeeForm = document.querySelector("[data-coffee-order='form']");
var coffeeOrder = document.querySelector("[name='coffee']");
var emailAddress = document.querySelector("[name='emailAddress']");
var flavor = document.querySelector("[name='flavor']");
var strength = document.querySelector("[name='strength']");
var allOrders = [];


var getOrders = function() {
    $.get(URL, function(data) {
        newArray = Object.values(data);
        if (newArray !== null) {
            newArray.forEach(function(item){
                generateOrder(item);
                allOrders.push(item);
            });
        };
    });
}

var removeOrder = function(event) {
    var myTarget = event.currentTarget;
    myTarget.removeEventListener("click", removeOrder);
    allOrders.forEach(function(item, index){
        if (item._id === myTarget.getAttribute("data-thisID")) {
            $.ajax({type:"DELETE",
                 url:URL + "/" + item['emailAddress']});
            allOrders.splice(index, 1);
        };
    });
    var removeLi = function(){
        orders.removeChild(myTarget);
    }
    setTimeout(removeLi, 2000);
}
var generateOrder = function(currentOrder) {
    var order = document.createElement('li');
    order.textContent = currentOrder['coffee'] + currentOrder['emailAddress'] + currentOrder['size'] + currentOrder['flavor'] + currentOrder['strength'] + " Remove: X";
    order.setAttribute('data-thisID', currentOrder['_id']);
    order.addEventListener("click", removeOrder);
    orders.appendChild(order);
}
getOrders();
var saveOrderToDataBase = function(currentOrder){
    $.post(URL, currentOrder, function(data){
        generateOrder(data);
        allOrders.push(data);
    });
}
var recordOrder = function(event) {
    event.preventDefault();
    var size = document.querySelector("[name='size']:checked");
    var currentOrder = {"coffee": coffeeOrder.value,
        "emailAddress": emailAddress.value,
        "size": size.value,
        "flavor": flavor.value,
        "strength": strength.value
    };
    saveOrderToDataBase(currentOrder);
};

coffeeForm.addEventListener("submit", recordOrder);