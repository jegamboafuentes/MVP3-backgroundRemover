importScripts('ExtPay.js')

// To test payments, replace 'sample-extension' with the ID of
// the extension you registered on ExtensionPay.com. You may
// need to uninstall and reinstall the extension.
// And don't forget to change the ID in popup.js too!
var extpay = ExtPay('test5');
extpay.startBackground(); // this line is required to use ExtPay in the rest of your extension

extpay.getUser().then(user => {
    console.log('ExtPay user:')
    console.log(user)
})

chrome.runtime.onInstalled.addListener(async () => {
    let url = chrome.runtime.getURL("welcome/hello.html");
    let tab = await chrome.tabs.create({ url });
    console.log(`Created tab ${tab.id}`);
});

const API_URL = 'https://sdk.photoroom.com/v1/segment';
//const API_KEY = '123'
const API_KEY = '81c62101741a6188f31e26654afecfa54627f1ef'; // Replace with your actual API key

const NEW_API_URL = 'https://image-background-remove-tool-4jgsa4zbxq-uc.a.run.app/api/removebg';
const NEW_API_KEY = '';  // The new API key goes here, if any


chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'removeBackground',
        title: 'Remove Background',
        contexts: ['image']
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'removeBackground') {
        const imageUrl = info.srcUrl;
        chrome.storage.local.set({ imageState: "API working" });
        removeBackground(imageUrl);
    }
});

async function removeBackground(imgUrl) {
    console.log(imgUrl);
    try {
        const imageBlob = await fetch(imgUrl).then(res => res.blob());

        const formData = new FormData();
        formData.append('image_file', imageBlob, 'image.jpg');

        const response = await fetch(NEW_API_URL, {
            method: 'POST',
            headers: {
                'X-Api-Key': NEW_API_KEY, 
                'MODEL': 'u2net'
            },
            body: formData
        });
        console.log(response);
        const resultBlob = await response.blob();
        const reader = new FileReader();

        reader.readAsDataURL(resultBlob);
        reader.onloadend = function () {
            const base64data = reader.result;
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    //func: downloadImage,
                    func: notDownloadImage,
                    args: [base64data]
                });
            chrome.storage.local.set({ imageState: "API finished", imageData: base64data });
            });
        }
    } catch (error) {
        console.error("Error removing background:", error);
    }
}

function downloadImage(dataURL) {
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = 'MP_backgroundRemover.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function notDownloadImage(dataURL) {}