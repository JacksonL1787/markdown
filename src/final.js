if(!window.mainInjectInit) {
  window.mainInjectInit = true;
var storeInformation = {
  nordstrom: {id: "nordstrom", name: "Nordstrom", url: "https://shop.nordstrom.com"},
  vans: {id: "vans", name: "Vans", url: "https://vans.com"},
  pacsun: {id: "pacsun", name: "Pacsun", url: "https://pacsun.com"},
  hollister: {id: "hollister", name: "Hollister", url: "https://hollister.com"},
  nike: {id: "nike", name: "Nike", url: "https://www.nike.com"},
  americaneagle: {id: "americaneagle", name: "American Eagle", url: "https://www.ae.com"},
  adidas: {id: "adidas", name: "Adidas", url: "https://www.adidas.com"},
  urbanoutfitters: {id: "urbanoutfitters", name: "Urban Outfitters", url: "https://www.urbanoutfitters.com"},
  victoriassecret: {id: "victoriassecret", name: "Victoria's Secret", url: "https://www.victoriassecret.com"},
  brandymelville: {id: "brandymelville", name: "Brandy Melville", url: "https://www.brandymelvilleusa.com"},
  abercrombiefitch: {id: "abercrombiefitch", name: "Abercrombie & Fitch", url: "https://www.abercrombie.com"},
  hottopic: {id: "hottopic", name: "Hot Topic", url: "https://www.hottopic.com"},
  oldnavy: {id: "oldnavy", name: "Old Navy", url: "https://oldnavy.gap.com"},
  zumiez: {id: "zumiez", name: "Zumiez", url: "https://www.zumiez.com"},
  gap: {id: "gap", name: "Gap", url: "https://www.gap.com"},
  bananarepublic: {id: "bananarepublic", name: "Banana Republic", url: "https://bananarepublic.gap.com"},
  jcrew: {id: "jcrew", name: "J.Crew", url: "https://www.jcrew.com"},
  hm: {id: "hm", name: "H&M", url: "https://www2.hm.com"},
  bloomingdales: {id: "bloomingdales", name: "Bloomingdale's", url: "https://www.bloomingdales.com"},
  billabong: {id: "billabong", name: "Billabong", url: "https://www.billabong.com"},
  nordstromrack: {id: "nordstromrack", name: "Nordstrom Rack", url: "https://www.nordstromrack.com"},
  northface: {id: "northface", name: "North Face", url: "https://www.thenorthface.com"},
  levis: {id: "levis", name: "Levi's", url: "https://www.levi.com"},
  champion: {id: "champion", name: "Champion", url: "https://www.champion.com"},
  pink: {id: "pink", name: "PINK", url: "https://www.victoriassecret.com/pink"},
  guess: {id: "guess", name: "Guess", url: "https://shop.guess.com"},
  asos: {id: "asos", name: "ASOS", url: "https://www.asos.com"},
  target: {id: "target", name: "Target", url: "https://www.target.com"},
  hugoboss: {id: "hugoboss", name: "Hugo Boss", url: "https://www.hugoboss.com"},
}

async function productInfoAbercrombieFitch() {
  let string = ''
  let gender = ''
  console.log($('.breadcrumb-container .breadcrumbs-link').text())
  if($('.breadcrumb-container .breadcrumbs-link').text().toLowerCase().includes("womens")) {
    gender = "Womens"
  } else if ($('.breadcrumb-container .breadcrumbs-link').text().toLowerCase().includes("mens")) {
    gender = "Mens"
  }
  string += ' ' + gender
  string += $('.product-swatches .selected .product-attrs__shown-in span').text().replace('Shown in', '')
  string += $('.product-page__swatches-attributes .product-attrs__shown-in.selected-swatch__label').text().replace('Shown in', '')
  string += ' ' + $('.product-title-main-header').text()
  string += $('.short-description').text()
  string = string.toLowerCase()
  console.log(string)
  const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
  const keywords = await response.json()
  const data = {
    searchStores: [
      storeInformation.hollister.id,
      storeInformation.urbanoutfitters.id,
      storeInformation.abercrombiefitch.id
    ],
    url: window.location.href,
    search: getSearchKeywords(string, keywords, ),
    string: string
  }
  console.log(data)
  getProducts(data);
}
async function getNordstromProducts(keywords) {
  const products = []
  await $.get(`https://shop.nordstrom.com/sr?origin=keywordsearch&keyword=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('._1AOd3')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('._5lXiG ').text(),
        price: $(this).find('._3bi0z ._3wu-9').text().split('$')[1].replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,""),
        sale: $(this).find('._18N5Q').length > 0 ? $(this).find('._18N5Q ._3wu-9').text().split('$')[1].replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : false,
        img: $(this).find('.TDd9E').attr('src'),
        link: `https://shop.nordstrom.com${$(this).find('._1av3_').attr('href')}`.split('?origin')[0],
        storeName: 'Nordstrom'
      }
      tempObj.price = tempObj.price.replace(/\u2013/g, '')
      products.push(tempObj)
    })
  })
  return products
}

