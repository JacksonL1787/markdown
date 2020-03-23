let allProducts = undefined;

function getSearchKeywords (string, keywords) {
  const searchInfo = [];
  keywords.gender.some((i) => {
    if(string.includes(i)) {
      searchInfo.push({
        word: i,
        type: "gender"
      })
      return true;
    }
  })
  keywords.color.some((i) => {
    let addedColor = false;
    i.word.some((w) => {
      if(string.includes(w)) {
        addedColor = true
        searchInfo.push({
          word: i.pointToDifferentWord ? i.similarTo : w,
          type: "color"
        })
        return true;
      }
    })
    if(addedColor) return true;
  })
  keywords.material.some((i) => {
    if(string.includes(i)) {
      searchInfo.push({
        word: i,
        type: "material"
      })
      return true;
    }
  })
  keywords.pattern.some((i) => {
    if(string.includes(i)) {
      searchInfo.push({
        word: i,
        type: "pattern"
      })
      return true;
    }
  })
  keywords.descriptor.some((i) => {
    if(string.includes(i)) {
      searchInfo.push({
        word: i,
        type: "descriptor"
      })
      return true;
    }
  })
  keywords.bannedWords.some((i) => {
    if(string.includes(i)) {
      searchInfo.push({
        word: '',
        type: "banned"
      })
      return true;
    }
  })
  keywords.type.some((i) => {
    let addedType = false;
    i.word.some((w) => {
      if(w[0] === " " && string.includes(w)) {
        addedType = true;
        searchInfo.push({
          word: i.pointToDifferentWord ? i.similarTo : w,
          type: "type"
        })
        return true;
      }
      if(string.includes(w || w.replace(/ /g, '') || w.replace(/ /, '-'))) {
        addedType = true;
        searchInfo.push({
          word: i.pointToDifferentWord ? i.similarTo : w,
          type: "type"
        })
        return true;
      }
    })
    if(addedType) return true;
  })
  let search = searchInfo.map(i => i.word)
  return {string: search, keywords: keywords, info: searchInfo}
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

const appendNotification = (products) => {
  if(!products) {
    console.log(products);
    return;
  }
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
      if(p.name.toLowerCase().includes(s.toLowerCase())) {
        productSimilarity++
      }
    })
    p.productSimilarity = productSimilarity
  })
  newProducts.filter(p => p.productSimilarity > 0)
  newProducts.sort((a, b) => {
    return b.productSimilarity - a.productSimilarity
  })
  return newProducts
}

