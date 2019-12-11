if(!window.mainStoreInject) {
  window.mainStoreInject = true;
  function getSearchKeywords (string, keywords) {
    const search = [];
    console.log(keywords)
    keywords.gender.some((i) => {
      if(string.includes(i)) {
        search.push(i)
        return true;
      }
    })
    keywords.shade.some((i) => {
      if(string.includes(i)) {
        search.push(i)
        return true;
      }
    })
    keywords.color.some((i) => {
      if(string.includes(i)) {
        search.push(i)
        return true;
      }
    })
    keywords.material.some((i) => {
      if(string.includes(i)) {
        search.push(i)
        return true;
      }
    })
    keywords.pattern.some((i) => {
      if(string.includes(i)) {
        search.push(i)
        return true;
      }
    })
    keywords.sport.some((i) => {
      if(string.includes(i)) {
        search.push(i)
        return true;
      }
    })
    keywords.type.some((i) => {
      if(string.includes(i)) {
        let add = true;
        keywords.type.forEach((ew) => {
          if(ew.includes(i) && ew != i) {
            add = false;
          }
        })
        if(add) {
          search.push(i)
          return true;
        }
      }
    })
    return {search: search, string: string, keywords: keywords}
  }
}
