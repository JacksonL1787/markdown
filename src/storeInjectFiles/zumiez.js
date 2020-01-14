if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    let gender = $('script').text()
    if(gender.includes(`"gender_styles":"Men's"`)) {
      gender = "Mens"
    } else if (gender.includes(`"gender_styles":"Women's"`)) {
      gender = "Womens"
    } else {
      gender = ""
    }
    let string = ''
    string += $('.bump-top-3.row .column.bump-bottom-2 h1.reset-margin').text()
    string += ' ' + gender
    string += ' ' + $('.attribute_code_color').siblings('.selected-option').text()
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.vans,
      storeInformation.champion,
      storeInformation.guess,
      storeInformation.asos,
      storeInformation.hottopic,
      storeInformation.urbanoutfitters,
      storeInformation.pacsun
    ], await getKeywords())
  })
}
