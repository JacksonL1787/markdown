if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    //Define product description for search
    let gender = ""
    if($('.breadcrumbs-panel .breadcrumb-link span').text().toLowerCase().includes('women')) {
      gender = "Womens"
    } else if ($('.breadcrumbs-panel .breadcrumb-link span').text().toLowerCase().includes('men')) {
      gender = "Men"
    }
    let string = ''
    string += gender
    string += ' ' + $('.product-title-container .product-title h1').text()
    string += ' ' + $('.color-display-header .color-display-name').text()
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.nordstrom
    ], await getKeywords())
  })
}
