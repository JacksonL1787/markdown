const getNordstromProducts = async (keywords) => {
  const products = []
  await $.get(`https://shop.nordstrom.com/sr?origin=keywordsearch&keyword=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('._1AOd3')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('._5lXiG ').text(),
        price: $(this).find('._3bi0z ._3wu-9').text().split('$')[1],
        sale: $(this).find('._18N5Q').length > 0 ? $(this).find('._18N5Q ._3wu-9').text().split('$')[1] : false,
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

const getHugoBossProducts = async (keywords) => {
  const products = []
  await $.get(`https://www.hugoboss.com/us/search?q=${keywords.join('%20').replace(/ /g, '%20')}`, function(data) {
    let elements = $(data).find('.search-result-content .search-result-items__grid-tile')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.product-tile__productInfoWrapper').text().replace(/BOSS|HUGO|by|(\r\n|\n|\r)/gm,""),
        price: $(this).find('.product-tile__offer .price-sales').text().replace('$', ''),
        img: $(this).find('.product-tile__image').attr('data-src').replace(/({width})/g, '240').replace(/({quality})/g, '45'),
        link: `https://www.hugoboss.com${$(this).find('.product-tile__link').attr('data-url')}`,
        storeName: 'Hugo Boss'
      }
      products.push(tempObj)
    })
  })
  return products
}

const getPacsunProducts = async (keywords) => {
  const products = []
  try {
    await $.get(`https://www.pacsun.com/on/demandware.store/Sites-pacsun-Site/default/Search-Show?stype=snap&etype=submit&q=${keywords.join('%20').replace(/ /g, '%20')}`, function(data) {
      let elements = $(data).find('.search-result-content .product-tile')

      elements.each(function() {
        const tempObj = {
          name: $(this).find('.product-name .name-link').text().replace(/(\r\n|\n|\r)/gm,""),
          price: $(this).find('.sold-out').length > 0 ? "SOLD OUT" : ($(this).find('.product-price .price-promo').length > 0 ?
                 $(this).find('.product-price .price-promo').text().replace(/(\t|\r\n|\n|\r)|[$| ]|Now/gm,"") :
                 $(this).find('.product-price .price-standard').hasClass('strike') ?
                 $(this).find('.product-price .price-sales').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,"") :
                 $(this).find('.product-price .price-standard').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,"")),
          img: $(this).find('.product-image img').attr('src'),
          link: $(this).find('.product-name .name-link').attr('href'),
          storeName: 'Pacsun'
        }
        products.push(tempObj)
      })
    })
  } catch (e) {
    console.log(e)
  }

  return products
}

//

const getHollisterProducts = async (keywords) => {
  const products = []
  await $.get(`https://www.hollisterco.com/shop/us/search?departmentCategoryId=10006&searchTerm=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('.products-container .product-card--hol')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.product-card__name').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.product-price-text[data-state="discount"]').length > 0 ?
               $(this).find('.product-price-text[data-state="discount"]').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,"") :
               $(this).find('.product-price-text').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,""),
        img: $(this).find('.product-card__image-wrap .product-card__image').attr('data-src').replace('imageType', 'prod1'),
        link: $(this).find('.product-card__name').attr('href'),
        storeName: 'Hollister'
      }
      products.push(tempObj)
    })
  })
  return products
}

const getVansProducts = async (keywords) => {
  const products = []
  await $.get(`https://www.vans.com/webapp/wcs/stores/servlet/VFSearchDisplay?storeId=10153&catalogId=10703&langId=-1&beginIndex=0&searchSource=Q&sType=SimpleSearch&searchTerm=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('#catalog-results .product-block')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.product-block-name-wrapper').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.product-block-price').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,""),
        img: $(this).find('.product-block-views-selected-view-main-image').attr('srcset').replace('//', 'https://'),
        link: $(this).find('.product-block-name-link').attr('href'),
        storeName: 'Vans'
      }
      products.push(tempObj)
    })
  })
  return products
}

