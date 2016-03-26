'use strict'

if (!HTMLCollection.prototype[Symbol.iterator]) {
  HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
}

for (let canvas of document.getElementsByClassName('minecraft-model')) {
  getUUID(canvas.getAttribute('data-name'), uuid => {
    let image = new Image()
    image.onload = () => {
      canvas.parentNode.replaceChild(image, canvas)
    }
    image.src = `https://crafatar.com/renders/body/${uuid}?overlay&scale=3`
  })
}

function getUUID (name, callback) {
  chrome.storage.local.get(name, result => {
    let uuid = result[name]
    if (uuid == null) {
      let request = new XMLHttpRequest()
      request.open('GET', `https://api.mojang.com/users/profiles/minecraft/${name}`, true)
      request.onreadystatechange = () => {
        if (request.readyState == 4) {
          let id = JSON.parse(request.responseText).id
          let map = {}
          map[name] = id
          chrome.storage.local.set(map)
          callback(id)
        }
      }
      request.send()
    } else {
      callback(uuid)
    }
  })
}