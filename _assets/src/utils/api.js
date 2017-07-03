import store from '../store/store'

function removePrefix (url) {
  if (url.startsWith('/files')) {
    return url.slice(6)
  }

  return url
}

function fetch (url) {
  url = removePrefix(url)

  return new Promise((resolve, reject) => {
    let request = new window.XMLHttpRequest()
    request.open('GET', `${store.state.baseURL}/api/resource${url}`, true)
    request.setRequestHeader('Authorization', `Bearer ${store.state.jwt}`)

    request.onload = () => {
      switch (request.status) {
        case 200:
          let req = JSON.parse(request.responseText)
          store.commit('updateRequest', req)
          document.title = req.name
          resolve(req.url)
          break
        default:
          reject(request.status)
          break
      }
    }
    request.onerror = (error) => reject(error)
    request.send()
  })
}

function rm (url) {
  return new Promise((resolve, reject) => {
    let request = new window.XMLHttpRequest()
    request.open('DELETE', `${store.state.baseURL}/api/resource${url}`, true)
    request.setRequestHeader('Authorization', `Bearer ${store.state.jwt}`)

    request.onload = () => {
      if (request.status === 200) {
        resolve(request.responseText)
      } else {
        reject(request.responseText)
      }
    }

    request.onerror = (error) => reject(error)
    request.send()
  })
}

function put (url) {
  url = removePrefix(url)

  return new Promise((resolve, reject) => {
    let request = new window.XMLHttpRequest()
    request.open('PUT', `${store.state.baseURL}/api/resource${url}`, true)
    request.setRequestHeader('Authorization', `Bearer ${store.state.jwt}`)

    request.onload = () => {
      if (request.status === 200) {
        resolve(request.responseText)
      } else {
        reject(request.responseText)
      }
    }

    request.onerror = (error) => reject(error)
    request.send()
  })
}

function move (oldLink, newLink) {
  oldLink = removePrefix(oldLink)
  newLink = removePrefix(newLink)

  return new Promise((resolve, reject) => {
    let request = new window.XMLHttpRequest()
    request.open('POST', `${store.state.baseURL}/api/resource${oldLink}`, true)
    request.setRequestHeader('Authorization', `Bearer ${store.state.jwt}`)
    request.setRequestHeader('Destination', newLink)

    request.onload = () => {
      if (request.status === 200) {
        resolve(request.responseText)
      } else {
        reject(request.responseText)
      }
    }

    request.onerror = (error) => reject(error)
    request.send()
  })
}

function checksum (url, algo) {
  url = removePrefix(url)

  return new Promise((resolve, reject) => {
    let request = new window.XMLHttpRequest()
    request.open('GET', `${store.state.baseURL}/api/checksum${url}?algo=${algo}`, true)
    request.setRequestHeader('Authorization', `Bearer ${store.state.jwt}`)

    request.onload = () => {
      if (request.status === 200) {
        resolve(request.responseText)
      } else {
        reject(request.responseText)
      }
    }
    request.onerror = (error) => reject(error)
    request.send()
  })
}

export default {
  delete: rm,
  fetch,
  checksum,
  move,
  put
}
