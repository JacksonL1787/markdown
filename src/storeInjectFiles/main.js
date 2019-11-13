if(!window.mainStoreInject) {
  window.mainStoreInject = true;
  console.log('RUNNNNNNNN')
  function getSearchKeywords (string, keywords) {
    const search = [];
    console.log(keywords)
    keywords.gender.forEach((i) => {
      if(string.includes(i)) {
        search.push(i)
        return;
      }
    })
    keywords.shade.forEach((i) => {
      if(string.includes(i)) {
        search.push(i)
        return;
      }
    })
    keywords.color.forEach((i) => {
      if(string.includes(i)) {
        search.push(i)
        return;
      }
    })
    keywords.material.forEach((i) => {
      if(string.includes(i)) {
        search.push(i)
        return;
      }
    })
    keywords.pattern.forEach((i) => {
      if(string.includes(i)) {
        search.push(i)
        return;
      }
    })
    keywords.sport.forEach((i) => {
      if(string.includes(i)) {
        search.push(i)
        return;
      }
    })
    keywords.type.forEach((i) => {
      if(string.includes(i)) {
        let add = true;
        search.forEach((ew) => {
          if(ew.includes(i)) {
            add = false;
          }
        })
        if(add) search.push(i)
      }
    })
    return search
  }
}