async function getHugoBossProducts(keywords) {
  const products = []
  await $.get(`https://www.hugoboss.com/us/search?q=${keywords.join('%20').replace(/ /g, '%20')}`, function(data) {
    let elements = $(data).find('.search-result-content .search-result-items__grid-tile')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.product-tile__productInfoWrapper').text().replace(/BOSS|HUGO|by|(\r\n|\n|\r)/gm,""),
        price: $(this).find('.product-tile__offer .price-sales.price-sales--red').length > 0 ? $(this).find('.product-tile__offer .price-standard s').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : $(this).find('.product-tile__offer .price-sales').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,""),
        sale: $(this).find('.product-tile__offer .price-sales.price-sales--red').length > 0 ? $(this).find('.product-tile__offer .price-sales.price-sales--red').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : false,
        img: $(this).find('.product-tile__image').attr('data-src').replace(/({width})/g, '240').replace(/({quality})/g, '45'),
        link: `https://www.hugoboss.com${$(this).find('.product-tile__link').attr('data-url')}`,
        storeName: 'Hugo Boss'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getPacsunProducts(keywords) {
  const products = []
  try {
    await $.get(`https://www.pacsun.com/on/demandware.store/Sites-pacsun-Site/default/Search-Show?stype=snap&etype=submit&q=${keywords.join('%20').replace(/ /g, '%20')}`, function(data) {
      let elements = $(data).find('#primary .product-tile')
      elements.each(function() {
        const tempObj = {
          name: $(this).find('.product-name .name-link').text().replace(/(\r\n|\n|\r)/gm,""),
          price: $(this).find('.price-standard').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,""),
          sale: $(this).find('.price-promo').length > 0 ? $(this).find('.price-promo').text().replace(/(\t|\r\n|\n|\r)|[$| |,]|Now/gm,"") : false,
          img: $(this).find('.product-image img').attr('src'),
          link: $(this).find('.product-name .name-link').attr('href'),
          storeName: 'Pacsun'
        }
        products.push(tempObj)
      })
    })
  } catch (e) {
    throw e;
  }
  return products;
}

async function getHollisterProducts(keywords) {
  console.log(keywords)
  const products = []
  await $.get(`https://www.hollisterco.com/shop/us/search?departmentCategoryId=10006&searchTerm=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('.products-container .product-card--hol')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.product-card__name').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.product-price-text[data-state="discount"]').length > 0 ?
               $(this).find('.product-price-text[data-state="original"]').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") :
               $(this).find('.product-price-text').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,""),
        sale: $(this).find('.product-price-text[data-state="discount"]').length > 0 ? $(this).find('.product-price-text[data-state="discount"]').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : false,
        img: $(this).find('.product-card__image-wrap .product-card__image').attr('data-src').replace('imageType', 'prod1'),
        link: 'https://www.hollisterco.com'+$(this).find('.product-card__name').attr('href'),
        storeName: 'Hollister'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getVansProducts(keywords) {
  const products = []
  await $.get(`https://www.vans.com/webapp/wcs/stores/servlet/VFSearchDisplay?storeId=10153&catalogId=10703&langId=-1&beginIndex=0&searchSource=Q&sType=SimpleSearch&searchTerm=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('#catalog-results .product-block')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.product-block-name-wrapper').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.product-block-price').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,""),
        img: $(this).find('.product-block-views-selected-view-main-image').attr('srcset').replace('//', 'https://'),
        link: $(this).find('.product-block-name-link').attr('href'),
        storeName: 'Vans'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getNikeProducts(keywords) {
  const products = []
  await $.get(`https://www.nike.com/w?q=${keywords.join('%20').replace(/ /g, '%20')}&vst=${keywords.join('%20').replace(/ /g, '%20')}`, function(data) {
    let elements = $(data)
    elements.each(function() {
      if($(this).html()) {
        if($(this).html().toString().startsWith('window.INITIAL_REDUX_STATE=')) {
          let data = JSON.parse($(this).html().toString().replace(/(\t|\r\n|\n|\r)|;|window.INITIAL_REDUX_STATE=/gm,"")).Wall.products
          data.forEach((i) => {
            const tempObj = {
              name: i.title.replace(/(\r\n|\n|\r)/gm,"") + ' ' + i.subtitle,
              price: i.price.fullPrice,
              sale: i.price.discounted ? i.currentPrice : false,
              link: i.url.replace('{countryLang}', 'https://nike.com'),
              img: i.image,
              storeName: 'Nike'
            }
            products.push(tempObj)
          })
        }
      }
    })
  })
  return products
}

async function getAmericanEagleProducts(keywords) {
  const products = []
  await $.get(`https://www.ae.com/s/${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('.search-products .product-tile')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.product-name').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.product-list-price').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,""),
        sale: $(this).find('.product-sale-price').length > 0 ? $(this).find('.product-sale-price').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : false,
        img: `https://s7d2.scene7.com/is/image/aeo/${$(this).attr('data-product-id')}_f?$cat-main_large$`,
        link: 'https://www.ae.com/'+$(this).find('.tile-link').attr('href').split('?nvid')[0],
        storeName: 'American Eagle'
      }
      products.push(tempObj)
    })
  })
  return products
}



