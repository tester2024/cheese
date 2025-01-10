import React from 'react'
import type { AppProps } from 'next/app'

import '../styles/globals.css'
import '../styles/hexviewver.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
