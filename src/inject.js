if(!window.mainInjectInit) {
  let allProducts = [];

  window.mainInjectInit = true;
  console.log('RUN123')
  var getProductsMessage = (data) => {
    return new Promise((resolve, reject) => {
      let products = []
      chrome.runtime.sendMessage({subject: 'getProducts', data: {stores: data.stores, keywords: data.keywords}}, function(response) {
        resolve(response)
      });
    })
  }

  const appendModal = (products, stores) => {
    products.forEach((p) => {
      stores.forEach((s, i) => {
        console.log(p.storeName)
        console.log(s.name)
        if(p.storeName.toLowerCase() == s.name.toLowerCase()) stores[i].show = true
      })
    })
    $(document).on('click', '.markdown-close-modal', function() {
      $(this).parent().remove()
    })
    $('body').append(`
      <div class="markdown-similar-item-modal">
        <div class="markdown-logo"></div>
        <p class="markdown-close-modal">&#10005</p>
        <div class="markdown-modal-content">
          <h1 class="markdown-similar-item-count">${products.length}<h1>
          <p class="markdown-similar-item-count-desc">Similar clothing items found${products.length > 0 ? ' from ' : ''}${stores.filter((i) => {
            if(!i.show) {
              return false;
            }
            return true;
          }).map((i) => `<a class="markdown-store-link" href="${i.url}" target="_blank">${i.name}</a>`).join(", ")}</p>
        </div>
      </div>
    `)
  }

  function getProducts(stores, keywords)  {
    chrome.runtime.sendMessage({subject: 'getProducts', data: {stores: stores.map((s) => s.id), ...keywords}}, function(response) {
      appendModal(response, stores)
      allProducts = response
    });
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.from === "popup" && request.subject === "productInfo") {
      sendResponse(allProducts);
    }
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

}
