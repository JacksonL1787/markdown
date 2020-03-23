let _data = {};

let getProductsTimer;

let allStores = []

const setLoader = (status, container) => {
  if(status) {
    $(`.${container}`).addClass('active-loader')
  } else {
    $(`.${container}`).removeClass('active-loader')
  }
}

const userMessage = (status) => {
  if($('.message-wrap').hasClass('active')) {
    clearTimeout(elemTimeout)
  }
  $('.message-wrap').empty().removeClass('active').removeClass('red').removeClass('green')
  setTimeout(() => {
    $('.message-wrap').addClass('active')
    if(status === "added favorite") {
      $('.message-wrap').addClass('green')
      $('.message-wrap')
        .append(`
          <div class="icon-wrap">
            <div class="icon added"></div>
          </div>
          <p class="msg">Added Item to Favorites</p>
        `)
    } else if (status === "removed favorite") {
      $('.message-wrap').addClass('red')
      $('.message-wrap')
        .append(`
          <div class="icon-wrap">
            <div class="icon removed"></div>
          </div>
          <p class="msg">Removed Item from Favorites</p>
        `)
    } else if (status === "feedback") {
      $('.message-wrap').addClass('green')
      $('.message-wrap').append(`
        <p class="msg">Thanks for the feedback!
        `)
    }
    elemTimeout = setTimeout(() => {
      $('.message-wrap').removeClass('active')
    }, 2500)
  }, 100)
}

const appendProduct = (data, container) => {
  data.shortenName = data.name.length > 30 ? data.name.slice(0,30) + "..." : data.name
  let salePrice = sale = data.sale ? `$${parseFloat(data.sale).toFixed(2)}` : false
  let price = isNaN(parseFloat(data.price)) ? "Unknown Price" : `$${parseFloat(data.price).toFixed(2)}`
  $(container).append(`

    <div class="product">
      <h2 class="store-name">${data.storeName}</h2>
      <div class="product-img-wrap" data-link="${data.link}">
        <img src="${data.img}" alt="${data.name}">
        <div class="button-wrap">
          <div data-tooltip="${data.favorite ? "Remove Favorite" : "Favorite"}" class="action-btn favorite-btn${data.favorite ? " active" : ""}">
            <div class="icon"></div>
          </div>
          ${container === '.similar-clothing-container .clothing-content' ? `
            <div class="similar-btn action-btn" data-tooltip="Similar">
              <div class="icon"></div>
            </div>
            <div class="not-similar-btn action-btn" data-tooltip="Not Similar">
              <div class="icon"></div>
            </div>`
              : ""}
        </div>
        <div class="favorited-tag ${data.favorite ? "active reverse-transition" : ""}">
          <div class="banner">
            <p>Favorited</p>
          </div>
          <div class="corner-wrap">
            <div class="corner"></div>
          </div>
        </div>
        <div class="img-darken-overlay"></div>
      </div>
      <div class="product-desc">
        <a href="${data.link}" target="_blank" class="product-title" title="${data.name}">${data.shortenName}</a>
        <div class="price-wrap">
          ${salePrice ?
            `<p class="price strikethrough">${price}</p><p class="sale-price">${salePrice}</p>` :
            `<p class="price">${price}</p>`
          }
        </div>

      </div>
    </div>
  `)
}


$(document).on('click', '.product-img-wrap',function(e) {
  const $elem = $(e.target)
  if($elem.hasClass('img-darken-overlay')) {
    window.open($elem.parent('.product-img-wrap').data('link'), "_blank")
  }
  if($elem.hasClass('product-img-wrap')) {
    window.open($elem.data('link'), "_blank")
  }
})

$(document).on('click', '.product .button-wrap .similar-btn, .product .button-wrap .not-similar-btn', function() {
  userMessage('feedback')
  // TODO: POST to DB
})

