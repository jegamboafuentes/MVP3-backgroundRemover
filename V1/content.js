/*
 * This is an example of how you would add ExtPay to a content script.
 * ExtPay is made available in this script through the manifest.json
 * "content_scripts" -> "js" array.
 */

//This is to add the button at the top page *-*->
// var extpay = ExtPay('tier2automaticnfttraitgenerator'); 

// // Add a "subscribe to Sample Extension!" button on every webpage.
// var button = document.createElement('button');
// button.innerText = 'Pay for ExtensionPay Sample Extension!'
// button.addEventListener('click', function(evt) {
// 	extpay.openPaymentPage();
// }, true)

// document.body.prepend(button);
// <*-*- END

let clickedEl = null;

document.addEventListener("mousedown", function(event){
    if(event.button == 2) {
        clickedEl = event.target;
    }
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request == "getImageSrc"){
        sendResponse(clickedEl.src);
    }
});
