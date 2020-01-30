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

const appendProduct = (data, container) => {
  data.shortenName = data.name.length > 30 ? data.name.slice(0,30) + "..." : data.name
  let salePrice = sale = data.sale ? `$${parseFloat(data.sale).toFixed(2)}` : false
  let price = isNaN(parseFloat(data.price)) ? "Unknown Price" : `$${parseFloat(data.price).toFixed(2)}`
  $(container).append(`

    <div class="product">
      <h2 class="store-name">${data.storeName}</h2>
      <div class="product-img-wrap" data-link="${data.link}">
        <img src="${data.img}" alt="${data.name}">
        <div class="favorite-btn ${data.favorite ? "active" : ""}">
          <div class="icon"></div>
        </div>
        <div class="favorited-tag ${data.favorite ? "active" : ""}">
          <p>Favorited</p>
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
  console.log($elem)
  if($elem.hasClass('img-darken-overlay')) {
    window.open($elem.parent('.product-img-wrap').data('link'), "_blank")
  }
  if($elem.hasClass('product-img-wrap')) {
    window.open($elem.data('link'), "_blank")
  }
})



/*

  HOME - STORES

*/

$(() => {

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
    console.log(allStores)
    console.log(search)
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
    console.log(link)
    window.open(link, "_blank");
  })

  const getAllStores = async () => {
    const response = await fetch(chrome.runtime.getURL('/src/stores.json'))
    const stores = await response.json()
    return await stores;
  }

  const handleStores = async (stores) => {
    allStores = await getAllStores()
    appendStoresAlphabetically(allStores)
    setLoader(false, 'stores-container')
    // TODO: Show Search Bar
  }

  $(document).ready( async() => {
    setLoader(true, 'stores-container')
    handleStores()
  })
})

const stopSimilarProductsPoll = () => {
  clearInterval(getProductsTimer)
  setLoader(false, 'similar-clothing-container')
}

const handleSimilarItems = (similarItems) => {
  if(!similarItems) return;
  if(similarItems.status === "not store page") {
    stopSimilarProductsPoll()
    $('.similar-clothing-container .container-msg').removeClass('show')
    $('.similar-clothing-container .not-store-page').addClass('show')
    return;
  }

  if(similarItems.status === "not product page") {
    stopSimilarProductsPoll()
    $('.similar-clothing-container .container-msg').removeClass('show')
    $('.similar-clothing-container .go-to-product-page').addClass('show')
    return;
  }

  if(similarItems.status === "processing") {
    $('.similar-clothing-container .container-msg').removeClass('show')
    $('.similar-clothing-container .loading-products').addClass('show')
    return;
  }

  if(similarItems.status === "no products") {
    stopSimilarProductsPoll()
    $('.similar-clothing-container .container-msg').removeClass('show')
    $('.similar-clothing-container .not-store-page').removeClass('show')
    return;
  }
  //$('.similar-items-content .sort-by-wrap').addClass('active')
  $('.similar-clothing-container .container-msg').removeClass('show')
  $('.similar-clothing-container .clothing-content .product').remove()
  $('.header .nav-similar-clothing .clothes-active').show()
  _data.currentPageProducts = similarItems.products
  similarItems.products.forEach((p) => {
    appendProduct(p, '.similar-clothing-container .clothing-content')
  })
}

const getSimilarProductInfo = () => {
  if(_data.currentPageProducts) {
    clearInterval(getProductsTimer)
    setLoader(false, 'similar-clothing-container')
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
          subject: 'productInfo'
        },
        handleSimilarItems);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  setLoader(true, 'similar-clothing-container')
  getProductsTimer = setInterval(getSimilarProductInfo, 100)
});



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

const sortSimilarProducts = (filter) => {
  if(_data.currentPageProducts) {
    let currArr = Array.from(_data.currentPageProducts)
    if (filter == "Highest Price") {
      currArr.sort((a, b) => {
        let priceA = a.sale ? parseFloat(a.sale) : parseFloat(a.price)
        let priceB = b.sale ? parseFloat(b.sale) : parseFloat(b.price)
        return (isNaN(priceB) ? 0 : priceB)  - (isNaN(priceA) ? 0 : priceA)
      })
      console.log(currArr)
    } else if (filter == "Lowest Price") {
      currArr.sort((a, b) => {
        let priceA = a.sale ? parseFloat(a.sale) : parseFloat(a.price)
        let priceB = b.sale ? parseFloat(b.sale) : parseFloat(b.price)
        return (isNaN(priceA) ? Math.pow(10, 1000) : priceA)  - (isNaN(priceB) ? Math.pow(10, 1000) : priceB)
      })
      console.log(currArr)
    }
    $('.similar-items-content .all-products .product-wrap').remove()
    currArr.forEach((p) => {
      appendProduct(p, '.similar-items-content .all-products')
    })
  }
}

// $('.similar-items-content .sort-by-btn').click(function() {
//   $('.sort-by-menu').toggleClass('active')
// })
//
// $('.similar-items-content .sort-by-menu .option').click(function() {
//   $('.similar-items-content .sort-by-btn .selected-option').text($(this).children('span').text())
//   $('.sort-by-menu').removeClass('active')
//   sortSimilarProducts($(this).children('span').text())
// })

$(() => {
  let elemTimeout;

  const handleFavoriteItems = (data) => {
    setTimeout(() => {
      setLoader(false, 'favorites-container')
    }, 200)

    $('.favorites-container .clothing-content .product').remove()
    console.log(data)
    if(!data) {
      $('.favorites-container .no-favorites').addClass('show')
      return;
    }
    if(data.length < 1) {
      $('.favorites-container .no-favorites').addClass('show')
      return;
    }
    $('.favorites-container .no-favorites').removeClass('show')
    data.forEach((p) => {
      appendProduct({...p, favorite: true}, '.favorites-container .clothing-content')
    })
  }

  const getFavoriteProducts = () => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(['favorites'], (data) => {
        console.log('rawData', data['favorites'])
        const favorites = data['favorites']?data['favorites']:[];
        console.log(favorites)
        resolve(favorites)
      })
    })
  }

  const setFavoriteProducts = (product) => {
    return new Promise((resolve, reject) => {
      console.log(product)
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
      console.log(product)
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

  const favoriteMessage = (status) => {
    if($('.favorite-message-wrap').hasClass('active')) {
      clearTimeout(elemTimeout)
    }
    $('.favorite-message-wrap').empty().removeClass('active').removeClass('red').removeClass('green')
    setTimeout(() => {
      $('.favorite-message-wrap').addClass('active')
      if(status === "added") {
        $('.favorite-message-wrap').addClass('green')
        $('.favorite-message-wrap')
          .append(`
            <div class="icon-wrap">
              <div class="icon added"></div>
            </div>
            <p class="msg">Added Item to Favorites</p>
          `)
      } else if (status === "removed") {
        $('.favorite-message-wrap').addClass('red')
        $('.favorite-message-wrap')
          .append(`
            <div class="icon-wrap">
              <div class="icon removed"></div>
            </div>
            <p class="msg">Removed Item from Favorites</p>
          `)
      }
      elemTimeout = setTimeout(() => {
        $('.favorite-message-wrap').removeClass('active')
      }, 2500)
    }, 100)
  }

  $(document).on('click', '.clothing-content .favorite-btn', async function() {
    const wrap = $(this).parent().parent()
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
    if(subject === 'removeFavorite') {
      favoriteMessage("removed")
      $(`.clothing-content .product .product-title[href="${favoriteData.link}"]`).parent().siblings('.product-img-wrap').children('.favorited-tag').removeClass('active')
      $(`.clothing-content .product .product-title[href="${favoriteData.link}"]`).parent().siblings('.product-img-wrap').children('.favorite-btn').removeClass('active')
      console.log(favoriteData)
      newFavorites = await removeFavoriteProducts(favoriteData)
    } else if (subject === 'setFavorite') {
      favoriteMessage("added")
      $(`.clothing-content .product .product-title[href="${favoriteData.link}"]`).parent().siblings('.product-img-wrap').children('.favorited-tag').addClass('active')
      $(`.clothing-content .product .product-title[href="${favoriteData.link}"]`).parent().siblings('.product-img-wrap').children('.favorite-btn').addClass('active')
      console.log(favoriteData)
      newFavorites = await setFavoriteProducts(favoriteData)
    }
    setLoader(true, 'favorites-container')
    console.log(newFavorites)
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
