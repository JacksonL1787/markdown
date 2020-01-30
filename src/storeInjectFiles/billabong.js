if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    //Define product description for search
    let gender = "";
    console.log($('.r-breadcrumbs-wrapper a').text())
    if($('.r-breadcrumbs-wrapper a').text().toLowerCase().includes('women')) {
      gender = "Women"
    } else if ($('.r-breadcrumbs-wrapper a').text().toLowerCase().includes('men')) {
      gender = "Men"
    }
    let string = ''
    string += '' + gender
    string += '' + $('.color p').text().replace('Color: ', '')
    string += '' + $('.productname-container #productname').text()
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.vans,
      storeInformation.pacsun,
      storeInformation.zumiez
    ], await getKeywords())
  })
}
