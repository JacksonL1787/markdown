if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    //Define product description for search
    let gender = ''
    if($('script').text().includes('"gender":"Women"')) {
      gender = 'Womens'
    } else if ($('script').text().includes('"gender":"Men"')) {
      gender = 'Men'
    }
    let string = ''
    string += ' ' + gender
    string += ' ' + $('.asos-product.single-product #aside-content .colour-component .product-colour').text()
    string += ' ' + $('.asos-product.single-product .layout-aside .product-hero h1').text()
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.urbanoutfitters,
      storeInformation.abercrombiefitch
    ], await getKeywords())
  })
}
