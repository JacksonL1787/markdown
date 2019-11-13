let _data = {};

let getProductsTimer;

const appendProduct = (data, container) => {
  data.name = data.name.length > 40 ? data.name.slice(0,40) + "..." : data.name
  $(container).append(`
    <div class="product-wrap">
      <div class="favorite-btn ${data.favorite ? 'active' : ''}"><i class="fas fa-star fa-lg"></i></div>
      <div class="product-data">
        <img class="product-img" src="${data.img}">
        <div class="basic-product-info">
          <a href="${data.link}" target="_blank" class="product-name">${data.name}</a>
          <p class="product-price ${data.price == "SOLD OUT" ? "sold-out" : ""}">${(data.price != "SOLD OUT" ? "$" : "") + data.price}</p>
        </div>
      </div>
      <h2 class="store-name">${data.storeName}</h2>
    </div>
  `)
}

const setSimilarItems = (products) => {
  if(products.length === 0) return;
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

const showSearch = () => {
  $('.main').addClass('similar-items-active')
  if($('.search-select-stores').hasClass('active-search-page')) {
    $('.content-wrap').removeClass('active')
    $('.search-select-stores').addClass('active')
  } else {
    $('.content-wrap').removeClass('active')
    $('.search-stores').addClass('active')
    $('.search-stores .search-bar .search-inpt').focus()
  }
}

const searchProductsByStore = (search, stores) => {
  if(search.trim().length < 1) return;
  $('.search-stores .all-products .product-wrap').remove()
  $('.search-stores .all-products .loader').show()
  $('.search-stores .all-products .no-results').hide()
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        from: 'popup',
        subject: 'getProductsByStore',
        data: {
          stores: stores,
          keywords: search
        }
      },
      setSearchProducts);
  });
};

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

$(document).on('click', '.search-select-stores .store-select .store-label', function() {
  $(this).parent().toggleClass('active')
  if($('.search-select-stores .store-select.active').length > 0) {
    $('.search-select-stores .continue-to-search-btn').addClass('active')
  } else {
    $('.search-select-stores .continue-to-search-btn').removeClass('active')
  }
})

$('.search-select-stores .continue-to-search-btn').click(function() {
  if(!$(this).hasClass('active')) return;
  let dataStores = ''
  $('.search-select-stores .stores .store-select.active').each(function() {
    dataStores += $(this).attr('data-store') + ','
  })
  $('.search-stores .search-bar').attr('data-stores', dataStores)
  console.log($('.search-stores .search-bar .search-inpt'))
  $('.search-select-stores').removeClass('active-search-page')
  $('.search-stores').addClass('active-search-page')
  showSearch()
})

$('.view-similar-items-wrap p').click(function() {
  $('.main').removeClass('similar-items-active')
  $('.content-wrap').removeClass('active')
  $('.similar-items-content').addClass('active')
})

$('.footer .nav-item-search').click(function() {
  showSearch()
})

$('.footer .nav-item-favorites').click(function() {
  $('.main').addClass('similar-items-active')
  $('.content-wrap').removeClass('active')
  $('.your-favorites').addClass('active')
})

$('.search-stores .search-bar .search-btn').click(function() {
  const search = $('.search-stores .search-bar .search-inpt').val()
  const stores = $('.search-stores .search-bar').attr('data-stores').split(',')
  searchProductsByStore(search, stores)
})

$('.search-stores .search-bar .search-inpt').keypress(function(e) {
  if(e.keyCode == 13) {
    const search = $('.search-stores .search-bar .search-inpt').val()
    const stores = $('.search-stores .search-bar').attr('data-stores').split(',')
    searchProductsByStore(search, stores)
  }
})

$('.search-stores .change-stores-btn').click(function(e) {
  $('.search-stores .all-products .product-wrap').remove()
  $('.search-stores .search-bar .search-inpt').val("")
  $('.search-select-stores').addClass('active-search-page')
  $('.search-stores').removeClass('active-search-page')
  showSearch()
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

$(document).on('click', '.product-wrap .favorite-btn', function() {
  const wrap = $(this).parent()
  const favoriteData = {
    img: wrap.find('.product-img').attr('src'),
    link: wrap.find('.product-name').attr('href'),
    name: wrap.find('.product-name').text(),
    price: wrap.find('.product-price').text().slice(1),
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
