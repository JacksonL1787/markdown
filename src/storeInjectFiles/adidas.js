if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    //Define product description for search
    let string = ''
    string += ' ' + $('.subtitle___2z5HL').text()
    string += ' ' + $('.product_information___1Tt1L .product_title').text()
    string += ' ' + $('.color_text___mgoYV').text()
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.nike
    ], await getKeywords())
  })
}
