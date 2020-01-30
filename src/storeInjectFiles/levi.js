if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    let gender = ""
    if($('.breadcrumb-section .breadcrumb li a').text().toLowerCase().includes('women')) {
      gender = "women"
    } else if ($('.breadcrumb-section .breadcrumb li a').text().toLowerCase().includes('men')) {
      gender = "men"
    }
    let string = ''
    string += gender
    string += ' ' + $('.product-swatches .swatch.active img').attr('alt')
    string += ' ' + $('.product-details .name').text()
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.target,
      storeInformation.hm
    ], await getKeywords())
  })
}
