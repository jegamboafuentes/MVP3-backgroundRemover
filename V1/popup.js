// Replace 'sample-extension' with the id of the extension you
// registered on ExtensionPay.com to test payments. You may need to
// uninstall and reinstall the extension to make it work.
// Don't forget to change the ID in background.js too!
const extpay = ExtPay('mvp3-instant-background-remover')

document.querySelector('#pay-now').addEventListener('click', function () {
    extpay.openPaymentPage();
});

extpay.getUser().then(user => {
    if (user.paid == false) {
        document.querySelector('#pay-now').addEventListener('click', extpay.openTrialPage())
    }
    const now = new Date();
    const sevenDays = 1000*60*60*24*7 // in milliseconds
    //const thirtySeconds = 30 * 1000  //# in milliseconds
    //const elevenMinutes = 11 * 60 * 1000
    //const threeMinutes = 3 * 60 * 1000
    const trialTime = sevenDays; 
    if (user.trialStartedAt && (now - user.trialStartedAt) < trialTime) {
        const remainingTimeInMinutes = (trialTime - (now - user.trialStartedAt)) / 60000
        document.querySelector('#user-message').innerHTML = `trial active, remaining time ⌛ ${remainingTimeInMinutes.toFixed(2)} minutes`
        document.querySelector('#pay-now').remove()
        document.querySelector('#download-image').removeAttribute('disabled');
        document.querySelector('#download-image').style.display = 'block';
        // user's trial is active
    } else {
        // user's trial is not active
        if (user.subscriptionStatus === 'active') {
            document.querySelector('#user-message').innerHTML = 'User has subscribed ✅'
            document.querySelector('#pay-now').remove()
            document.querySelector('#download-image').removeAttribute('disabled');
            document.querySelector('#download-image').style.display = 'block';
        } else if (user.trialStartedAt == null) {
            document.querySelector('#user-message').innerHTML = 'User has not started a trial yet.'
        }
        else {
            document.querySelector('#user-message').innerHTML = 'Trial ended 🫥, please pay to continue using this extension.'
        }
    }
}).catch(err => {
    document.querySelector('#user-message').innerHTML = "Error fetching data :( Check that your ExtensionPay id is correct and you're connected to the internet"
})

// extpay.onPaid(function() { console.log('popup paid')});

chrome.storage.local.get(['imageState', 'imageData'], function (result) {
    const state = result.imageState || "Image not loaded 🤔";
    const imageData = result.imageData;

    const imageElement = document.getElementById("processed-image");
    const statusElement = document.getElementById("status-message");
    const downloadButton = document.getElementById("download-image");

    if (state === "API working") {
        imageElement.src = "img/waiting.gif";
        statusElement.innerText = "API is working ... Please wait! ⏰";
        downloadButton.setAttribute('disabled', 'true');  // This line disables the button
        chrome.storage.local.set({ iconShouldChange: 'working' });
    } else if (state === "API finished" && imageData) {
        imageElement.src = imageData;
        statusElement.innerText = "Background removal complete! 🥳";
        downloadButton.removeAttribute('disabled');  // This line re-enables the button
        chrome.storage.local.set({ iconShouldChange: 'available' });
    } else {
        statusElement.innerText = "Image not loaded.";
    }

});

// Add a listener to handle the image download
document.getElementById("download-image").addEventListener('click', function () {
    chrome.storage.local.get(['imageData'], function (result) {
        const imageData = result.imageData;
        if (imageData) {
            const link = document.createElement("a");
            link.href = imageData;
            link.download = 'metaverse_professional_backgroundRemove.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });
});