const getNikeProducts = async (keywords) => {
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

const getAmericanEagleProducts = async (keywords) => {
  const products = []
  await $.get(`https://www.ae.com/s/${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('.search-products .product-tile')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.product-name').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.product-list-price').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,""),
        sale: $(this).find('.product-sale-price').length > 0 ? $(this).find('.product-sale-price').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,"") : false,
        img: `https://s7d2.scene7.com/is/image/aeo/${$(this).attr('data-product-id')}_f?$cat-main_large$`,
        link: 'https://www.ae.com/'+$(this).find('.tile-link').attr('href').split('?nvid')[0],
        storeName: 'American Eagle'
      }
      products.push(tempObj)
    })
  })
  return products
}

const getAdidasProducts = async (keywords) => {
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
          console.log(index)
          console.log(data.itemList.items.length)
          if(data.itemList.items.length == (index + 1)) resolve(products)
        })
      })
    })
  }
  return await getProducts()
}

const getUrbanOutfittersProducts = async (keywords) => {
  const products = []
  await $.get(`https://www.urbanoutfitters.com/search?q=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('.s-category-grid .dom-product-tile')
    console.log(elements)
    elements.each(function() {
      console.log(`http://s7d5.scene7.com/is/image/UrbanOutfitters/${$(this).find('meta[dataprop="productID"]').attr('content')}_${$(this).find('.o-list-swatches__a o-list-swatches__a--selected').attr('data-qa-swatch')}_d?$medium$&qlt=80&fit=constrain`)
      const tempObj = {
        name: $(this).find('.c-product-tile__h3 span').text().replace(/(\r\n|\n|\r)|  /gm,""),
        price: $(this).find('.c-product-meta__current-price').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,""),
        sale: false,
        img: `http://s7d5.scene7.com/is/image/UrbanOutfitters/${$(this).find('meta[itemprop="productID"]').attr('content')}_${$(this).find('.o-list-swatches__a').attr('data-color-code')}_d?$medium$&qlt=80&fit=constrain`,
        link: 'https://www.urbanoutfitters.com'+$(this).find('.c-product-tile__title-link').attr('href').split('?category')[0],
        storeName: 'Urban Outfitters'
      }
      products.push(tempObj)
    })
  })
  return products
}

const getVictoriaSecretProducts = async (keywords) => {
  const products = []
  if(keywords.includes('men' || 'male' || 'man' || 'mens' || 'kid' || 'boy' || 'boys' || 'child' || 'children')) return []
  await $.get(`https://api.victoriassecret.com/keywordsearch/v4/search?brand=vs&q=${keywords.join('%20').replace(/ /g, '%20')}&searchLocation=header`, function(data) {
    data.products.forEach((i) => {
      console.log(i)
      const tempObj = {
        name: i.name.replace(/(\r\n|\n|\r)|  /gm,""),
        price: i.price.replace(/(\t|\r\n|\n|\r)|[$| ]/gm,""),
        sale: i.salePrice ? i.salePrice.replace(/(\t|\r\n|\n|\r)|[$| ]/gm,"") : false,
        img: 'https://www.victoriassecret.com/p/220x293/' + i.productImages[0] + '.jpg' ,
        link: i.url.split('?')[0],
        storeName: 'Victoria\'s Secret'
      }
      products.push(tempObj)
    })
  })
  return products
}

