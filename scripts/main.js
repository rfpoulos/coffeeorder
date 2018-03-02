var URL = 'http://dc-coffeerun.herokuapp.com/api/coffeeorders';
var orders = document.querySelector('.list-orders');
var coffeeForm = document.querySelector("[data-coffee-order='form']");
var coffeeOrder = document.querySelector("[name='coffee']");
var emailAddress = document.querySelector("[name='emailAddress']");
var flavor = document.querySelector("[name='flavor']");
var strength = document.querySelector("[name='strength']");
var localOrdersArray = [];

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

var saveOrderToDataBase = function(currentOrder){
    $.post(URL, currentOrder, function(data){
        generateOrder(data);
        localOrdersArray.push(data);
    });
}

var generateOrder = function(currentOrder) {
    var order = document.createElement('li');
    order.textContent = currentOrder['coffee'] + currentOrder['emailAddress'] + currentOrder['size'] + currentOrder['flavor'] + currentOrder['strength'] + " Remove: X";
    order.setAttribute('data-thisID', currentOrder['_id']);
    order.addEventListener("click", removeOrder);
    orders.appendChild(order);
}
var removeOrder = function(event) {
    var myTarget = event.currentTarget;
    myTarget.removeEventListener("click", removeOrder);
    deleteItemFromServer(localOrdersArray, myTarget);
    var removeRow = function(){
        orders.removeChild(myTarget);
    }
    setTimeout(removeRow, 1000);
}
var deleteItemFromServer = function(anArray, element) {
    anArray.forEach(function(item, index){
        if (item._id === element.getAttribute("data-thisID")) {
            $.ajax({type:"DELETE",
                 url:URL + "/" + item['emailAddress']});
            anArray.splice(index, 1);
        };
    });
}
var getOrders = function() {
    $.get(URL, function(data) {
        var newArray = Object.values(data);
        localOrdersArray = newArray;
        if (newArray !== null) {
            newArray.forEach(function(item){
                generateOrder(item);
            });
        };
    });
}

coffeeForm.addEventListener("submit", recordOrder);
getOrders();