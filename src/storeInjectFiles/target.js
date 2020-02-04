if(!window.initDone) {
  window.initDone = true
  console.log($('div[data-test="breadcrumb"] .Link-sc-1khjl8b-0 span').text().toLowerCase().includes('clothing'))
  if($('div[data-test="breadcrumb"] .Link-sc-1khjl8b-0 span').text().toLowerCase().includes('clothing')) {
    const getKeywords = async () => {
      let gender = ""

      if($('div[data-test="breadcrumb"] .Link-sc-1khjl8b-0 span').text().toLowerCase().includes('women')) {
        gender = "women"
      } else if ($('div[data-test="breadcrumb"] .Link-sc-1khjl8b-0 span').text().toLowerCase().includes('men')) {
        gender = "men"
      }
      console.log($('.krwRoS span'))
      let string = ''
      string += gender
      string += ' ' + $('.kXusPm img').attr('alt')
      string += ' ' + $('.Heading__StyledHeading-sc-6yiixr-0 span').text()
      string = string.toLowerCase()
      console.log(string)
      const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
      const keywords = await response.json()
      return getSearchKeywords(string, keywords)
    }

    $(async () => {
      getProducts([
        storeInformation.gap,
        storeInformation.hm
      ], await getKeywords())
    })
  } else {
    notClothingPage()
  }
}
