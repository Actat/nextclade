import React from 'react'

export function RunOnLoad() {
  const url = new URL(window.location.href)
  const params = url.searchParams
  const fastaParam = params.get('fasta')
  if (typeof fastaParam !== 'string') {
    return <div />
  }
  const fastaUrl: string = fastaParam
  console.log(fastaUrl) // eslint-disable-line no-console

  return <div />
}
