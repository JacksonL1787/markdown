if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    let gender = ""
    if($('.breadcrumb-container .breadcrumbs-link').text().toLowerCase().includes('girls')) {
      gender = "women"
    } else if ($('.breadcrumb-container .breadcrumbs-link').text().toLowerCase().includes('guys')) {
      gender = "men"
    }
    let string = ''
    string += gender
    string += ' ' + $('.product-name .product-title-component').text()
    string += ' ' + $('.product-page__swatches-attributes .product-swatches .tile-input.selected input').data('swatch')
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.pacsun,
      storeInformation.americaneagle,
      storeInformation.abercrombiefitch,
      storeInformation.urbanoutfitters
    ], await getKeywords())
  })
}
