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
    let data = JSON.stringify(currentOrder);
    var saveToDataBasePromise = fetch(URL, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: data
    })
    saveToDataBasePromise.then(function(response){
        return response.json()
    })
    .then(function(data) {
        generateOrder(data);
        localOrdersArray.push(data);
    })
    .catch(function(error){
        console.log('error');
    })
}

var generateOrder = function(currentOrder) {
    var order = document.createElement('li');
    order.textContent = currentOrder['coffee'] + currentOrder['emailAddress'] + currentOrder['size'] + currentOrder['flavor'] + currentOrder['strength'] + " Remove: X";
    order.setAttribute('data-thisID', currentOrder['_id']);
    order.setAttribute('data-isClicked', 'no');
    order.addEventListener("click", removeOrder);
    orders.appendChild(order);
}
var removeOrder = function(event) {
    var myTarget = event.currentTarget;
    myTarget['data-isClicked'] = 'yes';
    console.log('removeOrder: ' + myTarget['data-isClicked']);
    myTarget.removeEventListener("click", removeOrder);
    myTarget.addEventListener("click", changeMind);
    var removeOrderItem = function(){
        if (myTarget['data-isClicked'] === 'yes')
            orders.removeChild(myTarget);
            deleteItemFromServer(localOrdersArray, myTarget);
    }
    setTimeout(removeOrderItem, 1000);
}
var changeMind = function(event) {
    var myTarget = event.currentTarget;
    myTarget['data-isClicked'] = 'no';
    myTarget.removeEventListener("click", changeMind);
    myTarget.addEventListener("click", removeOrder);
    console.log('change mind: ' + myTarget['data-isClicked']);
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
var getOrders = function(data) {
        var newArray = Object.values(data);
        localOrdersArray = newArray;
        if (newArray !== null) {
            newArray.forEach(function(item){
                generateOrder(item);
            });
        };
    };
var aPromise = fetch(URL)
    .then(function(response){
        return response.json()
    })
    .then(function(data) {
        return getOrders(data);  
    })
    .catch(function(error){
        console.log('error');
    })

coffeeForm.addEventListener("submit", recordOrder);