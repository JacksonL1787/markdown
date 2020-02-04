
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
      console.log(allFavorites)
      products.forEach((p) => {
        console.log(p)
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

const sortProducts = (products, string, keywords) => {
  let newProducts = [];
  products.forEach((s) => {
    s.forEach((p) => {
      newProducts.push(p)
    })
  })
  newProducts.forEach((p, i) => {
    let productSimilarity = 0;
    string.split(' ').forEach((s) => {
      console.log(p.name.toLowerCase(), s.toLowerCase())
      if(p.name.toLowerCase().includes(s.toLowerCase())) {
        productSimilarity++
      }
    })
    p.productSimilarity = productSimilarity
  })
  console.log(newProducts)
  newProducts.filter(p => p.productSimilarity > 0)
  newProducts.sort((a, b) => {
    console.log(a, b)
    return b.productSimilarity - a.productSimilarity
  })
  console.log('sorted', newProducts)
  return newProducts
}

const getAllProducts = async (data) => {
  let products = []
  if(data.stores.includes("nordstrom")) products.push(await getNordstromProducts(data.search))
  if(data.stores.includes("hugoboss")) products.push(await getHugoBossProducts(data.search))
  if(data.stores.includes("pacsun")) products.push(await getPacsunProducts(data.search))
  if(data.stores.includes("hollister")) products.push(await getHollisterProducts(data.search))
  if(data.stores.includes("vans")) products.push(await getVansProducts(data.search))
  if(data.stores.includes("nike")) products.push(await getNikeProducts(data.search))
  if(data.stores.includes("americaneagle")) products.push(await getAmericanEagleProducts(data.search))
  if(data.stores.includes("adidas")) products.push(await getAdidasProducts(data.search))
  if(data.stores.includes("urbanoutfitters")) products.push(await getUrbanOutfittersProducts(data.search))
  if(data.stores.includes("victoriassecret")) products.push(await getVictoriaSecretProducts(data.search))
  if(data.stores.includes("brandymelville")) products.push(await getBrandyMelvilleProducts(data.search))
  if(data.stores.includes("abercrombiefitch")) products.push(await getAbercrombieFitchProducts(data.search))
  if(data.stores.includes("oldnavy")) products.push(await getOldNavyProducts(data.search))
  if(data.stores.includes("zumiez")) products.push(await getZumiezProducts(data.search))
  if(data.stores.includes("gap")) products.push(await getGapProducts(data.search))
  if(data.stores.includes("bananarepublic")) products.push(await getBananaRepublicProducts(data.search))
  if(data.stores.includes("jcrew")) products.push(await getJCrewProducts(data.search))
  if(data.stores.includes("hm")) products.push(await getHMProducts(data.search))
  if(data.stores.includes("bloomingdales")) products.push(await getBloomingDaleProducts(data.search))
  if(data.stores.includes("billabong")) products.push(await getBillabongProducts(data.search))
  if(data.stores.includes("nordstromrack")) products.push(await getNordstromRackProducts(data.search))
  if(data.stores.includes("northface")) products.push(await getNorthFaceProducts(data.search))
  if(data.stores.includes("levis")) products.push(await getLeviProducts(data.search))
  if(data.stores.includes("champion")) products.push(await getChampionProducts(data.search))
  if(data.stores.includes("pink")) products.push(await getPinkProducts(data.search))
  if(data.stores.includes("guess")) products.push(await getGuessProducts(data.search))
  if(data.stores.includes("asos")) products.push(await getAsosProducts(data.search))
  if(data.stores.includes("target")) products.push(await getTargetProducts(data.search))
  products = await sortProducts(products, data.string, data.keywords)
  products = await compareFavoritesToProducts(products)
  return products;
}

async function testGetStore(store, search) {
  let data = {
    stores: [store],
    search: search.split(' '),
    string: search.toLowerCase()
  }
  console.log(await getAllProducts(data))
}

function testAjax() {
  $.getJSON('http://anyorigin.com/get?url=http://www.google.com&callback=?', function(data){
    var siteContents = data.contents;
    alert((/<title>(.*?)<\/title>/m).exec(siteContents)[1]);
  });
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
      if(refinedURL.includes(store.url)) {
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
