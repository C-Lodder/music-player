// Modal web component
const Store = require('electron-store')
const { readFileSync } = require('fs')
const { join } = require('path')

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
          background-color: var(--colour-tertiary);
          transform: translate(-50%, -50%);
          border-radius: 2px;
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
              <label for="library">Library (requires restart)</label>
              <div class="form-help">Select your iTunes library XML file.</div>
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

  attachEventHandlers() {
    this.querySelector('.close').addEventListener('click', () => {
      this.close()
    })

    this.querySelector('#choose').addEventListener('click', () => {
      this.querySelector('#library').click()
    })

    this.querySelector('#library').addEventListener('change', () => {
      const libraryPath = this.querySelector('#library').files[0].path
      this.querySelector('#file-name').innerText = libraryPath
      this.store.set('library', libraryPath)
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