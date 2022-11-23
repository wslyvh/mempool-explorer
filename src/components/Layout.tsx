import Head from 'next/head'
import React, { ReactNode } from 'react'
import { TITLE, DESCRIPTION } from 'utils/constants'

type Props = {
  children: ReactNode
}

export function Layout(props: Props) {
  return (
    <div>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
      </Head>

      <main>
        {props.children}
      </main>

      <footer>
        <a href='https://github.com/wslyvh/mempool-explorer' target='_blank' rel='noopener noreferrer'>
          Source
        </a>
      </footer>
    </div>
  )
}
