var storeInformation = {
  nordstrom: {id: "nordstrom", name: "Nordstrom", url: "https://shop.nordstrom.com"},
  vans: {id: "vans", name: "Vans", url: "https://vans.com"},
  pacsun: {id: "pacsun", name: "Pacsun", url: "https://pacsun.com"},
  hollister: {id: "hollister", name: "Hollister", url: "https://hollister.com"},
  nike: {id: "nike", name: "Nike", url: "https://www.nike.com"},
  americaneagle: {id: "americaneagle", name: "American Eagle", url: "https://www.ae.com"},
  adidas: {id: "adidas", name: "Adidas", url: "https://www.adidas.com"},
  urbanoutfitters: {id: "urbanoutfitters", name: "Urban Outfitters", url: "https://www.urbanoutfitters.com"},
  victoriassecret: {id: "victoriassecret", name: "Victoria's Secret", url: "https://www.victoriassecret.com"},
  brandymelville: {id: "brandymelville", name: "Brandy Melville", url: "https://www.brandymelvilleusa.com"},
  abercrombiefitch: {id: "abercrombiefitch", name: "Abercrombie & Fitch", url: "https://www.abercrombie.com"},
  hottopic: {id: "hottopic", name: "Hot Topic", url: "https://www.hottopic.com"},
  oldnavy: {id: "oldnavy", name: "Old Navy", url: "https://oldnavy.gap.com"},
  zumiez: {id: "zumiez", name: "Zumiez", url: "https://www.zumiez.com"},
  gap: {id: "gap", name: "Gap", url: "https://www.gap.com"},
  bananarepublic: {id: "bananarepublic", name: "Banana Republic", url: "https://bananarepublic.gap.com"},
  jcrew: {id: "jcrew", name: "J.Crew", url: "https://www.jcrew.com"},
  hm: {id: "hm", name: "H&M", url: "https://www2.hm.com"},
  bloomingdales: {id: "bloomingdales", name: "Bloomingdale's", url: "https://www.bloomingdales.com"},
  billabong: {id: "billabong", name: "Billabong", url: "https://www.billabong.com"},
  nordstromrack: {id: "nordstromrack", name: "Nordstrom Rack", url: "https://www.nordstromrack.com"},
  northface: {id: "northface", name: "North Face", url: "https://www.thenorthface.com"},
  levis: {id: "levis", name: "Levi's", url: "https://www.levi.com"},
  champion: {id: "champion", name: "Champion", url: "https://www.champion.com"},
  pink: {id: "pink", name: "PINK", url: "https://www.victoriassecret.com/pink"},
  guess: {id: "guess", name: "Guess", url: "https://shop.guess.com"},
  asos: {id: "asos", name: "ASOS", url: "https://www.asos.com"},
  target: {id: "target", name: "Target", url: "https://www.target.com"},
  hugoboss: {id: "hugoboss", name: "Hugo Boss", url: "https://www.hugoboss.com"},
}

async function productInfoAbercrombieFitch() {
  let string = ''
  let gender = ''
  console.log($('.breadcrumb-container .breadcrumbs-link').text())
  if($('.breadcrumb-container .breadcrumbs-link').text().toLowerCase().includes("womens")) {
    gender = "Womens"
  } else if ($('.breadcrumb-container .breadcrumbs-link').text().toLowerCase().includes("mens")) {
    gender = "Mens"
  }
  string += ' ' + gender
  string += $('.product-swatches .selected .product-attrs__shown-in span').text().replace('Shown in', '')
  string += $('.product-page__swatches-attributes .product-attrs__shown-in.selected-swatch__label').text().replace('Shown in', '')
  string += ' ' + $('.product-title-main-header').text()
  string += $('.short-description').text()
  string = string.toLowerCase()
  console.log(string)
  const response = await fetch(chrome.runtime.getURL('/src/keywords.json'))
  const keywords = await response.json()
  const data = {
    searchStores: [
      storeInformation.hollister.id,
      storeInformation.urbanoutfitters.id,
      storeInformation.abercrombiefitch.id
    ],
    url: window.location.href,
    search: getSearchKeywords(string, keywords, ),
    string: string
  }
  console.log(data)
  getProducts(data);
}
