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
      products.push(tempObj)
    })
  })
  return products
}