$(() => { // Action Button Tooltips
  let TooltipTimeout;
  $(document).on('mouseover', '.product .button-wrap .action-btn', function() {
    const elem = $(this);
    TooltipTimeout = setTimeout(() => {
      console.log(elem)
      elem.append(`<div class="tooltip"><p class="tooltip-text">${elem.attr('data-tooltip')}</p></div>`)
    }, 500);
  });
  $(document).on('mouseout', '.product .button-wrap .action-btn', function(e) {
    let elem = $(e.toElement)
    clearTimeout(TooltipTimeout);
    if(! (elem.hasClass('icon') || elem.hasClass('action-btn'))) {
      $('.product .action-btn .tooltip').remove()
    }
  });
});

const getAllStores = async () => {
  const response = await fetch(chrome.runtime.getURL('/src/stores.json'))
  const stores = await response.json()
  return await stores;
}

/*

  HOME - STORES

*/

const appendStoresAlphabetically = (stores) => {
  $('.stores-container .stores-list').empty()
  stores.sort((a,b) => {
    if(a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
    if(a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
    return 0;
  })
  stores.forEach((s, i) => {
    $(`.stores-container .stores-list`).append(`
      <div class="store-wrap" data-link="https://${s.url}">
        <img class="logo" src="https://${s.icon.imgProv === "uplead" ? 'logo.uplead.com': 'logo.clearbit.com'}/${s.icon.imgSrc}${s.icon.greyscale ? '?greyscale=true' : ''}">
        <h1 class="store-name">${s.name}</h1>
      </div>
      ${i === (stores.length - 1) ? '' : '<div class="divider"></div>'}
    `)
  })
}

$('.stores-container .search-bar-wrap .search-bar-inpt').on('input', function() {
  const search = $(this).val().replace(/ |&|'|\.|/gi, '').toLowerCase()
  const newStores = allStores.filter(s => {
    return s.name.replace(/ |&|'|\.|/gi, '').toLowerCase().startsWith(search)
  })
  $('.stores-container .no-stores-found').hide()
  $('.stores-container .no-stores-found').text()
  if(newStores.length === 0) {
    $('.stores-container .no-stores-found').show()
    $('.stores-container .no-stores-found .search-text').text($(this).val())
  }
  appendStoresAlphabetically(newStores)
})

$(document).on('click', '.stores-container .stores-list .store-wrap', function() {
  const link = $(this).data('link');
  mixpanel.track(
    "Clicked store link",
    {"link": link}
  );
  window.open(link, "_blank");
})



const handlePageStatus = (status) => {
  if(!status) {
    setTimeout(() => {
      getPageStatus()
    }, 100)
  }

  if(status.status === "not store page") {
    stopSimilarProductsPoll()
    $('.similar-clothing-container .container-msg').removeClass('show')
    $('.similar-clothing-container .not-store-page').addClass('show')
    return;
  }

  if(status.status === "not product page") {
    stopSimilarProductsPoll()
    $('.similar-clothing-container .container-msg').removeClass('show')
    $('.similar-clothing-container .go-to-product-page').addClass('show')
    return;
  }

  if(status.status === "processing") {
    $('.similar-clothing-container .container-msg').removeClass('show')
    $('.similar-clothing-container .loading-products').addClass('show')
    startSimilarProductsPoll()
    return;
  }
}

const getPageStatus = () => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    if(tabs[0].url.startsWith("chrome://")) {
      handlePageStatus({status: "not store page"})
    } else {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, async tabs => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            from: 'popup',
            subject: 'getPageStatus'
          }, handlePageStatus);
      });
    }
  })
}

const handleStores = async (stores) => {
  allStores = await getAllStores()
  appendStoresAlphabetically(allStores)
  setLoader(false, 'stores-container')
  // TODO: Show Search Bar
}

$(document).ready( async() => {
  setLoader(true, 'stores-container')
  setLoader(true, 'similar-clothing-container')
  handleStores()
  setTimeout(() => {
    getPageStatus()
  }, 100)
})

const stopSimilarProductsPoll = () => {
  clearInterval(getProductsTimer)
  setLoader(false, 'similar-clothing-container')
}

