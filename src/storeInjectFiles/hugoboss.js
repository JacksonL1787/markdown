if(!window.initDone) {
  window.initDone = true

  var storeInformation = {
    nordstrom: {id: "nordstrom", url: "https://shop.nordstrom.com/", name: "Nordstrom"},
    vans: {id: "vans", url: "https://vans.com/", name: "Vans"},
    pacsun: {id: "pacsun", url: "https://pacsun.com/", name: "Pacsun"},
    hollister: {id: "hollister", url: "https://hollister.com/", name: "Hollister"}
  }

  const getKeywords = async () => {
    let string = ''
    string += $('.product-stage__control-item--color').children('p').text().trim().replace('Color: ', '')
    string += ' ' + $('.product-stage__controls--product-detail .product-stage__headline').text()
    string += ' ' + ($('.breadcrumb__list--back-and-social-header .breadcrumb__title.Men').text() ? $('.breadcrumb__list--back-and-social-header .breadcrumb__title.Men').text() : $('.breadcrumb__list--back-and-social-header .breadcrumb__title.Women').text())
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    console.log(getSearchKeywords(string, keywords))
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    console.log(storeInformation)
    getProducts([
      storeInformation.nordstrom,
      storeInformation.vans,
      storeInformation.pacsun,
      storeInformation.hollister
    ], await getKeywords())
  })

  $(document).on('click', '.swatch-list__container .swatch-list__button', function() {
    window.location.replace($(this).children().attr('href'))
  })
}
