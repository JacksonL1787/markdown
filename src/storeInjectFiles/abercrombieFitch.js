if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    let string = ''
    let gender = ''
    console.log($('.breadcrumb-container .breadcrumbs-link').text())
    if($('.breadcrumb-container .breadcrumbs-link').text().toLowerCase().includes("womens")) {
      gender = "Womens"
    } else if ($('.breadcrumb-container .breadcrumbs-link').text().toLowerCase().includes("mens")) {
      gender = "Mens"
    }
    string += ' ' + gender
    string += $('.product-page__swatches-attributes .selected-swatch__label ').text().replace('Shown in', '')
    string += ' ' + $('.product-title-main-header').text()
    string += $('.short-description').text()
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.hollister,
      storeInformation.urbanoutfitters
    ], await getKeywords())
  })
}
