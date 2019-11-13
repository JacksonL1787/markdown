
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

const runInject = (path) => {
  console.log(path)
  chrome.tabs.executeScript(null, {file: '/src/jquery.js'}, () => {
    chrome.tabs.executeScript(null, {file:`/src/storeInjectFiles/main.js`}, () => {
      chrome.tabs.executeScript(null,{file:`/src/${path}`});
    })
  })
}

const compareFavoritesToProducts = (products) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['favorites'], (data) => {
      let allFavorites = data['favorites']?data['favorites']:[];
      if(allFavorites.length < 1) resolve(products);
      allFavorites = allFavorites.map(f => f.link)
      products.forEach((p) => {
        if(allFavorites.includes(p.link)) {
          p.favorite = true
        } else {
          p.favorite = false
        }
      })
      resolve(products)
    })
  })
}

const getAllProducts = async (data) => {
  let products = [];
  if(data.stores.includes("nordstrom")) products = [...products, ...await getNordstromProducts(data.keywords)]
  if(data.stores.includes("hugoboss")) products = [...products, ...await getHugoBossProducts(data.keywords)]
  if(data.stores.includes("pacsun")) products = [...products, ...await getPacsunProducts(data.keywords)]
  if(data.stores.includes("hollister")) products = [...products, ...await getHollisterProducts(data.keywords)]
  if(data.stores.includes("vans")) products = [...products, ...await getVansProducts(data.keywords)]
  products = await compareFavoritesToProducts(products)
  console.log(products)
  return products
}

const handleURL = (url, tabId) => {
  chrome.tabs.executeScript(null, {file: '/src/jquery.js'}, () => {
    chrome.tabs.executeScript(null,{file:`/src/inject.js`});
  })
  let refinedURL = getRefinedURL(url)
  $.getJSON( "/src/stores.json", async data => {
    let currentStore;
    data.forEach((store)=> {
      if(refinedURL === store.url) {
        currentStore = store
      }
    })
    if(!currentStore) {
      if(!window.initDone) handleIcon(false, tabId)
      return;
    }
    runInject(currentStore.inject)
    handleIcon(true, tabId)
    window.initDone = true
  });
}



chrome.webNavigation.onHistoryStateUpdated.addListener(function(tab) {
    window.initDone = false
    handleURL(tab.url, tab.tabId)
});

chrome.webNavigation.onDOMContentLoaded.addListener(function(tab) {
    handleURL(tab.url, tab.tabId)
})

chrome.tabs.onActivated.addListener(function(tab) {
  chrome.tabs.getSelected(null, function(tab) {
    window.initDone = false
    handleURL(tab.url, tab.tabId)
  })
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.subject === 'getProducts') {
    getAllProducts(request.data).then((products) => {
      sendResponse(products)
    })
    return true;
  }

});