const startSimilarProductsPoll = () => {
  setLoader(true, 'similar-clothing-container')
  getSimilarProductInfo()
  getProductsTimer = setInterval(getSimilarProductInfo, 100)
}

const handleSimilarItems = (similarItems) => {
  if(!similarItems) return;
  if(similarItems.status === "no products") {
    stopSimilarProductsPoll()
    $('.similar-clothing-container .container-msg').removeClass('show')
    $('.similar-clothing-container .no-similar-clothing').addClass('show')
    return;
  }
  //$('.similar-items-content .sort-by-wrap').addClass('active')
  $('.similar-clothing-container .container-msg').removeClass('show')
  $('.similar-clothing-container .clothing-content .product').remove()
  $('.header .nav-similar-clothing .clothes-active').show()
  $('.similar-clothing-container .sort-by-container').addClass('active')
  $('.container, .nav-wrap .nav-item').removeClass('active')
  $('.nav-wrap .nav-similar-clothing, .similar-clothing-container').addClass('active')
  setLoader(false, 'similar-clothing-container')
  _data.currentPageProducts = similarItems
  similarItems.forEach((p) => {
    appendProduct(p, '.similar-clothing-container .clothing-content')
  })
}

const getSimilarProductInfo = () => {
  if(_data.currentPageProducts) {
    stopSimilarProductsPoll()
    return;
  }
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    chrome.tabs.sendMessage(
        tabs[0].id,
        {
          from: 'popup',
          subject: 'getProducts'
        },
        handleSimilarItems);
  });
}



$(() => {
  var animatedScrollActive = false;

  $('#main').scroll(function(e) {
    if(!$('.similar-clothing-container, .favorites-container').hasClass('active')) {
      return;
    }
    if($(this).scrollTop() > 350) {
      $('.back-to-top-btn').addClass('active')
    } else {
      $('.back-to-top-btn').removeClass('active')
    }
  })

  $('.back-to-top-btn').click(function(e) {
    if(animatedScrollActive) {
      return;
    }
    animatedScrollActive = true;

    $('#main').animate({
      scrollTop: 0
    }, 750, () => {
      animatedScrollActive = false;
    })
  })
})

$(() => {
  const sortSimilarProducts = (filter) => {
    if(_data.currentPageProducts) {
      let currArr = Array.from(_data.currentPageProducts)
      if (filter == "expensive") {
        currArr.sort((a, b) => {
          let priceA = a.sale ? parseFloat(a.sale) : parseFloat(a.price)
          let priceB = b.sale ? parseFloat(b.sale) : parseFloat(b.price)
          return (isNaN(priceB) ? 0 : priceB)  - (isNaN(priceA) ? 0 : priceA)
        })
      } else if (filter == "cheapest") {
        currArr.sort((a, b) => {
          let priceA = a.sale ? parseFloat(a.sale) : parseFloat(a.price)
          let priceB = b.sale ? parseFloat(b.sale) : parseFloat(b.price)
          return (isNaN(priceA) ? Math.pow(10, 1000) : priceA)  - (isNaN(priceB) ? Math.pow(10, 1000) : priceB)
        })
      }
      $('.similar-clothing-container .clothing-content .product').remove()
      currArr.forEach((p) => {
        appendProduct(p, '.similar-clothing-container .clothing-content')
      })
    }
  }

  $('.similar-clothing-container .sort-by-container .sort-option').click(function() {
    $('.similar-clothing-container .sort-by-container .sort-option').removeClass('active')
    $(this).addClass('active')
    sortSimilarProducts($(this).data('option'))
  })
})

