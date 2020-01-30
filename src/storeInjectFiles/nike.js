if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    let string = ''
    string += ' ' + $('.pr12-sm h2[data-test="product-sub-title"]').text()
    string += ' ' + $('.description-preview .description-preview__features .description-preview__color-description').text().replace('Shown: ', '')
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.adidas
    ], await getKeywords())
  })
}
