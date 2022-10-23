export function aaa() {
  // https://slimboxtv.ru

  const article = document.querySelectorAll('.article-container article')
  const list = Array.from(article).reduce((arr, dom) => {
    const tv = dom.querySelectorAll('li').length
    if (tv) {
      const box = dom.querySelector('.entry-title a').innerHTML
      const img = dom.querySelector('.featured-image img').src
      const homepage = dom.querySelector('.more-link').href
      arr.push({ box, img, homepage })
    }
    return arr
  }, [])
  list
}
