if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    let gender = ''
    if($('.product-breadcrumb .product-breadcrumb__link').text().toLowerCase().includes('women')) {
      gender = 'Womens'
    } else if($('.product-breadcrumb .product-breadcrumb__link').text().toLowerCase().includes('men')) {
      gender = 'Men'
    }
    //Define product description for search
    let string = ''
    string += $('#swatch-label--Color .swatch-label__value').text()
    string += ' ' + gender
    string += ' ' + $('.product-title .product-title__text').text()
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.jcrew,
      storeInformation.gap,
      storeInformation.oldnavy
    ], await getKeywords())
  })
}
