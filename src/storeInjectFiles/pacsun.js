if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    let string = ''
    string += $('.rwd-pdp-name').text()
    string += ' ' + $('.rwd-breadcrumb li').first().find('span').text()
    string += ' ' + $('.rwd-swatch-value').text()
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    console.log(getSearchKeywords(string, keywords))
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.zumiez,
      storeInformation.urbanoutfitters,
      storeInformation.hollister,
      storeInformation.vans,
      storeInformation.asos
    ], await getKeywords())
  })
}
