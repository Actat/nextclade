import React from 'react'

export function RunOnLoad() {
  const url = new URL(window.location.href)
  const params = url.searchParams
  const fastaUrl = params.get('fasta')
  console.log(fastaUrl) // eslint-disable-line no-console
  return <div />
}
