// Replace 'sample-extension' with the id of the extension you
// registered on ExtensionPay.com to test payments. You may need to
// uninstall and reinstall the extension to make it work.
// Don't forget to change the ID in background.js too!
const extpay = ExtPay('test5')

document.querySelector('#pay-now').addEventListener('click', function () {
    extpay.openPaymentPage();
});

extpay.getUser().then(user => {
    if (user.paid == false) {
        document.querySelector('#pay-now').addEventListener('click', extpay.openTrialPage())
    }
    const now = new Date();
    //const sevenDays = 1000*60*60*24*7 // in milliseconds
    //const thirtySeconds = 30 * 1000  //# in milliseconds
    const elevenMinutes = 11 * 60 * 1000
    //const threeMinutes = 3 * 60 * 1000
    if (user.trialStartedAt && (now - user.trialStartedAt) < elevenMinutes) {
        const remainingTimeInMinutes = (elevenMinutes - (now - user.trialStartedAt)) / 60000
        document.querySelector('#user-message').innerHTML = `trial active, remaining time ⌛ ${remainingTimeInMinutes.toFixed(2)} minutes`
        document.querySelector('button').remove()
        // user's trial is active
    } else {
        // user's trial is not active
        if (user.paid) {
            document.querySelector('#user-message').innerHTML = 'User has paid ✅'
            document.querySelector('button').remove()
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
        imageElement.src = "img/waiting.png";
        statusElement.innerText = "API is working ... Please wait! ⏰";
    } else if (state === "API finished" && imageData) {
        imageElement.src = imageData;
        statusElement.innerText = "Background removal complete! 🥳";
        downloadButton.style.display = "block"; // Show the download button
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
            link.download = 'processed_image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });
});