async function getAdidasProducts(keywords) {
  const getPrice = (productID) => {
    return new Promise(resolve => {
      fetch(`https://www.adidas.com/api/search/product/${productID}`).then((body) => {
        resolve(body.json())
      })
    })
  }
  const getProducts = () => {
    let products = []
    return new Promise(resolve => {
      $.get(`https://www.adidas.com/api/search/tf/query?sitePath=us&query=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
        data.itemList.items.forEach(async (i, index) => {
          const tempObj = {
            name: i.displayName,
            link: 'https://www.adidas.com'+i.link,
            img: i.image.src,
            storeName: 'Adidas'
          }
          let productData = await getPrice(i.productId)
          tempObj.price = productData.price
          tempObj.sale = productData.price === productData.salePrice ? false : productData.salePrice
          products.push(tempObj)
          if(data.itemList.items.length == (index + 1)) resolve(products)
        })
      })
    })
  }
  return await getProducts()
}

async function getUrbanOutfittersProducts(keywords) {
  const products = []
  console.log(keywords)
  console.log(`https://www.urbanoutfitters.com/search?q=${keywords.join('+').replace(/ /g, '+')}`)
  await $.get(`https://www.urbanoutfitters.com/search?q=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    console.log(data)
    let elements = $(data).find('.c-pwa-tile-tiles .c-pwa-tile-grid-inner')
    console.log($(data).find('.c-pwa-tile-view-outer'))
    console.log($(data))
    elements.each(function() {
      console.log($(this))
      const tempObj = {
        name: $(this).find('.c-pwa-product-tile__heading').text().replace(/(\r\n|\n|\r)|  /gm,""),
        price: $(this).find('.c-pwa-product-price__original').length > 0 ? $(this).find('.c-pwa-product-price__original').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : $(this).find('.c-pwa-product-price__current').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,""),
        sale: $(this).find('.c-pwa-product-price__original').length > 0 ? $(this).find('.c-pwa-product-price__current').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : false,
        img: `http://s7d5.scene7.com/is/image/UrbanOutfitters/${$(this).find('.c-pwa-swatch__input[name="selectedColor"]').attr('id').split('_')[0]}_${$(this).find('.c-pwa-swatch__input[name="selectedColor"]').attr('value')}_d?$medium$&qlt=80&fit=constrain`,
        link: 'https://www.urbanoutfitters.com'+$(this).find('.c-pwa-product-tile__link').attr('href').split('?category')[0],
        storeName: 'Urban Outfitters'
      }
      products.push(tempObj)
    })
  })
  console.log('urban', products)
  return products
}

