if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    //Define product description for search
    let gender = ''
    if($('.breadcrumbs-main .breadcrumb li a').text().toLowerCase().includes('women')) {
      gender = "Women"
    } else if ($('.breadcrumbs-main .breadcrumb li a').text().toLowerCase().includes('women')) {
      gender = "Men"
    }
    let string = ''
    string += gender
    string += '' + $('#selectedColor').text()
    string += '' + $('.prod__details .prod__title').text()
    console.log(string)
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
