
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

const sortProducts = (products) => {
  let allProducts = 0;
  products.forEach((p) => {
    allProducts += p.length
  })
  const newProducts = [];
  for(var i = 0; i < allProducts; i++) {
    let randomStore = Math.floor(Math.random() * products.length);
    while(!products[randomStore][0]) {
      randomStore = Math.floor(Math.random() * products.length);
    }
    newProducts.push(products[randomStore][0])
    products[randomStore].splice(0, 1)
  }
  return newProducts
}

const getAllProducts = async (data) => {
  let products = [];
  if(data.stores.includes("nordstrom")) products.push(await getNordstromProducts(data.keywords))
  if(data.stores.includes("hugoboss")) products.push(await getHugoBossProducts(data.keywords))
  if(data.stores.includes("pacsun")) products.push(await getPacsunProducts(data.keywords))
  if(data.stores.includes("hollister")) products.push(await getHollisterProducts(data.keywords))
  if(data.stores.includes("vans")) products.push(await getVansProducts(data.keywords))
  if(data.stores.includes("forever21")) products.push(await getForever21Products(data.keywords))
  products = await sortProducts(products)
  products = await compareFavoritesToProducts(products)
  return products;
}

const handleURL = (url, tabId) => {
  chrome.tabs.executeScript(null, {file: '/src/jquery.js'}, () => {
    chrome.tabs.executeScript(null, {file: '/src/fa.js'}, () => {
      chrome.tabs.insertCSS(tabId, {file: "/src/background.css"});
      chrome.tabs.executeScript(null,{file:`/src/inject.js`});
    })
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

chrome.webNavigation.onCommitted.addListener(function(tab) {
    handleURL(tab.url, tab.tabId)
    console.log(tab.url)
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
