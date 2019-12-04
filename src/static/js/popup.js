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
  {name: "Stussy", url: "https://www.stussy.com"},
  {name: "Levi's", url: "https://www.levi.com"},
  {name: "Paul Smith", url: "https://www.paulsmith.com"},
  {name: "Louis Vuitton", url: "https://www.louisvuitton.com"},
  {name: "Champion", url: "https://www.champion.com"},
  {name: "PINK", url: "https://www.victoriassecret.com/pink"},
  {name: "Chanel", url: "https://www.chanel.com"},
  {name: "FENDI", url: "https://www.fendi.com"},
  {name: "Prada", url: "https://www.prada.com"},
  {name: "Guess", url: "https://shop.guess.com"},
  {name: "ASOS", url: "https://www.asos.com/us"},
]

const appendProduct = (data, container) => {
  data.shortenName = data.name.length > 30 ? data.name.slice(0,40) + "..." : data.name
  $(container).append(`
    <div class="product-wrap">
      <div class="favorite-btn ${data.favorite ? 'active' : ''}"><i class="fas fa-star fa-lg"></i></div>
      <div class="product-data">
        <img class="product-img" src="${data.img}" onerror='this.onerror = null; this.src="https://anf.scene7.com/is/image/anf/anf_208178_07_prod1?$grid-anf-v1$"'>
        <div class="basic-product-info">
          <a href="${data.link}" target="_blank" class="product-name" title="${data.name}">${data.shortenName}</a>
          ${data.sale ?
            `<p class="product-price "><span class="strikethrough-price">$${data.price}</span><br><span class="sale-price">$${parseFloat(data.sale).toFixed(2)}</span></p>` :
            `<p class="product-price ${data.price == "SOLD OUT" ? "sold-out" : ""}">${(data.price != "SOLD OUT" ? "$" : "") + parseFloat(data.price).toFixed(2)}</p>`
          }

        </div>
      </div>
      <h2 class="store-name">${data.storeName}</h2>
    </div>
  `)
}

const appendStoresAlphabetically = (stores) => {
  stores.sort((a,b) => {
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
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

appendStoresAlphabetically(allStores)

const setSimilarItems = (products) => {
  if(products.length === 0) return;
  $('.similar-items-content .all-products .product-wrap').remove()
  _data.currentPageProducts = products
  console.log(products)
  products.forEach((p) => {
    appendProduct(p, '.similar-items-content .all-products')
  })
}

const setSearchProducts = (data) => {
  $('.search-stores .all-products .loader').hide()
  if(data.products.length < 1) {
    $('.search-stores .all-products .no-results').show()
    $('.search-stores .all-products .no-results span').text(data.search)
  }
  data.products.forEach((p) => {
    appendProduct(p, '.search-stores .all-products')
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
  getFavoriteProducts()
  getProductsTimer = setInterval(getSimilarProductInfo, 100)
});

$('.view-similar-items-wrap p').click(function() {
  $('.main').removeClass('similar-items-active')
  $('.content-wrap').removeClass('active')
  $('.footer .nav .nav-item').removeClass('active')
  $('.similar-items-content').addClass('active')
})

$('.footer .nav-item-search').click(function() {
  $('.main').addClass('similar-items-active')
  $('.content-wrap').removeClass('active')
  $('.search-stores').addClass('active')
})

$('.footer .nav-item-favorites').click(function() {
  $('.main').addClass('similar-items-active')
  $('.content-wrap').removeClass('active')
  $('.your-favorites').addClass('active')
})

$('.similar-items-content').scroll(function(e) {
  if($(this).scrollTop() > 350) {
    $('.similar-items-content .return-to-top-btn').addClass('active')
  } else {
    $('.similar-items-content .return-to-top-btn').removeClass('active')
  }
})

$(() => {
  var animatedScrollActive = false;

  $('.similar-items-content .return-to-top-btn').click(function(e) {
    if(animatedScrollActive) {
      return;
    }
    animatedScrollActive = true;

    $('.similar-items-content').animate({
      scrollTop: 0
    }, 1000, () => {
      animatedScrollActive = false;
    })
  })
})

$('.footer .nav .nav-item').click(function() {
  $('.footer .nav .nav-item').removeClass('active')
  $(this).addClass('active')
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

$(document).ready(() => {
  $('.search-stores .content-header .content-title').text(`All Stores (${allStores.length})`)
})

$(document).on('click', '.product-wrap .favorite-btn', function() {
  const wrap = $(this).parent()
  const favoriteData = {
    img: wrap.find('.product-img').attr('src'),
    link: wrap.find('.product-name').attr('href'),
    name: wrap.find('.product-name').text(),
    price: wrap.find('.sale-price').length > 0 ? wrap.find('.strikethrough-price').text().slice(1) : wrap.find('.product-price').text().slice(1),
    sale: wrap.find('.sale-price').length > 0 ? wrap.find('.sale-price').text().slice(1) : false,
    storeName: wrap.find('.store-name').text()
  }
  const subject = $(this).hasClass('active') ? 'removeFavorite' : 'setFavorite'
  const data = $(this).hasClass('active') ? favoriteData.link : favoriteData
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