const getBrandyMelvilleProducts = async (keywords) => {
  const products = []
  if(keywords.includes('men' || 'male' || 'man' || 'mens' || 'kid' || 'boy' || 'boys' || 'child' || 'children')) return []
  await $.get(`https://www.brandymelvilleusa.com/catalogsearch/result/?q=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('.category-products .product-item')
    console.log(elements)
    elements.each(function() {
      console.log()
      const tempObj = {
        name: $(this).find('.product-item-name').find('a').text().replace(/(\r\n|\n|\r)|  /gm,""),
        price: $(this).find('.price').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,""),
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

const getAbercrombieFitchProducts = async (keywords) => {
  const products = []
  await $.get(`https://www.abercrombie.com/shop/us/search?departmentCategoryId=10000&searchTerm=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    if($(data).find('.rs-search-detail__additional-info').text().toLowerCase().replace(/(\r\n|\n|\r)|  /gm,"").includes('no match found')) return;
    let elements = $(data).find('.search-grid .product-card--anf')
    elements.each(function() {
      console.log()
      const tempObj = {
        name: $(this).find('.product-card__name').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.product-price-text[data-state="discount"]').length > 0 ? $(this).find('.product-price-text[data-state="original"]').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,"") : $(this).find('.product-price-text').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,""),
        sale: $(this).find('.product-price-text[data-state="discount"]').length > 0 ? $(this).find('.product-price-text[data-state="discount"]').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,"") : false,
        img: $(this).find('.product-card__image').attr('data-src').replace('imageType', 'prod1'),
        link: 'https://www.abercrombie.com' + $(this).find('.product-card__image-link').attr('href'),
        storeName: 'Abercrombie & Fitch'
      }
      products.push(tempObj)
    })
  })
  return products
}

const getHotTopicProducts = async (keywords) => {
  const products = []
  await $.get(`https://www.hottopic.com/search?q=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('#search-result-items .grid-tile')
    console.log(elements)
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.name-link').text().replace(/(\r\n|\n|\r)/gm,""),
        price: ($(this).find('.price-sales').length > 0 ? $(this).find('.price-original').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,"") : $(this).find('.price-standard').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,"")).split('-')[0],
        sale: $(this).find('.price-sales').length > 0 ? $(this).find('.price-sales').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,"").split('-')[0] : false,
        img: $(this).find('.first-image').attr('src'),
        link: $(this).find('.name-link').attr('href'),
        storeName: 'Hot Topic'
      }
      products.push(tempObj)
    })
  })
  return products
}

const getOldNavyProducts = async (keywords) => {
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

const getZumiezProducts = async (keywords) => {
  const products = []
  await $.get(`https://www.zumiez.com/catalogsearch/result/?q=${keywords.join('+').replace(/ /g, '+')}&kw=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('.category-products .column.item')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.product-name').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.price').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,""),
        sale: $(this).find('.sale-price').length > 0 ? $(this).find('.sale-price').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,"") : false,
        img: $(this).find('.product-image img').attr('src'),
        link: $(this).find('.product-image').attr('href'),
        storeName: 'Zumiez'
      }
      products.push(tempObj)
    })
  })
  return products
}

const getGapProducts = async (keywords) => {
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

const getBananaRepublicProducts = async (keywords) => {
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

const getJCrewProducts = async (keywords) => {
  const products = []
  await $.get(`https://www.jcrew.com/r/search/?N=0&Nloc=en&Ntrm=${keywords.join('%20').replace(/ /g, '%20')}&Nsrt=&Npge=1&Nrpp=60`, function(data) {
    let elements = $(data).find('.product__list .c-product-tile')
    elements.each(function() {
      console.log($(this).find('.product-tile__image-wrapper'))
      const tempObj = {
        name: $(this).find('.tile__detail--name').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.tile__detail--price--sale--old').length > 0 ? $(this).find('.tile__detail--price--was span').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,"") : $(this).find('.tile__detail--price span').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,""),
        sale: $(this).find('.tile__detail--price--sale--old').length > 0 ? $(this).find('.tile__detail--price--sale--old span').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,"") : false,
        img: `https://www.jcrew.com/s7-img-facade/${$(this).find('.product-tile').attr('class').split(' ')[1].split('-')[1]}?fmt=jpeg&qlt=90,0&resMode=sharp&op_usm=.1,0,0,0&crop=0,0,0,0&wid=480&hei=480`,
        link: 'https://www.jcrew.com'+$(this).find('.product-tile__link').attr('href'),
        storeName: 'J.Crew'
      }
      products.push(tempObj)
    })
  })
  return products
}

const getHMProducts = async (keywords) => {
  const products = []
  await $.get(`https://www2.hm.com/en_us/search-results.html?q=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('.products-listing .product-item')
    console.log(elements)
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.item-heading a').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.price.regular').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,""),
        sale: $(this).find('.price.sale').length > 0 ? $(this).find('.price.sale').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,"") : false,
        img: $(this).find('.item-image').attr('data-src').replace('//', 'https://'),
        link: `https://www2.hm.com`+$(this).find('.item-heading a').attr('href'),
        storeName: 'H&M'
      }
      products.push(tempObj)
    })
  })
  return products
}

