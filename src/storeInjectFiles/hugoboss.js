if(!window.initDone) {
  window.initDone = true
  let allProducts = [];

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

  const getProducts = async () => {
    const keywords = await getKeywords()
    chrome.runtime.sendMessage({subject: 'getProducts', data: {stores: ["nordstrom"], keywords: keywords}}, function(response) {
      allProducts = response
    });
  }
  getProducts()
  chrome.runtime.onMessage.addListener((request, sender, response) => {
    if(request.from === "popup" && request.subject === "productInfo") {
      response(allProducts);
    }
  });
}
