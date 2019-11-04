const getNordstromProducts = async (keywords) => {
  const products = []
  await $.get(`https://shop.nordstrom.com/sr?origin=keywordsearch&keyword=${keywords.join('+')}`, function(data) {
    let elements = $(data).find('._1AOd3')
    elements.each(function() {
      const tempObj = {
        name: $(this).find('._5lXiG ').text(),
        price: $(this).find('.YbtDD ._3wu-9').text().split('$')[1],
        img: $(this).find('.TDd9E').attr('src'),
        link: `https://shop.nordstrom.com${$(this).find('._1av3_').attr('href')}`.split('?origin')[0],
        storeName: 'Nordstrom'
      }
      tempObj.price = tempObj.price.replace(/\u2013/g, '')
      products.push(tempObj)
    })
  })
  return products
}

const getHugoBossProducts = async (keywords) => {
  const products = []
  await $.get(`https://www.hugoboss.com/us/search?q=${keywords.join('%20')}`, function(data) {
    let elements = $(data).find('.search-result-content .search-result-items__grid-tile')
    elements.each(function() {
      console.log($(this).find('.product-tile__image').attr('data-src').replace(/({width})/g, '240').replace(/({quality})/g, '45'))
      const tempObj = {
        name: $(this).find('.product-tile__productInfoWrapper').text().replace(/(BOSS|HUGO|by|\r\n|\n|\r)/gm,""),
        price: $(this).find('.product-tile__offer .price-sales').text().replace('$', ''),
        img: $(this).find('.product-tile__image').attr('data-src').replace(/({width})/g, '240').replace(/({quality})/g, '45'),
        link: `https://www.hugoboss.com/${$(this).find('.product-tile__link').attr('data-url')}`,
        storeName: 'Hugo Boss'
      }
      products.push(tempObj)
    })
  })
  return products
}
