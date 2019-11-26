console.log("test")

const getNordstromProducts = async (keywords) => {
  const products = []
  console.log(keywords)
  await $.get(`https://shop.nordstrom.com/sr?origin=keywordsearch&keyword=${keywords.join('+')}`, function(data) {
    let elements = $(data).find('._1AOd3')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('._5lXiG ').text(),
        price: $(this).find('._18N5Q').length > 0 ? $(this).find('._18N5Q ._3wu-9').text().split('$')[1] : $(this).find('._3bi0z ._3wu-9').text().split('$')[1],
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
  await $.get(`https://www.hugoboss.com/us/search?q=${keywords.join('%20')}`, function(data) {
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
    await $.get(`https://www.pacsun.com/on/demandware.store/Sites-pacsun-Site/default/Search-Show?stype=snap&etype=submit&q=${keywords.join('%20')}`, function(data) {
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
  await $.get(`https://www.hollisterco.com/shop/us/search?departmentCategoryId=10006&searchTerm=${keywords.join('+')}`, function(data) {
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

//

const getVansProducts = async (keywords) => {
  const products = []
  await $.get(`https://www.vans.com/webapp/wcs/stores/servlet/VFSearchDisplay?storeId=10153&catalogId=10703&langId=-1&beginIndex=0&searchSource=Q&sType=SimpleSearch&searchTerm=${keywords.join('+')}`, function(data) {
    console.log($(data))
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

const getForever21Products = async (keywords) => {
  const products = []
  await $.get(`https://www.forever21.com/us/shop/Search/#brm-search?request_type=search&search_type=keyword&q=${keywords.join('%20')}&l=${keywords.join('%20')}`, function(data) {
    console.log($(data))
    let elements = $(data).find('#product_list').find('.pi_container')
    console.log(elements)
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.p_name').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find('.p_sale').length > 0 ? $(this).find('.p_sale').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,"") : $(this).find('.p_price').text().replace(/(\t|\r\n|\n|\r)|[$| ]/gm,""),
        img: $(this).find('.product_image').attr('src'),
        link: $(this).find('.product_link').attr('href'),
        storeName: 'Forever 21'
      }
      products.push(tempObj)
    })
  })
  return products
}

const getNikeProducts = async (keywords) => {
  const products = []
  await $.get(`https://www.nike.com/w?q=${keywords.join('%20')}&vst=${keywords.join('%20')}}`, function(data) {
    console.log($(data))
    let elements = $(data).find('.product-grid__items .product-card__body')
    console.log(elements)
    elements.each(function() {
      const tempObj = {
        name: $(this).find('.product-card__title').text().replace(/(\r\n|\n|\r)/gm,"") + $(this).find('.product-card__subtitle').text().replace(/(\r\n|\n|\r)/gm,""),
        price: $(this).find(''),
        img: $(this).find('').attr(''),
        link: $(this).find('.product-card__link-overlay').attr('href'),
        storeName: ''
      }
      products.push(tempObj)
    })
  })
  return products
}

const getAmericanEagleProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20')}}`, function(data) {
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

const getAdidasProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20')}}`, function(data) {
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

const getUrbanOutfittersProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20')}}`, function(data) {
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

const getVictoriaSecretProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20')}}`, function(data) {
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

const getBrandyMelvilleProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20')}}`, function(data) {
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

const getAbercrombieFitchProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20')}}`, function(data) {
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

const getHotTopicProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20')}}`, function(data) {
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

const getOldNavyProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20')}}`, function(data) {
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

const getZumiezProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20')}}`, function(data) {
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

const getGapProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20')}}`, function(data) {
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

const getBananaRepublicProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20')}}`, function(data) {
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

const getJCrewProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20')}}`, function(data) {
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

const getHMProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20')}}`, function(data) {
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

const getBloomingDaleProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20')}}`, function(data) {
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

const getBillabongProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20')}}`, function(data) {
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

const getNordstromRackProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20')}}`, function(data) {
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

const getZafulProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20')}}`, function(data) {
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

const getZaraProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20')}}`, function(data) {
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

const getNorthFaceProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20')}}`, function(data) {
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

const getStussyProducts = async (keywords) => {
  const products = []
  await $.get(`${keywords.join('%20')}}`, function(data) {
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
  await $.get(`${keywords.join('%20')}}`, function(data) {
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
  await $.get(`${keywords.join('%20')}}`, function(data) {
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
  await $.get(`${keywords.join('%20')}}`, function(data) {
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
  await $.get(`${keywords.join('%20')}}`, function(data) {
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
  await $.get(`${keywords.join('%20')}}`, function(data) {
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
  await $.get(`${keywords.join('%20')}}`, function(data) {
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
  await $.get(`${keywords.join('%20')}}`, function(data) {
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
  await $.get(`${keywords.join('%20')}}`, function(data) {
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
  await $.get(`${keywords.join('%20')}}`, function(data) {
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
  await $.get(`${keywords.join('%20')}}`, function(data) {
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
//   await $.get(`${keywords.join('%20')}}`, function(data) {
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
