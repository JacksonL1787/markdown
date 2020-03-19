
const handleIcon = (active, tabId) => {
  if(active) {
    chrome.browserAction.setIcon({path: "/icons/markdown-logo-active128.png", tabId: tabId});
  } else {
    chrome.browserAction.setIcon({path: "/icons/markdown-logo128.png", tabId: tabId});
  }
}

const getRefinedURL = (url) => {
  return `${url.split('/')[2]}`
}

const handleURL = (url, tabId) => {
  chrome.tabs.executeScript(null, {file: '/src/apis/jquery.js'}, () => {
    chrome.tabs.executeScript(null, {file: '/src/apis/fa.js'}, () => {
      chrome.tabs.insertCSS(tabId, {file: "/src/background.css"});
      chrome.tabs.executeScript(null,{file: `/src/final-min.js`});
    })
  })

  let refinedURL = getRefinedURL(url)
  $.getJSON("/src/stores.json", async data => {
    let currentStore;


    data.forEach((store)=> {
      if(refinedURL.includes(store.url)) {
        currentStore = store
      }
    })
    if(!currentStore) {
      if(!window.initDone) {
        handleIcon(false, tabId)
      }
      return;
    }
    handleIcon(true, tabId)
    window.initDone = true
  });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  window.initDone = false
  handleURL(tab.url, tabId)
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.subject === 'getProducts') {
    getAllProducts(request.data).then((products) => {
      sendResponse(products)
    })
    return true;
  }
});
