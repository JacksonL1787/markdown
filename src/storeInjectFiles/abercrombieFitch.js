if(!window.initDone) {
  window.initDone = true

  $(async () => {
    getProducts([
      storeInformation.hollister,
      storeInformation.urbanoutfitters
    ], await getKeywords())
  })
}
