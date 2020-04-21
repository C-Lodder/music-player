// Modal web component
const { ipcRenderer } = require('electron')
const Store = require('electron-store')
const { readFile, writeFile } = require('fs').promises
const { join } = require('path')
const plist = require('plist')

class SettingsModal extends HTMLElement {
  get visible() {
    return this.hasAttribute('visible')
  }

  set visible(value) {
    if (value) {
      this.setAttribute('visible', '')
    } else {
      this.removeAttribute('visible')
    }
  }

  constructor() {
    super()

    this.store = new Store()
    this.library = this.store.get('library')
    this.render()
  }

  connectedCallback() {
    this.attachEventHandlers()
  }

  static get observedAttributes() {
    return ['visible']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'visible') {
      if (newValue === null) {
        this.querySelector('.modal').classList.remove('visible')
      } else {
        this.querySelector('.modal').classList.add('visible')
      }
    }
  }

  render() {
    const modalClass = this.visible ? 'modal visible' : 'modal'
    const container = document.createElement('div')

    container.innerHTML = `
      <style>
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 3;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, .7);
          opacity: 0;
          visibility: hidden;
          transform: scale(1.1);
          transition: visibility 0s linear .25s, opacity .25s 0s, transform .25s;
        }
        .visible {
          opacity: 1;
          visibility: visible;
          transform: scale(1);
          transition: visibility 0s linear 0s, opacity .25s 0s, transform .25s;
        }
        .modal-dialog {
          position: absolute;
          top: 50%;
          left: 50%;
          display: flex;
          width: 80vw;
          height: 80vh;
          padding: 1rem;
          flex-direction: column;
          background-color: var(--colour-dark-3);
          transform: translate(-50%, -50%);
          border-radius: .2rem;
        }
        .modal-content {
          padding-right: 1rem;
          margin-bottom: 1rem;
          overflow-y: auto;
        }
        .modal-title {
          margin-bottom: 1rem;
          font-size: 1.8rem;
        }
        .modal-footer {
          display: flex;
          margin-top: auto;
          justify-content: flex-end;
        }
      </style>
      <div class='${modalClass}'>
        <div class='modal-dialog'>
          <div class='modal-title'>Settings</div>
          <div class='modal-content'>
            <div class="form-group">
              <label for="library">Library</label>
              <div class="form-help">Select your iTunes library XML file, which will be converted to JSON.</div>
              <input type="file" id="library" style="display:none">
              <button id="choose">Choose</button>
              <span id="file-name">${this.library ?? 'No file selected'}</span>
            </div>
          </div>
          <div class='modal-footer'>
            <button name="button" class="btn close">Close</button>
          </div>
        </div>
      </div>`

    this.appendChild(container)
  }

  replaceKeys(data) {
    Object.keys(data).forEach((key) => {
      var newKey = key.toLowerCase().replace(/\s+/g, '_')
      if (data[key] && typeof data[key] === 'object') {
        this.replaceKeys(data[key])
      }
      if (key !== newKey) {
        data[newKey] = data[key]
        delete data[key]
      }
    })
  }

  attachEventHandlers() {
    this.querySelector('.close').addEventListener('click', () => {
      this.close()
    })

    this.querySelector('#choose').addEventListener('click', () => {
      this.querySelector('#library').click()
    })

    this.querySelector('#library').addEventListener('change', () => {
      const loader = document.createElement('div')
      loader.classList.add('loader', 'loader-sm', 'bg-gray')
      this.querySelector('[for="library"]').append(loader)

      const libraryPath = this.querySelector('#library').files[0].path
      const replacedPath = libraryPath.replace(/.xml/g, '.json')
      this.querySelector('#file-name').innerText = replacedPath
      this.store.set('library', replacedPath)

      readFile(libraryPath, 'utf8')
        .then((file) => {
          let json = plist.parse(file)
          this.replaceKeys(json)

          return json
        })
        .then((json) => {
          writeFile(replacedPath, JSON.stringify(json))
            .then(() => {
              ipcRenderer.send('fetch-playlists')
              loader.remove()
            })
        })
    })

    this.querySelector('.modal').addEventListener('click', ({ target }) => {
      if (target !== this && !this.querySelector('.modal-dialog').contains(target)) {
        this.close()
      }
    })
  }

  close() {
    this.visible = false
  }
}

module.exports = window.customElements.define('settings-modal', SettingsModal)