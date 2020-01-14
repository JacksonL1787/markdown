if(!window.initDone) {
  window.initDone = true

  const getKeywords = async () => {
    console.log($('#root').siblings('script').text())
    let gender = $('#root').siblings('script').text()
    if(gender.includes(`"gender":"Male"`)) {
      gender = "Mens"
    } else if (gender.includes(`"gender":"Female"`)) {
      gender = "Womens"
    } else {
      gender = ""
    }
    let string = ''
    string += $('.UlMCr').text()
    string += ' ' + gender
    string += ' ' + $('._1zgoP').text()
    string += ' ' + $('._26GPU div').text()
    string = string.toLowerCase()
    console.log(string)
    const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
    const keywords = await response.json()
    console.log(getSearchKeywords(string, keywords))
    return getSearchKeywords(string, keywords)
  }

  $(async () => {
    getProducts([
      storeInformation.nordstromrack,
      storeInformation.hugoboss,
      storeInformation.hm,
      storeInformation.gap,
      storeInformation.oldnavy,
      storeInformation.abercrombiefitch,
      ,storeInformation.target
    ], await getKeywords())
  })
}
