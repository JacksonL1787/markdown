if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    let gender = ""
    if($('#pdp-breadcrumb .page-breadcrumb-token').text().toLowerCase().includes('women')) {
      gender = "women"
    } else if ($('#pdp-breadcrumb .page-breadcrumb-token').text().toLowerCase().includes('men')) {
      gender = "men"
    }
    let string = ''
    string += gender
    string += ' ' + $('.attr-color .product-content-form-step-header .product-content-form-attr-selected.attr-selected').text()
    string += ' ' + $('#product-info h1.product-info-js').text()
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.pacsun,
      storeInformation.zumiez
    ], await getKeywords())
  })
}
