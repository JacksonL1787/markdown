$(() => {
  $(document).on('click', '.markdown-close-btn', function() {
    const elem = $(this).parent()
    elem.addClass('slide-out')
    setTimeout(() => {
      elem.remove()
    }, 400)
  })

  const isStorePage = async () => {
    const response = await fetch(chrome.runtime.getURL('/src/stores.json'))
    const stores = await response.json()
    let storePage = stores.filter((s) => {
      if(window.location.host.toLowerCase().includes(s.url.toLowerCase())) {
        return s;
      }
    })
    return await storePage.length > 0 ? true : false
  }

  const isProductPage = async () => {
    const response = await fetch(chrome.runtime.getURL('/src/stores.json'))
    const stores = await response.json()
    let storePage = stores.filter((s) => {
      if(window.location.host.toLowerCase().includes(s.url.toLowerCase())) {
        return s;
      }
    })
    if(storePage.length <= 0) {
      return false
    }

    return $(storePage[0].productPageIdentifier).length > 0
  }

  const getPageStatus = async () => {
    if(! await isStorePage()) {
      return ({status: "not store page"});
    } else if(! await isProductPage()) {
      return ({status: "not product page"});
    } else {
      return ({status: "processing"});
    }
  }

  const loadingProductsMessage = () => {
    $('body').append(`
      <div class="markdown-loading-items-notification">
        <div class="loader"><div class="loader-runner"></div></div>
        <div class="markdown-logo"></div>
        <p class="markdown-notification-msg">Finding Similar Items</p>
        <div class="markdown-close-btn"></div>
      </div>
    `)
  }

  const setProcessingStatus = async () => {
    if (await isStorePage() && await isProductPage()) {
      getPageData()
      loadingProductsMessage()
    }
  }

  setProcessingStatus()

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.from === "popup" && request.subject === "getPageStatus") {
      getPageStatus().then(sendResponse);
      return true;
    }
  })
})
