let _data = {};

let getProductsTimer;

const allStores = [
  {name: "Nordstrom", url: "https://shop.nordstrom.com"},
  {name: "Hugo Boss", url: "https://hugoboss.com"},
  {name: "Pacsun", url: "https://pacsun.com"},
  {name: "Hollister", url: "https://hollister.com"},
  {name: "Vans", url: "https://vans.com"},
  {name: "Nike", url: "https://www.nike.com"},
  {name: "American Eagle", url: "https://www.ae.com"},
  {name: "Adidas", url: "https://www.adidas.com"},
  {name: "Urban Outfitters", url: "https://www.urbanoutfitters.com"},
  {name: "Victoria's Secret", url: "https://www.victoriassecret.com/"},
  {name: "Brandy Melville", url: "https://www.brandymelvilleusa.com"},
  {name: "Abercrombie & Fitch", url: "https://www.abercrombie.com"},
  {name: "Hot Topic", url: "https://www.hottopic.com"},
  {name: "Old Navy", url: "https://oldnavy.gap.com"},
  {name: "Zumiez", url: "https://www.zumiez.com"},
  {name: "Gap", url: "https://www.gap.com"},
  {name: "Banana Republic", url: "https://bananarepublic.gap.com"},
  {name: "J.Crew", url: "https://www.jcrew.com"},
  {name: "H&M", url: "https://www2.hm.com"},
  {name: "Blooming Dale's", url: "https://www.bloomingdales.com"},
  {name: "Billabong", url: "https://www.billabong.com"},
  {name: "Nordstrom Rack", url: "https://www.nordstromrack.com"},
  {name: "North Face", url: "https://www.thenorthface.com"},
  {name: "Levi's", url: "https://www.levi.com"},
  {name: "Louis Vuitton", url: "https://www.louisvuitton.com"},
  {name: "Champion", url: "https://www.champion.com"},
  {name: "PINK", url: "https://www.victoriassecret.com/pink"},
  {name: "Guess", url: "https://shop.guess.com"},
  {name: "ASOS", url: "https://www.asos.com"},
  {name: "Target", url: "https://www.target.com"}
]

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

const appendStoresAlphabetically = (stores) => {
  stores.sort((a,b) => {
    if(a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
    if(a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
    return 0;
  })
  stores.forEach((s) => {
    let letter = s.name[0]
    console.log(letter)
    if($(`#${letter}`).length <= 0) {
      $('.search-stores .stores').append(`
        <div class="alphabetic-store-wrap" id="${letter}">
          <h2 class="alphabetic-title">${letter}</h2>
          <div class="store-links"></div>
        </div>
      `)
    }
    $(`#${s.name[0]} .store-links`).append(`
      <div class="store-label-wrap" data-store="${s.name.toLowerCase()}">
        <a class="store-link" href="${s.url}" target="_blank">${s.name}</a>
      </div>
    `)
  })
}

// appendStoresAlphabetically(allStores)

const setSimilarItems = (products) => {
  if(products.length === 0) return;
  //$('.similar-items-content .sort-by-wrap').addClass('active')
  $('.similar-clothing-container .clothing-content .product').remove()
  _data.currentPageProducts = products
  console.log(products)
  products.forEach((p) => {
    appendProduct(p, '.similar-clothing-container .clothing-content')
  })
}

const getSimilarProductInfo = () => {
  if(_data.currentPageProducts) {
    clearInterval(getProductsTimer)
    $('.similar-items-content .all-products .loader').hide()
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
        setSimilarItems);
  });
}

const getFavoriteProducts = () => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    chrome.tabs.sendMessage(
        tabs[0].id,
        {
          from: 'popup',
          subject: 'getFavorites'
        },
        updateFavoriteItems);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  //getFavoriteProducts()
  getProductsTimer = setInterval(getSimilarProductInfo, 100)
});



$(() => {
  var animatedScrollActive = false;

  $('#main').scroll(function(e) {
    if(!$('.similar-clothing-container').hasClass('active')) {
      return;
    }
    if($(this).scrollTop() > 350) {
      $('.similar-clothing-container .back-to-top-btn').addClass('active')
    } else {
      $('.similar-clothing-container .back-to-top-btn').removeClass('active')
    }
  })

  $('.similar-clothing-container .back-to-top-btn').click(function(e) {
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


const updateFavoriteItems = (data) => {
  console.log(data)
  $('.your-favorites .all-products .product-wrap').remove()
  if(!data) {
    $('.your-favorites .all-products .no-favorites').show()
    return;
  }
  if(data.length < 1) {
    $('.your-favorites .all-products .no-favorites').show()
    return;
  }
  $('.your-favorites .all-products .no-favorites').hide()
  data.forEach((p) => {
    appendProduct({...p, favorite: true}, '.your-favorites .all-products')
  })
}

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

// $(document).ready(() => {
//   $('.search-stores .content-header .content-title').text(`All Stores (${allStores.length})`)
// })

$(document).on('click', '.product-wrap .favorite-btn', function() {
  const wrap = $(this).parent()
  const favoriteData = {
    img: wrap.find('.product-img').attr('src'),
    link: wrap.find('.product-name').attr('href'),
    name: wrap.find('.product-name').attr('title'),
    price: wrap.find('.sale-price').length > 0 ? wrap.find('.strikethrough-price').text().slice(1) : wrap.find('.product-price').text().slice(1),
    sale: wrap.find('.sale-price').length > 0 ? wrap.find('.sale-price').text().slice(1) : false,
    storeName: wrap.find('.store-name').text()
  }
  const subject = $(this).hasClass('active') ? 'removeFavorite' : 'setFavorite'
  const data = $(this).hasClass('active') ? favoriteData.link : favoriteData
  _data.currentPageProducts.forEach((p)=> {
    if(p.link == favoriteData.link) {
      p.favorite = (subject === 'removeFavorite' ? false : true)
    }
  })
  if(subject === 'removeFavorite') {
    $(`.all-products .product-wrap .product-name[href="${favoriteData.link}"]`).parent().parent().siblings('.favorite-btn').removeClass('active')
  } else if (subject === 'setFavorite') {
    $(`.all-products .product-wrap .product-name[href="${favoriteData.link}"]`).parent().parent().siblings('.favorite-btn').addClass('active')
  }
  console.log(favoriteData)
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    chrome.tabs.sendMessage(
        tabs[0].id,
        {
          from: 'popup',
          subject: subject,
          product: data
        },
        updateFavoriteItems);
  });
})