const getBloomingDaleProducts = async (keywords) => {
  const products = []
  await $.get(`https://www.bloomingdales.com/shop/search?keyword=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('.items .productThumbnail')
    console.log(elements)
    elements.each(function() {
      console.log($(this).find('.thumbnailImageContainer'))
      const tempObj = {
        name: $(this).find('.primary-image img').attr('alt').replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.tnPrice .regular').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,""),
        sale: $(this).find('.tnPrice .discount').length > 0 ? $(this).find('.tnPrice .discount').text().split('$')[1].split(' ')[0].replace(/(\t|\r\n|\n|\r)|[$| ]/gm,"") : false,
        img: $(this).find('.primary-image img').attr('src') || $(this).find('.primary-image img').attr('data-lazysrc'),
        link: 'https://www.bloomingdales.com'+$(this).find('.productDescLink').attr('href'),
        storeName: 'Bloomingdale\'s'
      }
      products.push(tempObj)
    })
  })
  return products
}

const getBillabongProducts = async (keywords) => {
  const products = []
  await $.get(`https://www.billabong.com/search/?q=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    let elements = $(data).find('#productssearchresult .producttile')
    console.log(elements)
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.name a').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.price.data-price').attr('data-standardprice') != '-' ? $(this).find('.price.data-price').attr('data-standardprice').replace(/(\t|\r\n|\n|\r)|[$| ]/gm,"") : $(this).find('.price.data-price').attr('data-salesprice').replace(/(\t|\r\n|\n|\r)|[$| ]/gm,""),
        sale: $(this).find('.price.data-price').attr('data-standardprice') != '-' ? $(this).find('.price.data-price').attr('data-salesprice').replace(/(\t|\r\n|\n|\r)|[$| ]/gm,"") : false,
        img: $(this).find('.productimage img').attr('src'),
        link: $(this).find('.name a').attr('href'),
        storeName: 'Billabong'
      }
      products.push(tempObj)
    })
  })
  return products
}

const getNordstromRackProducts = async (keywords) => {
  const products = []
  await $.get(`https://www.nordstromrack.com/api/search2/catalog/search?includeFlash=true&includePersistent=true&limit=99&page=1&query=${keywords.join('%20').replace(/ /g, '%20')}&sort=relevancy&nestedColors=false&site=nordstromrack`, function(data) {
    console.log(data)
    data._embedded['http://hautelook.com/rels/products'].forEach((p) => {
      console.log(p._embedded['http://hautelook.com/rels/skus'][0]._links)
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

const getNorthFaceProducts = async (keywords) => {
  const products = []
  await $.get(`https://www.thenorthface.com/shop/VFSearchDisplay?catalogId=20001&storeId=7001&langId=-1&searchTerm=${keywords.join('+').replace(/ /g, '+')}`, function(data) {
    console.log($(data))
    let elements = $(data).find('#catalog-results .product-block')
    console.log(elements)
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

const getStussyProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20').replace(/ /g, '%20')}`, function(data) {
    console.log($(data))
    let elements = $(data).find('')
    console.log(elements)
    elements.each(function() {
      const tempObj = {
        name: $(this).find('').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find(''),
        img: $(this).find('').attr(''),
        link: $(this).find('').attr('href'),
        storeName: ''
      }
      products.push(tempObj)
    })
  })
  return products
}

const getLeviProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20').replace(/ /g, '%20')}`, function(data) {
    console.log($(data))
    let elements = $(data).find('')
    console.log(elements)
    elements.each(function() {
      const tempObj = {
        name: $(this).find('').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find(''),
        img: $(this).find('').attr(''),
        link: $(this).find('').attr('href'),
        storeName: ''
      }
      products.push(tempObj)
    })
  })
  return products
}

const getPaulSmithProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20').replace(/ /g, '%20')}`, function(data) {
    console.log($(data))
    let elements = $(data).find('')
    console.log(elements)
    elements.each(function() {
      const tempObj = {
        name: $(this).find('').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find(''),
        img: $(this).find('').attr(''),
        link: $(this).find('').attr('href'),
        storeName: ''
      }
      products.push(tempObj)
    })
  })
  return products
}

const getLouisVuittonProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20').replace(/ /g, '%20')}`, function(data) {
    console.log($(data))
    let elements = $(data).find('')
    console.log(elements)
    elements.each(function() {
      const tempObj = {
        name: $(this).find('').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find(''),
        img: $(this).find('').attr(''),
        link: $(this).find('').attr('href'),
        storeName: ''
      }
      products.push(tempObj)
    })
  })
  return products
}

const getChampionProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20').replace(/ /g, '%20')}`, function(data) {
    console.log($(data))
    let elements = $(data).find('')
    console.log(elements)
    elements.each(function() {
      const tempObj = {
        name: $(this).find('').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find(''),
        img: $(this).find('').attr(''),
        link: $(this).find('').attr('href'),
        storeName: ''
      }
      products.push(tempObj)
    })
  })
  return products
}

const getPinkProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20').replace(/ /g, '%20')}`, function(data) {
    console.log($(data))
    let elements = $(data).find('')
    console.log(elements)
    elements.each(function() {
      const tempObj = {
        name: $(this).find('').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find(''),
        img: $(this).find('').attr(''),
        link: $(this).find('').attr('href'),
        storeName: ''
      }
      products.push(tempObj)
    })
  })
  return products
}

const getChanelProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20').replace(/ /g, '%20')}`, function(data) {
    console.log($(data))
    let elements = $(data).find('')
    console.log(elements)
    elements.each(function() {
      const tempObj = {
        name: $(this).find('').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find(''),
        img: $(this).find('').attr(''),
        link: $(this).find('').attr('href'),
        storeName: ''
      }
      products.push(tempObj)
    })
  })
  return products
}

const getFendiProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20').replace(/ /g, '%20')}`, function(data) {
    console.log($(data))
    let elements = $(data).find('')
    console.log(elements)
    elements.each(function() {
      const tempObj = {
        name: $(this).find('').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find(''),
        img: $(this).find('').attr(''),
        link: $(this).find('').attr('href'),
        storeName: ''
      }
      products.push(tempObj)
    })
  })
  return products
}

const getPradaProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20').replace(/ /g, '%20')}`, function(data) {
    console.log($(data))
    let elements = $(data).find('')
    console.log(elements)
    elements.each(function() {
      const tempObj = {
        name: $(this).find('').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find(''),
        img: $(this).find('').attr(''),
        link: $(this).find('').attr('href'),
        storeName: ''
      }
      products.push(tempObj)
    })
  })
  return products
}

const getGuessProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20').replace(/ /g, '%20')}`, function(data) {
    console.log($(data))
    let elements = $(data).find('')
    console.log(elements)
    elements.each(function() {
      const tempObj = {
        name: $(this).find('').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find(''),
        img: $(this).find('').attr(''),
        link: $(this).find('').attr('href'),
        storeName: ''
      }
      products.push(tempObj)
    })
  })
  return products
}

const getAsosProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20').replace(/ /g, '%20')}`, function(data) {
    console.log($(data))
    let elements = $(data).find('')
    console.log(elements)
    elements.each(function() {
      const tempObj = {
        name: $(this).find('').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find(''),
        img: $(this).find('').attr(''),
        link: $(this).find('').attr('href'),
        storeName: ''
      }
      products.push(tempObj)
    })
  })
  return products
}

// const getProducts = async (keywords) => {
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
