if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    let gender = ""
    if($('.breadcrumbs-list .breadcrumb-list-item span').text().toLowerCase().includes('women')) {
      gender = "women"
    } else if ($('.breadcrumbs-list .breadcrumb-list-item span').text().toLowerCase().includes('men')) {
      gender = "men"
    }
    let string = ''
    string += gender
    string += ' ' + $('.product-detail-info .product-item-headline').text()
    string += ' ' + $('.product-detail-info .product-colors .group .list-item a.active').attr('title')
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.asos,
      storeInformation.urbanoutfitters
    ], await getKeywords())
  })
}