async function getVictoriaSecretProducts(keywords) {
  const products = []
  if(keywords.includes('men' || 'male' || 'man' || 'mens' || 'kid' || 'boy' || 'boys' || 'child' || 'children')) return []
  await $.get(`https://api.victoriassecret.com/keywordsearch/v4/search?brand=vs&q=${keywords.join('%20').replace(/ /g, '%20')}&searchLocation=header`, function(data) {
    data.products.forEach((i) => {
      const tempObj = {
        name: i.name.replace(/(\r\n|\n|\r)|  /gm,""),
        price: i.price.replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,""),
        sale: i.salePrice ? i.salePrice.replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : false,
        img: 'https://www.victoriassecret.com/p/220x293/' + i.productImages[0] + '.jpg' ,
        link: i.url.split('?')[0],
        storeName: 'Victoria\'s Secret'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getBrandyMelvilleProducts(keywords) {
  const products = []
  if(keywords.includes('men' || 'male' || 'man' || 'mens' || 'kid' || 'boy' || 'boys' || 'child' || 'children')) return []
  await $.get(`https://www.brandymelvilleusa.com/catalogsearch/result/?q=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('.category-products .product-item')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.product-item-name').find('a').text().replace(/(\r\n|\n|\r)|  /gm,""),
        price: $(this).find('.price').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,""),
        sale: false,
        img: $(this).find('.product-item-image a img').first().attr('src'),
        link: $(this).find('.quickViewContainer').attr('href'),
        storeName: 'Brandy Melville'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getAbercrombieFitchProducts(keywords) {
  const products = []
  await $.get(`https://www.abercrombie.com/shop/us/search?departmentCategoryId=10000&searchTerm=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    if($(data).find('.rs-search-detail__additional-info').text().toLowerCase().replace(/(\r\n|\n|\r)|  /gm,"").includes('no match found')) return;
    let elements = $(data).find('.search-grid .product-card--anf')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.product-card__name').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.product-price-text[data-state="discount"]').length > 0 ? $(this).find('.product-price-text[data-state="original"]').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : $(this).find('.product-price-text').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,""),
        sale: $(this).find('.product-price-text[data-state="discount"]').length > 0 ? $(this).find('.product-price-text[data-state="discount"]').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : false,
        img: $(this).find('.product-card__image').attr('data-src').replace('imageType', 'prod1'),
        link: 'https://www.abercrombie.com' + $(this).find('.product-card__image-link').attr('href'),
        storeName: 'Abercrombie & Fitch'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getHotTopicProducts(keywords) {
  const products = []
  await $.get(`https://www.hottopic.com/search?q=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('#search-result-items .grid-tile')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.name-link').text().replace(/(\r\n|\n|\r)/gm,""),
        price: (($(this).find('.price-sales').length > 0 ? $(this).find('.price-original').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : $(this).find('.price-standard').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"")) || $(this).find('.product-discounted-price').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"")).split('-')[0],
        sale: $(this).find('.price-sales').length > 0 ? $(this).find('.price-sales').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"").split('-')[0] : false,
        img: $(this).find('.first-image').attr('src'),
        link: $(this).find('.name-link').attr('href'),
        storeName: 'Hot Topic'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getOldNavyProducts(keywords) {
  const products = []
  await $.get(`https://brm-core-0.brsrvr.com/api/v1/core/?account_id=6063&auth_key=&domain_key=oldnavy&request_id=2803065648391&_br_uid_2=uid%3D3953529282324%3Av%3D12.0%3Ats%3D1574719946739%3Ahc%3D5&url=https://oldnavy.gap.com/index.html%23brm-search%3Frequest_type=search&search_type=keyword&q=${keywords.join('%20').replace(/ /g, '%20')}&l=${keywords.join('%20').replace(/ /g, '%20')}&br_origin=searchbox&realm=prod&ref_url=https://oldnavy.gap.com/&request_type=search&rows=200&start=0&facet.limit=300&fl=pid,title,brand,price,sale_price,price_type,promotions,thumb_image,sku_thumb_images,sku_swatch_images,sku_color_group,url,price_range,sale_price_range,description,is_live,score,defaultColorMarketingMessage,styleMarketingMessage&stats.field=sale_price`, function(data) {
    data.response.docs.forEach((p) => {
      const tempObj = {
        name: p.title,
        price: p.price,
        sale: p.price != p.sale_price_range[0] ? p.sale_price_range[0] : false,
        img: `https://oldnavy.gap.com/${p.thumb_image}`,
        link: `https://oldnavy.gap.com/${p.url}`,
        storeName: 'Old Navy'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getZumiezProducts(keywords) {
  const products = []
  await $.get(`https://www.zumiez.com/catalogsearch/result/?q=${keywords.join('+').replace(/ /g, '+')}&kw=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('.category-products .column.item')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.product-name').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.price').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,""),
        sale: $(this).find('.sale-price').length > 0 ? $(this).find('.sale-price').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : false,
        img: $(this).find('.product-image img').attr('src'),
        link: $(this).find('.product-image').attr('href'),
        storeName: 'Zumiez'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getGapProducts(keywords) {
  const products = []
  await $.get(`https://brm-core-0.brsrvr.com/api/v1/core/?account_id=5468&auth_key=&domain_key=gap&request_id=2803065648391&_br_uid_2=uid%3D3953529282324%3Av%3D12.0%3Ats%3D1574719946739%3Ahc%3D11&url=https://www.gap.com/index.html%23brm-search%3Frequest_type=search&search_type=keyword&q=${keywords.join('%20').replace(/ /g, '%20')}&l=${keywords.join('%20').replace(/ /g, '%20')}&br_origin=searchbox&realm=prod&ref_url=https://www.gap.com/&request_type=search&rows=200&start=0&facet.limit=300&fl=pid,title,brand,price,sale_price,price_type,promotions,thumb_image,sku_thumb_images,sku_swatch_images,sku_color_group,url,price_range,sale_price_range,description,is_live,score,defaultColorMarketingMessage,styleMarketingMessage&stats`, function(data) {
    data.response.docs.forEach((p) => {
      const tempObj = {
        name: p.title,
        price: p.price,
        sale: p.price != p.sale_price_range[0] ? p.sale_price_range[0] : false,
        img: `https://gap.com/${p.thumb_image}`,
        link: `https://gap.com/${p.url}`,
        storeName: 'Gap'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getBananaRepublicProducts(keywords) {
  const products = []
  await $.get(`https://brm-core-0.brsrvr.com/api/v1/core/?account_id=6105&auth_key=&domain_key=bananarepublic&request_id=2803065648391&_br_uid_2=uid%3D3953529282324%3Av%3D12.0%3Ats%3D1574719946739%3Ahc%3D14&url=https://bananarepublic.gap.com/index.html%23brm-search%3Frequest_type=search&search_type=keyword&q=${keywords.join('%20').replace(/ /g, '%20')}&l=${keywords.join('%20').replace(/ /g, '%20')}&br_origin=searchbox&realm=prod&ref_url=https://bananarepublic.gap.com/&request_type=search&rows=200&start=0&facet.limit=300&fl=pid,title,brand,price,sale_price,price_type,promotions,thumb_image,sku_thumb_images,sku_swatch_images,sku_color_group,url,price_range,sale_price_range,description,is_live,score,defaultColorMarketingMessage,styleMarketingMessage&stats.field=sale_price`, function(data) {
    data.response.docs.forEach((p) => {
      const tempObj = {
        name: p.title,
        price: p.price,
        sale: p.price != p.sale_price_range[0] ? p.sale_price_range[0] : false,
        img: `https://bananarepublic.gap.com/${p.thumb_image}`,
        link: `https://bananarepublic.gap.com/${p.url}`,
        storeName: 'Banana Republic'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getJCrewProducts(keywords) {
  const products = []
  await $.get(`https://www.jcrew.com/r/search/?N=0&Nloc=en&Ntrm=${keywords.join('%20').replace(/ /g, '%20')}&Nsrt=&Npge=1&Nrpp=60`, function(data) {
    let elements = $(data).find('.product__list .c-product-tile')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.tile__detail--name').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.tile__detail--price--sale--old').length > 0 ? $(this).find('.tile__detail--price--was span').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : $(this).find('.tile__detail--price span').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,""),
        sale: $(this).find('.tile__detail--price--sale--old').length > 0 ? $(this).find('.tile__detail--price--sale--old span').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : false,
        img: `https://www.jcrew.com/s7-img-facade/${$(this).find('.product-tile').attr('class').split(' ')[1].split('-')[1]}?fmt=jpeg&qlt=90,0&resMode=sharp&op_usm=.1,0,0,0&crop=0,0,0,0&wid=480&hei=480`,
        link: 'https://www.jcrew.com'+$(this).find('.product-tile__link').attr('href'),
        storeName: 'J.Crew'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getHMProducts(keywords) {
  const products = []
  await $.get(`https://www2.hm.com/en_us/search-results.html?q=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('.products-listing .product-item')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.item-heading a').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.price.regular').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,""),
        sale: $(this).find('.price.sale').length > 0 ? $(this).find('.price.sale').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : false,
        img: $(this).find('.item-image').attr('data-src').replace('//', 'https://'),
        link: `https://www2.hm.com`+$(this).find('.item-heading a').attr('href'),
        storeName: 'H&M'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getBloomingDaleProducts(keywords) {
  const products = []
  await $.get(`https://www.bloomingdales.com/shop/search?keyword=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('.items .productThumbnail')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.primary-image img').attr('alt').replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.tnPrice .regular').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,""),
        sale: $(this).find('.tnPrice .discount').length > 0 ? $(this).find('.tnPrice .discount').text().split('$')[1].split(' ')[0].replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : false,
        img: $(this).find('.primary-image img').attr('src') || $(this).find('.primary-image img').attr('data-lazysrc'),
        link: 'https://www.bloomingdales.com'+$(this).find('.productDescLink').attr('href'),
        storeName: 'Bloomingdale\'s'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getBillabongProducts(keywords) {
  const products = []
  await $.get(`https://www.billabong.com/search/?q=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('#productssearchresult .producttile')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.name a').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.price.data-price').attr('data-standardprice') != '-' ? $(this).find('.price.data-price').attr('data-standardprice').replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : $(this).find('.price.data-price').attr('data-salesprice').replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,""),
        sale: $(this).find('.price.data-price').attr('data-standardprice') != '-' ? $(this).find('.price.data-price').attr('data-salesprice').replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : false,
        img: $(this).find('.productimage img').attr('src'),
        link: $(this).find('.name a').attr('href'),
        storeName: 'Billabong'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getNordstromRackProducts(keywords) {
  const products = []
  await $.get(`https://www.nordstromrack.com/api/search2/catalog/search?includeFlash=true&includePersistent=true&limit=99&page=1&query=${keywords.join('%20').replace(/ /g, '%20')}&sort=relevancy&nestedColors=false&site=nordstromrack`, function(data) {
    data._embedded['http://hautelook.com/rels/products'].forEach((p) => {
      const tempObj = {
        name: p.name,
        price: p._embedded['http://hautelook.com/rels/skus'][0].price_retail,
        sale: p._embedded['http://hautelook.com/rels/skus'][0].price_discount > 0 ? p._embedded['http://hautelook.com/rels/skus'][0].price_sale : false,
        img: p._embedded['http://hautelook.com/rels/skus'][0]._links['http://hautelook.com/rels/images'][0].href.replace('{size}', 'large').replace('{width}', '228').replace('{height}', '350'),
        link: 'https://www.nordstromrack.com/shop/product/'+p.style_id+'?'+p._links.self.href.split('?')[1],
        storeName: 'Nordstrom Rack'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getNorthFaceProducts(keywords) {
  const products = []
  await $.get(`https://www.thenorthface.com/shop/VFSearchDisplay?catalogId=20001&storeId=7001&langId=-1&searchTerm=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('#catalog-results .product-block')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.product-block-name-wrapper').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.product-block-price.original-price').length > 0 ? $(this).find('.product-block-price.original-price').attr('data-amount') : $(this).find('.product-block-price').attr('data-amount'),
        sale: $(this).find('.product-block-price.original-price').length > 0 ? $(this).find('.product-block-price.current-price').attr('data-amount') : false,
        img: $(this).find('.product-block-views-selected-view-main-image').first().attr('srcset').replace('//', 'https://'),
        link: $(this).find('.product-block-pdp-url').attr('href'),
        storeName: 'North Face'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getLeviProducts(keywords) {
  const products = []
  await $.get(`https://www.levi.com/US/en_US/search/${keywords.join('%20').replace(/ /g, '%20')}`, function(data) {
    let elements = $(data).find('.product__listing .product-item')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.thumb-link').attr('title').replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.price .regular').text().split('-')[0].replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,""),
        sale: $(this).find('.price .hard-sale').length > 0 || $(this).find('.price .soft-sale').length > 0 ? $(this).find('.price .hard-sale').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") || $(this).find('.price .soft-sale').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : false,
        img: $(this).find('.thumb-link source').first().attr('data-srcset') || $(this).find('.thumb-link source').first().attr('srcset'),
        link: 'https://www.levi.com'+$(this).find('.thumb-link').attr('href'),
        storeName: 'Levi\'s'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getLouisVuittonProducts(keywords) {
  const products = []
  await $.get(`https://us.louisvuitton.com/eng-us/search/${keywords.join('%20').replace(/ /g, '%20')}`, function(data) {
    let elements = $(data).find('.productsList .productItem')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.productName').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.productPrice .notCrawlableContent').attr('data-htmlContent').replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,""),
        sale: false,
        img: $(this).find('.product-img source').attr('data-src').replace('{IMG_WIDTH}', '1600').replace('{IMG_HEIGHT}', '1600'),
        link: 'https://us.louisvuitton.com'+$(this).find('.productCTA').attr('href'),
        storeName: 'Louis Vuitton'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getChampionProducts(keywords) {
  const products = []
  await $.get(`https://www.champion.com/shop/SearchDisplay?categoryId=411552&doorId=3&storeId=10704&catalogId=11053&langId=-1&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&searchSource=Q&pageView=&beginIndex=0&pageSize=20&searchTerm=${'hoodie'/*keywords.join('+').replace(/ /g, '+')*/}#facet:&productBeginIndex:0&orderBy:&pageView:grid&minPrice:&maxPrice:&pageSize:20&`, function(data) {
    let elements = $(data).find('.product-search-result-container .each-product')
    elements.each(function() {
      $(this).find('.visuallyhidden').remove()
      const tempObj = {
        name: $(this).find('.item-name').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.list_price').text().trim().length > 0 &&  $(this).find('.current_price').text().trim().length > 0 ? $(this).find('.list_price').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : $(this).find('.current_price').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,""),
        sale: $(this).find('.list_price').text().trim().length > 0 &&  $(this).find('.current_price').text().trim().length > 0 ? $(this).find('.current_price').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : false,
        img: $(this).find('.product-listing-image').attr('data-src'),
        link: $(this).find('.link-image-holder').attr('href').split('?')[0],
        storeName: 'Champion'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getPinkProducts(keywords) { // COME BACK TO THIS STORE
  const products = []
  if(keywords.includes('men' || 'male' || 'man' || 'mens' || 'kid' || 'boy' || 'boys' || 'child' || 'children')) return []
  await $.get(`https://api.victoriassecret.com/keywordsearch/v4/search?brand=pink&q=${keywords.join('%20').replace(/ /g, '%20')}&searchLocation=header`, function(data) {
    data.products.forEach((i) => {
      const tempObj = {
        name: i.name.replace(/(\r\n|\n|\r)|  /gm,""),
        price: i.price.replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,""),
        sale: i.salePrice ? i.salePrice.replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : false,
        img: 'https://www.victoriassecret.com/p/220x293/' + i.productImages[0] + '.jpg' ,
        link: i.url.split('?')[0],
        storeName: 'Victoria\'s Secret'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getGuessProducts(keywords) {
  const products = []
  await $.get(`https://recs.richrelevance.com/rrserver/api/find/v1/199c81c05e473265?findCallType=overlay&lang=en&log=true&placement=search_page.find&query=${keywords.join('+').replace(/ /g, '+')}&rcs=eF5j4cotK8lM4TOzMNU11DVkKU32MEwyNjVNMzPTTUq2NNU1MTY20bU0SzTVNTIwTbIwT0lKSjRNAgB-_g4I&region=undefined&rows=24&sessionId=d8cf1765-d197-46b9-9d1e-6ff0d9bb5a14&ssl=true&start=48`, function(data) {
    data.placements[0].docs.forEach((p) => {
      const tempObj = {
        name: p.name.replace(/(\r\n|\n|\r)/gm,""),
        price: p.priceCents/100,
        sale: p.salePriceCents != -1 ? p.salePriceCents/100 : false,
        img: p.imageId,
        link: 'https://shop.guess.com'+p.linkId,
        storeName: 'Guess'
      }
      products.push(tempObj)
    })

  })
  return products
}

async function getAsosProducts(keywords) {
  const products = []
  await $.get(`https://www.asos.com/us/search/?q=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('._3-pEc3l ._2oHs74P')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('._10-bVn6 p').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('._3b3kqA8').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,""),
        sale: $(this).find('._2ZHtSZZ').length > 0 ? $(this).find('._2ZHtSZZ').text().replace(/(\t|\r\n|\n|\r)|[$| |,]/gm,"") : false,
        img: $(this).find('._9n6j7z7 img').attr('srcset').split(',')[0].replace('//', 'https://'),
        link: $(this).find('._3x-5VWa').attr('href').split('&')[0],
        storeName: 'ASOS'
      }
      products.push(tempObj)
    })
  })
  return products
}

async function getTargetProducts(keywords) {
  const products = []
  await $.get(`https://redsky.target.com/v2/plp/search/?channel=web&count=24&default_purchasability_filter=true&facet_recovery=false&isDLP=false&keyword=${keywords.join('+').replace(/ /g, '+')}&offset=0&pageId=%2Fs%2F${keywords.join('+').replace(/ /g, '+')}&pricing_store_id=1122&scheduled_delivery_store_id=1122&store_ids=1122%2C321%2C1054%2C3265%2C2185&visitorId=016E9B667F74020198F0BF97718A7F1F&include_sponsored_search_v2=true&ppatok=AOxT33a&platform=desktop&useragent=Mozilla%2F5.0+%28Macintosh%3B+Intel+Mac+OS+X+10_14_5%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F78.0.3904.108+Safari%2F537.36&key=eb2551e4accc14f38cc42d32fbc2b2ea`, function(data) {
    data.search_response.items.Item.forEach((p) => {
      const tempObj = {
        name: p.title.replace(/(\t|\r\n|\n|\r)|&#174|;/gm,""),
        price: p.price.reg_retail_min,
        img: p.images[0].base_url + p.images[0].primary,
        link: 'https://www.target.com'+p.url,
        storeName: 'Target'
      }
      products.push(tempObj)
    })

  })
  return products
}

// async function getProducts(keywords) {
//   const products = []
//   await $.get(`${keywords.join('%20').replace(/ /g, '%20')}`, function(data) {
//     console.log($(data))
//     let elements = $(data).find('')
//     console.log(elements)
//     elements.each(function() {
//       const tempObj = {
//         name: $(this).find('').text().replace(/(\r\n|\n|\r)/gm,""),
//         price: $(this).find(''),
//         img: $(this).find('').attr(''),
//         link: $(this).find('').attr('href'),
//         storeName: ''
//       }
//       products.push(tempObj)
//     })
//   })
//   return products
// }
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
    console.log(allProducts)
    sendResponse(allProducts)
  }
})
$(() => {
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

  const getPageStatus = async () => {
    if(! await isStorePage()) {
      return ({status: "not store page"});
    } else if(! await isProductPage()) {
      return ({status: "not product page"});
    } else {
      return ({status: "processing"});
    }
  }

  const setProcessingStatus = async () => {
    if (await isStorePage() && await isProductPage()) {
      getPageData()
    }
  }

  setProcessingStatus()

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.from === "popup" && request.subject === "getPageStatus") {
      getPageStatus().then(sendResponse);
      return true;
    }
  })
})
}