$(() => {
  let elemTimeout;

  const handleFavoriteItems = (data) => {
    setTimeout(() => {
      setLoader(false, 'favorites-container')
    }, 200)

    $('.favorites-container .clothing-content .product').remove()
    if(!data) {
      $('.favorites-container .no-favorites').addClass('show')
      return;
    }
    if(data.length < 1) {
      $('.favorites-container .no-favorites').addClass('show')
      return;
    }
    $('.favorites-container .no-favorites').removeClass('show')
    console.log(data)
    data.forEach((p) => {
      appendProduct({...p, favorite: true}, '.favorites-container .clothing-content')
    })
  }

  const getFavoriteProducts = () => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(['favorites'], (data) => {
        const favorites = data['favorites']?data['favorites']:[];
        resolve(favorites)
      })
    })
  }

  const setFavoriteProducts = (product) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(['favorites'], (data) => {
        let favorites = data['favorites']?data['favorites']:[];
        favorites.unshift(product)
        chrome.storage.sync.set({'favorites': favorites})
        resolve(favorites)
      })
    })
  }

  const removeFavoriteProducts = (product) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(['favorites'], (data) => {
        let favorites = data['favorites']?data['favorites']:[];
        favorites.forEach((f, i) => {
          if(f.link === product.link) {
            favorites.splice(i, 1)
          }
        })
        chrome.storage.sync.set({'favorites': favorites})
        resolve(favorites)
      })
    })
  }

  $(document).on('click', '.clothing-content .favorite-btn', async function() {
    const wrap = $(this).parents('.product')
    const favoriteData = {
      img: wrap.find('.product-img-wrap img').attr('src'),
      link: wrap.find('.product-title').attr('href'),
      name: wrap.find('.product-title').attr('title'),
      price: wrap.find('.price').text().slice(1),
      sale: wrap.find('.sale-price').length > 0 ? wrap.find('.sale-price').text().slice(1) : false,
      storeName: wrap.find('.store-name').text()
    }
    const subject = $(this).hasClass('active') ? 'removeFavorite' : 'setFavorite'
    const data = $(this).hasClass('active') ? favoriteData.link : favoriteData
    if(_data.currentPageProducts) {
      _data.currentPageProducts.forEach((p)=> {
        if(p.link == favoriteData.link) {
          p.favorite = (subject === 'removeFavorite' ? false : true)
        }
      })
    }
    let newFavorites = [];
    const allProductElems = $(`.product .product-desc .product-title[href="${favoriteData.link}"]`).parents('.product')
    if(subject === 'removeFavorite') {
      userMessage("removed favorite")
      allProductElems.find('.favorited-tag').removeClass('active')
      setTimeout(() => {
        allProductElems.find('.favorited-tag').removeClass('reverse-transition')
      }, 600)
      allProductElems.find('.favorite-btn').removeClass('active')
      allProductElems.find('.favorite-btn').attr('data-tooltip', 'Favorite')
      allProductElems.find('.favorite-btn .tooltip .tooltip-text').text('Favorite')
      newFavorites = await removeFavoriteProducts(favoriteData)
    } else if (subject === 'setFavorite') {
      userMessage("added favorite")
      allProductElems.find('.favorited-tag').addClass('active')
      setTimeout(() => {
        allProductElems.find('.favorited-tag').addClass('reverse-transition')
      }, 600)
      allProductElems.find('.favorite-btn').addClass('active')
      allProductElems.find('.favorite-btn').attr('data-tooltip', 'Remove Favorite')
      allProductElems.find('.favorite-btn .tooltip .tooltip-text').text('Remove Favorite')
      newFavorites = await setFavoriteProducts(favoriteData)
    }
    setLoader(true, 'favorites-container')
    handleFavoriteItems(newFavorites)
  })


  $(document).ready(async () => {
    setLoader(true, 'favorites-container')
    _data.favorites = await getFavoriteProducts()
    handleFavoriteItems(_data.favorites)
  })
})

$('.similar-clothing-container .not-store-page .all-stores-link').click(function() {
  $('.container').removeClass('active')
  $('.stores-container').addClass('active')
  $('.header .nav-wrap .nav-item').removeClass('active')
  $('.header .nav-wrap .nav-stores').addClass('active')
});

$(() => {
  $('.header .nav-wrap .nav-item').click(function() {
    $('.container').removeClass('active')
    $(`.${$(this).data('linked-container')}`).addClass('active')
    $('.header .nav-wrap .nav-item').removeClass('active')
    $(this).addClass('active')
  })
})
