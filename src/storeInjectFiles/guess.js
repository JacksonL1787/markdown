if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    //Define product description for search
    let gender = ""
    if($('#breadcrumbs .menuItems .menuItemTitleContainer .menuItemTitleLink').text().toLowerCase().includes('women')) {
      gender = 'women'
    } else if ($('#breadcrumbs .menuItems .menuItemTitleContainer .menuItemTitleLink').text().toLowerCase().includes('men')) {
      gender = 'men'
    }
    let string = ''
    string += gender
    string += ' ' + $('.productCont .rightdetails .header-big').text()
    string += ' ' + $('.productInformation .selectedColor').text()
    string = string.toLowerCase()
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.pacsun,
      storeInformation.zumiez
    ], await getKeywords())
  })
}
