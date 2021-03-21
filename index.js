import React from 'react'
import ReactDom from 'react-dom'
import App from './App'

ReactDom.render(<App />, document.getElementById('app'))

if (module.hot) {
  module.hot.accept(err => {
    if (err) {
      console.log('热替换出错')
    }
  })
}
