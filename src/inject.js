if(!window.mainInjectInit) {
  let allProducts = [];
  let processingProducts = true;
  let isClothingPage = true;

  window.mainInjectInit = true;
  var getProductsMessage = (data) => {
    return new Promise((resolve, reject) => {
      let products = []
      chrome.runtime.sendMessage({subject: 'getProducts', data: {stores: data.stores, keywords: data.keywords}}, function(response) {
        resolve(response)
      });
    })
  }

  function notClothingPage() {
    isClothingPage = false;
  }

  const updateProducts = (products) => {
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

  const isStorePage = async () => {
    const response = await fetch(chrome.runtime.getURL('/src/stores.json'))
    const stores = await response.json()
    let storePage = stores.filter((s) => {
      if(window.location.host.toLowerCase().includes(s.url.toLowerCase())) {
        return s;
      }
    })
    return await storePage.length > 0 ? true : false
  }

  const isProductPage = async () => {
    const response = await fetch(chrome.runtime.getURL('/src/stores.json'))
    const stores = await response.json()
    let storePage = stores.filter((s) => {
      if(window.location.host.toLowerCase().includes(s.url.toLowerCase())) {
        return s;
      }
    })
    if(storePage.length <= 0) {
      return false
    }

    return $(storePage[0].productPageIdentifier).length > 0
  }

  const appendNotification = (products) => {
    $(document).on('click', '.markdown-close-btn', function() {
      const elem = $(this).parent()
      elem.addClass('slide-out')
      setTimeout(() => {
        elem.remove()
      }, 400)
    })
    $('body').append(`
      <div class="markdown-similar-item-notification">
        <div class="markdown-logo"></div>
        <p class="markdown-notification-msg">We found <span>${products.length}</span> clothing items related to what you're looking at.</p>
        <div class="markdown-close-btn"></div>
      </div>
    `)
  }

  function getProducts(stores, keywords)  {
    chrome.runtime.sendMessage({subject: 'getProducts', data: {stores: stores.map((s) => s.id), ...keywords}}, async function(response) {
      if(processingProducts && await isProductPage() && await isStorePage()) {
        appendNotification(response)
        allProducts = response
        processingProducts = false;
      }
    });
  }

  const getProductInfoStatus = async () => {
    if(! await isStorePage()) {
      processingProducts = false;
      return ({status: "not store page", products: []})
    }

    if(! await isProductPage()) {
      processingProducts = false;
      return ({status: "not product page", products: []})
    }

    if(!isClothingPage) {
      processingProducts = false;
      return ({status: "not product page", products: []})
    }

    if(processingProducts) {
      return ({status: "processing", products: []})
    }

    if(!allProducts || allProducts.length === 0) {
      return ({status: "no products", products: []})
    }


    return ({status: "success", products: await updateProducts(allProducts)})
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.from === "popup" && request.subject === "productInfo") {
      getProductInfoStatus().then(sendResponse)
      return true;
    }
  })
}
