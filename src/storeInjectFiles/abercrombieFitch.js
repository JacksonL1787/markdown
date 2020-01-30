if(!window.initDone) {
  window.initDone = true

  if($('').length > 0) {
    console.log("PRODUCT PAGE")
  } else {
    console.log("NOT PRODUCT PAGE")
  }

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
    string += ' ' + $('.product-title-main-header').text()
    string += $('.short-description').text()
    string += $('.tile-input.product-swatch__attr.selected').children('input').attr('data-swatch-color-family')
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.hm,
      storeInformation.hollister,
      storeInformation.americaneagle,
      storeInformation.gap,
      storeInformation.jcrew,
      storeInformation.urbanoutfitters
    ], await getKeywords())
  })
}
