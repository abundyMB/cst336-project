$(document).ready(function(){
    
    //global variables
    var itemsPrice = 0.00;
    var tax = 0;
    var shipping = 0;
    var total = 0;
    
test = localStorage.getItem('customerCart');
console.log(test);

var customerCart = [ {albumID:0, title:"Abbey Road", artist:"The Beatles", coverImage: '<img src="/img/abbeyroad.jpg" alt="Abbey Road - Beatles">', price:25.00}, 
{albumID:1, title:"Let There Be Cello", artist:"2 Cellos", coverImage: '<img src="/img/2cellos1.jpg" alt="Let There Be Cello - 2 Cellos">',  price:25.00},
{albumID:2, title:"Rubber Soul", artist:"The Beatles", coverImage: '<img src="/img/rubbersoul.jpg" alt="Rubber Soul - Beatles">',  price:25.00},
{albumID:3, title:"Extraterrestrial Live", artist:"Blue Oyster Cult", coverImage: '<img src="/img/etilive.jpg" alt="Extraterrestrial Live - Blue Oyster Cult">', price:25.00},
{albumID:4, title:"Fire of Unknown Origin", artist:"Blue Oyster Cult", coverImage: '<img src="/img/fireofunknownorigin.jpg" alt="Fire of Unknown Origin - Blue Oyster Cult">', price:25.00},
{albumID:5, title:"Dead Man's Party", artist:"Oingo Boingo", coverImage: '<img src="/img/deadmansparty.jpg" alt="Dead Man\'s Party - Oingo Boingo">', price:25.00},
{albumID:6, title:"Only a Lad", artist:"Oingo Boingo", coverImage: '<img src="/img/onlyalad.jpg" alt="Only a Lad - Oingo Boingo">', price:25.00},
{albumID:7, title:"Master of Puppets", artist:"Metallica", coverImage: '<img src="/img/masterofpuppets.jpg" alt="Master of Puppets - Metallica">', price:25.00}
];

//update cart
updateCart();

function updateCart() {
customerCart.forEach(function(element){
    
$("#cartList").append(`${element.coverImage} <br /> Artist: ${element.artist} Title: ${element.title} Price: $${element.price} <br />`);   
$("#cartList").append(`<button value=${element.albumID} type="button" class="btn btn-warning remove"> Remove Item </button> <br /> <br />`);

});
};//update cart

//function to calculate and display cart price totals
calculateTotals(); 
function calculateTotals(){
    
    itemsPrice = 0.00;
    tax = 0;
    shipping = 0;
    total = 0;

//iterate through customer cart and add price of each element in cart
customerCart.forEach(function(element){    
    itemsPrice = itemsPrice += element.price;
});
    
    tax = Math.round((itemsPrice * 0.06), 2);
    shipping = Math.round((itemsPrice * 0.00), 2);
    total = Math.round((itemsPrice + tax + shipping), 2);
    
    $("#itemsTotal").html(`Items: $${itemsPrice}`);
    $("#taxTotal").html(`Tax: $${tax}`);
    $("#shippingTotal").html(`Tax: $${shipping}`);
    $("#orderTotal").html(`Total Price: $${total}`);

}//calculate totals

//add function to remove items from cart
$("#cartList").on("click",".remove", function() {

itemID = $(this).val();
delete customerCart[itemID];
$("#cartList").html("");

console.log( $(this).val() );

updateCart();
calculateTotals();

});//remove items from cart



});//document ready
    