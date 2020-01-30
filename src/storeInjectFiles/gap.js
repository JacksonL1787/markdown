if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    //Define product description for search
    gender = ""
    if($('.product-breadcrumb a').text().toLowerCase().includes('women')) {
      gender = "women"
    } else if ($('.product-breadcrumb a').text().toLowerCase().includes('men')) {
      gender = "men"
    }
    let string = ""
    string += gender
    string += ' ' + $('.product-title .product-title__text').text()
    string += ' ' + $('.buy-box__swatch-container--color .swatch-label__value').text()
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.jcrew,
      storeInformation.hm,
      storeInformation.nordstrom
    ], await getKeywords())
  })
}
