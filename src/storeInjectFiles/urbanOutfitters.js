if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    let gender = ""
    if($('.c-breadcrumb .c-breadcrumb__li a span').text().toLowerCase().includes('women')) {
      gender = "women"
    } else if ($('.c-breadcrumb .c-breadcrumb__li a span').text().toLowerCase().includes('men')) {
      gender = "men"
    }
    let string = ''
    string += gender
    string += ' ' + $('.o-list-swatches .o-list-swatches__li .o-list-swatches__a--selected').attr('title')
    string += ' ' + $('.g-product-meta .s-product-meta h1.c-product-meta__h1 span').text()
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.asos,
      storeInformation.americaneagle
    ], await getKeywords())
  })
}
