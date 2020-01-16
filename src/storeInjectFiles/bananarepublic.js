if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    let gender = ''
    if($('.product-breadcrumb .sds_link-a').text().toLowerCase().includes('men')) {
      gender = 'Men'
    } else if($('.product-breadcrumb .sds_link-a').text().toLowerCase().includes('women')) {
      gender = 'Women'
    }
    //Define product description for search
    let string = ''
    string += $('#swatch-label--Color .label-value').text()
    string += ' ' + gender
    string += ' ' + $('.product-title .product-title__text').text()
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.jcrew,
      storeInformation.nordstromrack,
      storeInformation.gap,
      storeInformation.nordstrom,
      storeInformation.oldnavy
    ], await getKeywords())
  })
}
