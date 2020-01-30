if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    let gender = ""
    if($('#pdp-breadcrumb .breadcrumbs li a').text().toLowerCase().includes('women')) {
      gender = "women"
    } else if ($('#pdp-breadcrumb .breadcrumbs li a').text().toLowerCase().includes('men')) {
      gender = "men"
    }
    let string = ''
    string += gender
    string += ' ' + $('#product-info .product-content-info-name').text()
    string += ' ' + $('.color-swatches-js .attr-box.selected').data('attribute-value')
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
