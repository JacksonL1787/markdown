if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    let string = ''
    let gender = ''
    if($('.bc-item span').text().toLowerCase().includes('men')) {
      gender = 'Men'
    } else if($('.bc-item span').text().toLowerCase().includes('women')) {
      gender = 'Women'
    }
    string += gender
    string += ' ' + $('h1.product-name').text()
    string += ' ' + $('.qa-product-detail-selection .psp-product-color span').text()
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.pacsun
    ], await getKeywords())
  })
}
