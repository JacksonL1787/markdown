if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    let gender = ""
    if($('.category-breadcrumbs .category-breadcrumbs__item .category-breadcrumbs__label').text().toLowerCase().includes('women')) {
      gender = "women"
    } else if ($('.category-breadcrumbs .category-breadcrumbs__item .category-breadcrumbs__label').text().toLowerCase().includes('men')) {
      gender = "men"
    }
    let string = ''
    string += gender
    string += ' ' + $('.product-details__title .product-details__title-name').text()
    string += ' ' + $('.sku-option__items .sku-item.sku-item--selected input').attr('value')
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
