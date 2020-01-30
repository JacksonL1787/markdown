if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    //Define product description for search
    let gender = ''
    console.log($('._1MMuO3r li a').text().toLowerCase().incl)
    if($('._1MMuO3r li a').text().toLowerCase().includes('women')) {
      gender = 'Womens'
    } else if ($('._1MMuO3r li a').text().toLowerCase().includes('men')) {
      gender = 'Men'
    }
    let string = ''
    string += ' ' + gender
    string += ' ' + $('.asos-product.single-product .layout-aside .product-hero h1').text()
    string += ' ' + $('.asos-product.single-product .colour-component .product-colour').text()
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.abercrombiefitch,
      storeInformation.urbanoutfitters
    ], await getKeywords())
  })
}
