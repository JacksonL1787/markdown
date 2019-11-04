var getProductsMessage = (data) => {
  return new Promise((resolve, reject) => {
    let products = []
    chrome.runtime.sendMessage({subject: 'getProducts', data: {stores: data.stores, keywords: data.keywords}}, function(response) {
      resolve(response)
    });
  })
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if(request.from === 'popup' && request.subject === 'setFavorite') {
    if(!window.init) {
      window.init = true
      chrome.storage.sync.get(['favorites'], (data) => {
        const allFavorites = data['favorites']?data['favorites']:[];
        allFavorites.unshift(request.product)
        chrome.storage.sync.set({'favorites': allFavorites})
        sendResponse(allFavorites)
      })
      setTimeout(() => {
        window.init = false
      }, 1)
      return true;
    }
  }

  if(request.from === 'popup' && request.subject === 'removeFavorite') {
    if(!window.init) {
      window.init = true
      chrome.storage.sync.get(['favorites'], (data) => {
        if(!data['favorites']) return;
        allFavorites = data['favorites']
        allFavorites.forEach((f, i) => {
          if(f.link === request.product) {
            allFavorites.splice(i, 1)
          }
        })
        chrome.storage.sync.set({'favorites': allFavorites})
        sendResponse(allFavorites)
      })
      setTimeout(() => {
        window.init = false
      }, 1)
      return true;
    }
  }

  if(request.from === 'popup' && request.subject === 'getFavorites') {
    if(!window.init) {
      window.init = true
      chrome.storage.sync.get(['favorites'], (data) => {
        allFavorites = data['favorites']?data['favorites']:[];
        console.log(allFavorites)
        sendResponse(allFavorites)
      })
      setTimeout(() => {
        window.init = false
      }, 1)
      return true;
    }
  }

  if(request.from === 'popup' && request.subject === 'getProductsByStore') {
    if(!window.init) {
      window.init = true
      const searchText = request.data.keywords
      request.data.stores.pop()
      request.data.keywords = request.data.keywords.split(' ')
      console.log(request.data)
      getProductsMessage(request.data).then((data) => {
        sendResponse({products: data, search: searchText})
      })
      setTimeout(() => {
        window.init = false
      }, 1)
      return true;
    }
  }
})