async function searchSimilarStores(data) {
  let products = []
  let hasNoType = data.search.info.filter(x => x.type === "type").length <= 0
  let hasDuplicateType = data.search.info.filter(x => x.type === "type").length > 1
  let hasBannedWord = data.search.info.filter(x => x.type === "banned").length > 0
  let hasNoColor = data.search.info.filter(x => x.type === "color").length <= 0
  //let tabUrl = data.url;
  console.log(data)
  console.log(hasNoType, hasDuplicateType, hasBannedWord, hasNoColor)
  if(hasNoType) {
    // Sentry.withScope(scope => {
    //   scope.setExtra("Product Link", tabUrl)
    //   scope.setExtra("Product Search", data.search.info)
    //   scope.setExtra("Product String", data.string)
    //   Sentry.captureException(new Error("Found No Type"))
    // });
    return [];
  }
  if(hasDuplicateType) {
    // Sentry.withScope(scope => {
    //   scope.setExtra("Product Link", tabUrl)
    //   scope.setExtra("Product Search", data.search.info)
    //   scope.setExtra("Product String", data.string)
    //   Sentry.captureException(new Error("Found Duplicate Types"))
    // });
    return [];
  }
  if(hasNoColor) {
    // Sentry.withScope(scope => {
    //   scope.setExtra("Product Link", tabUrl)
    //   scope.setExtra("Product Search", data.search.info)
    //   scope.setExtra("Product String", data.string)
    //   Sentry.captureException(new Error("Found no product color"))
    // });
    return [];
  }
  if(hasBannedWord) {
    return [];
  }
  if(data.searchStores.includes("nordstrom")) products.push(await getNordstromProducts(data.search.string))
  if(data.searchStores.includes("hugoboss")) products.push(await getHugoBossProducts(data.search.string))
  if(data.searchStores.includes("pacsun")) products.push(await getPacsunProducts(data.search.string))
  if(data.searchStores.includes("hollister")) products.push(await getHollisterProducts(data.search.string))
  if(data.searchStores.includes("vans")) products.push(await getVansProducts(data.search.string))
  if(data.searchStores.includes("nike")) products.push(await getNikeProducts(data.search.string))
  if(data.searchStores.includes("americaneagle")) products.push(await getAmericanEagleProducts(data.search.string))
  if(data.searchStores.includes("adidas")) products.push(await getAdidasProducts(data.search.string))
  if(data.searchStores.includes("urbanoutfitters")) products.push(await getUrbanOutfittersProducts(data.search.string))
  if(data.searchStores.includes("victoriassecret")) products.push(await getVictoriaSecretProducts(data.search.string))
  if(data.searchStores.includes("brandymelville")) products.push(await getBrandyMelvilleProducts(data.search.string))
  if(data.searchStores.includes("abercrombiefitch")) products.push(await getAbercrombieFitchProducts(data.search.string))
  if(data.searchStores.includes("oldnavy")) products.push(await getOldNavyProducts(data.search.string))
  if(data.searchStores.includes("zumiez")) products.push(await getZumiezProducts(data.search.string))
  if(data.searchStores.includes("gap")) products.push(await getGapProducts(data.search.string))
  if(data.searchStores.includes("bananarepublic")) products.push(await getBananaRepublicProducts(data.search.string))
  if(data.searchStores.includes("jcrew")) products.push(await getJCrewProducts(data.search.string))
  if(data.searchStores.includes("hm")) products.push(await getHMProducts(data.search.string))
  if(data.searchStores.includes("bloomingdales")) products.push(await getBloomingDaleProducts(data.search.string))
  if(data.searchStores.includes("billabong")) products.push(await getBillabongProducts(data.search.string))
  if(data.searchStores.includes("nordstromrack")) products.push(await getNordstromRackProducts(data.search.string))
  if(data.searchStores.includes("northface")) products.push(await getNorthFaceProducts(data.search.string))
  if(data.searchStores.includes("levis")) products.push(await getLeviProducts(data.search.string))
  if(data.searchStores.includes("champion")) products.push(await getChampionProducts(data.search.string))
  if(data.searchStores.includes("pink")) products.push(await getPinkProducts(data.search.string))
  if(data.searchStores.includes("guess")) products.push(await getGuessProducts(data.search.string))
  if(data.searchStores.includes("asos")) products.push(await getAsosProducts(data.search.string))
  if(data.searchStores.includes("target")) products.push(await getTargetProducts(data.search.string))
  products = await sortProducts(products, data.string, data.search.keywords)
  products = await compareFavoritesToProducts(products)
  return products;
}

async function getPageData() {
  if(allProducts && allProducts.length > 0) {
    return await updateProducts(allProducts);
  }

  const storesRes = await fetch(chrome.runtime.getURL('/src/stores.json'))
  const keywordsRes = await fetch(chrome.runtime.getURL('/src/keywords.json'))
  const keywords = await keywordsRes.json()
  const stores = await storesRes.json()
  let store = ""
  stores.forEach((s) => {
    if(window.location.host.includes(s.url)) {
      store = s
    }
  })
  console.log(store.getInfoFunction)
  await eval(store.getInfoFunction)
}

async function getProducts(data) {
  let products = await searchSimilarStores(data)
  allProducts = products
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.from === "popup" && request.subject === "getProducts") {
    updateProducts(allProducts).then(sendResponse);
    return true;
  }
})
