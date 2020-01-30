if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    let gender = ""
    console.log('test')
    if(window.location.pathname.includes('womens_category')) {
      gender = "women"
    } else if (window.location.pathname.includes('mens_category')) {
      gender = "men"
    }
    let string = ''
    string += gender
    string += ' ' + $('.c-product__colors .colors-list__item.is-selected').data('name')
    string += ' ' + $('#product-name__p').text()
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
