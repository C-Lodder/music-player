// SVG Icons

const icons = {
  play: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="25"><path fill="var(--colour-primary)" d="M45.563 29.174l-22-15A1 1 0 0022 15v30a.999.999 0 001.563.826l22-15a1 1 0 000-1.652zM24 43.107V16.893L43.225 30 24 43.107z"/><path fill="var(--colour-primary)" d="M30 0C13.458 0 0 13.458 0 30s13.458 30 30 30 30-13.458 30-30S46.542 0 30 0zm0 58C14.561 58 2 45.439 2 30S14.561 2 30 2s28 12.561 28 28-12.561 28-28 28z"/></svg>',
  pause: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="25"><path fill="var(--colour-primary)" d="M30 0C13.458 0 0 13.458 0 30s13.458 30 30 30 30-13.458 30-30S46.542 0 30 0zm0 58C14.561 58 2 45.439 2 30S14.561 2 30 2s28 12.561 28 28-12.561 28-28 28z"/><path fill="var(--colour-primary)" d="M33 46h8V14h-8v32zm2-30h4v28h-4V16zM19 46h8V14h-8v32zm2-30h4v28h-4V16z"/></svg>',
  playlist: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="20"><path fill="var(--colour-text)" d="M27.055 4.018L20.58 5.404A1.998 1.998 0 0019 7.36v11.354c0 1.949-6 .32-6 5.766 0 1 .603 3.519 3.467 3.519 3.52.001 4.533-2.674 4.533-5.644V10.537l6.08-1.334c.537-.118.92-.593.92-1.144V4.78a.78.78 0 00-.945-.763zM4 6a1 1 0 000 2h12a1 1 0 000-2H4zm0 5a1 1 0 000 2h12a1 1 0 000-2H4zm0 5a1 1 0 000 2h12a1 1 0 000-2H4zm0 5a1 1 0 000 2h7.135a5.887 5.887 0 01.736-2H4z"/></svg>',
  repeat: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="25"><path fill="var(--colour-white)" d="M20 4v3H8c-3.302 0-6 2.698-6 6a1 1 0 102 0c0-2.22 1.78-4 4-4h12v3l7-4-7-4zm6.984 11.986A1 1 0 0026 17c0 2.22-1.78 4-4 4H10v-3l-7 4 7 4v-3h12c3.302 0 6-2.698 6-6a1 1 0 00-1.016-1.014z"/></svg>',
  repeatSingle: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="25"><path fill="var(--colour-white)" d="M15 4v3H8c-3.302 0-6 2.698-6 6a1 1 0 102 0c0-2.22 1.78-4 4-4h7v3l7-4-7-4zm11.027.25L24.06 5.592v1.697l1.869-1.262h.1V12H28V4.25h-1.973zm.957 11.736A1 1 0 0026 17c0 2.22-1.78 4-4 4H10v-3l-7 4 7 4v-3h12c3.302 0 6-2.698 6-6a1 1 0 00-1.016-1.014z"/></svg>',
  shuffle: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 172 172" width="25"><path fill="var(--colour-white)" d="M120.4 28.667v17.2h-13.326a34.424 34.424 0 00-28.621 15.318L68.8 75.665l-9.653-14.48a34.427 34.427 0 00-28.621-15.318H17.2a5.734 5.734 0 100 11.466h13.326a22.925 22.925 0 0119.08 10.213L61.914 86l-12.306 18.454a22.925 22.925 0 01-19.081 10.213H17.2a5.734 5.734 0 100 11.466h13.326a34.427 34.427 0 0028.621-15.318l9.653-14.48 9.653 14.48a34.424 34.424 0 0028.621 15.318H120.4v17.2l34.4-22.933-34.4-22.933v17.2h-13.326a22.915 22.915 0 01-19.08-10.213L75.686 86l12.306-18.454a22.915 22.915 0 0119.081-10.213H120.4v17.2L154.8 51.6z"/></svg>',
  search: '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"><path fill="var(--colour-primary)" d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.947 9.947 0 006.322-2.264l5.971 5.971a1 1 0 101.414-1.414l-5.97-5.97A9.947 9.947 0 0023 13c0-5.511-4.489-10-10-10zm0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8z"/></svg>',
  cross: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="25" height="25"><path fill="var(--colour-primary)" d="M9.156 6.313L6.312 9.155 22.157 25 6.22 40.969 9.03 43.78 25 27.844 40.938 43.78l2.843-2.843L27.844 25 43.687 9.156l-2.843-2.844L25 22.157z"/></svg>',
  settings: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 478.703 478.703" width="30px"><path fill="var(--colour-primary)" d="M454.2 189.101l-33.6-5.7c-3.5-11.3-8-22.2-13.5-32.6l19.8-27.7c8.4-11.8 7.1-27.9-3.2-38.1l-29.8-29.8c-5.6-5.6-13-8.7-20.9-8.7-6.2 0-12.1 1.9-17.1 5.5l-27.8 19.8c-10.8-5.7-22.1-10.4-33.8-13.9l-5.6-33.2a29.54 29.54 0 00-29.2-24.7h-42.1c-14.5 0-26.8 10.4-29.2 24.7l-5.8 34c-11.2 3.5-22.1 8.1-32.5 13.7l-27.5-19.8c-5-3.6-11-5.5-17.2-5.5-7.9 0-15.4 3.1-20.9 8.7l-29.9 29.8c-10.2 10.2-11.6 26.3-3.2 38.1l20 28.1c-5.5 10.5-9.9 21.4-13.3 32.7l-33.2 5.6a29.54 29.54 0 00-24.7 29.2v42.1c0 14.5 10.4 26.8 24.7 29.2l34 5.8c3.5 11.2 8.1 22.1 13.7 32.5l-19.7 27.4c-8.4 11.8-7.1 27.9 3.2 38.1l29.8 29.8c5.6 5.6 13 8.7 20.9 8.7 6.2 0 12.1-1.9 17.1-5.5l28.1-20c10.1 5.3 20.7 9.6 31.6 13l5.6 33.6a29.54 29.54 0 0029.2 24.7h42.2c14.5 0 26.8-10.4 29.2-24.7l5.7-33.6c11.3-3.5 22.2-8 32.6-13.5l27.7 19.8c5 3.6 11 5.5 17.2 5.5 7.9 0 15.3-3.1 20.9-8.7l29.8-29.8c10.2-10.2 11.6-26.3 3.2-38.1l-19.8-27.8c5.5-10.5 10.1-21.4 13.5-32.6l33.6-5.6a29.54 29.54 0 0024.7-29.2v-42.1c.2-14.5-10.2-26.8-24.5-29.2zm-2.3 71.3c0 1.3-.9 2.4-2.2 2.6l-42 7c-5.3.9-9.5 4.8-10.8 9.9-3.8 14.7-9.6 28.8-17.4 41.9-2.7 4.6-2.5 10.3.6 14.7l24.7 34.8c.7 1 .6 2.5-.3 3.4l-29.8 29.8c-.7.7-1.4.8-1.9.8-.6 0-1.1-.2-1.5-.5l-34.7-24.7c-4.3-3.1-10.1-3.3-14.7-.6-13.1 7.8-27.2 13.6-41.9 17.4-5.2 1.3-9.1 5.6-9.9 10.8l-7.1 42c-.2 1.3-1.3 2.2-2.6 2.2h-42.1c-1.3 0-2.4-.9-2.6-2.2l-7-42c-.9-5.3-4.8-9.5-9.9-10.8-14.3-3.7-28.1-9.4-41-16.8-2.1-1.2-4.5-1.8-6.8-1.8-2.7 0-5.5.8-7.8 2.5l-35 24.9c-.5.3-1 .5-1.5.5-.4 0-1.2-.1-1.9-.8l-29.8-29.8c-.9-.9-1-2.3-.3-3.4l24.6-34.5c3.1-4.4 3.3-10.2.6-14.8-7.8-13-13.8-27.1-17.6-41.8-1.4-5.1-5.6-9-10.8-9.9l-42.3-7.2c-1.3-.2-2.2-1.3-2.2-2.6v-42.1c0-1.3.9-2.4 2.2-2.6l41.7-7c5.3-.9 9.6-4.8 10.9-10 3.7-14.7 9.4-28.9 17.1-42 2.7-4.6 2.4-10.3-.7-14.6l-24.9-35c-.7-1-.6-2.5.3-3.4l29.8-29.8c.7-.7 1.4-.8 1.9-.8.6 0 1.1.2 1.5.5l34.5 24.6c4.4 3.1 10.2 3.3 14.8.6 13-7.8 27.1-13.8 41.8-17.6 5.1-1.4 9-5.6 9.9-10.8l7.2-42.3c.2-1.3 1.3-2.2 2.6-2.2h42.1c1.3 0 2.4.9 2.6 2.2l7 41.7c.9 5.3 4.8 9.6 10 10.9 15.1 3.8 29.5 9.7 42.9 17.6 4.6 2.7 10.3 2.5 14.7-.6l34.5-24.8c.5-.3 1-.5 1.5-.5.4 0 1.2.1 1.9.8l29.8 29.8c.9.9 1 2.3.3 3.4l-24.7 34.7c-3.1 4.3-3.3 10.1-.6 14.7 7.8 13.1 13.6 27.2 17.4 41.9 1.3 5.2 5.6 9.1 10.8 9.9l42 7.1c1.3.2 2.2 1.3 2.2 2.6v42.1h-.1z"/><path fill="var(--colour-primary)" d="M239.4 136.001c-57 0-103.3 46.3-103.3 103.3s46.3 103.3 103.3 103.3 103.3-46.3 103.3-103.3-46.3-103.3-103.3-103.3zm0 179.6c-42.1 0-76.3-34.2-76.3-76.3s34.2-76.3 76.3-76.3 76.3 34.2 76.3 76.3-34.2 76.3-76.3 76.3z"/></svg>',
  sort: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="15" height="15"><path fill="var(--colour-text)" d="M15 3a.996.996 0 00-.707.293l-8 8A1 1 0 007 13h16a.999.999 0 00.707-1.707l-8-8A.996.996 0 0015 3zM7 17a.999.999 0 00-.707 1.707l8 8a.997.997 0 001.414 0l8-8A1 1 0 0023 17H7z"/></svg>',
  queue: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="25"><path fill="var(--colour-white)" d="M3 5v4h4V5H3zm9 1a1 1 0 100 2h14a1 1 0 100-2H12zm-9 7v4h4v-4H3zm9 1a1 1 0 100 2h14a1 1 0 100-2H12zm-9 7v4h4v-4H3zm9 1a1 1 0 100 2h14a1 1 0 100-2H12z"/></svg>',
}

export default icons