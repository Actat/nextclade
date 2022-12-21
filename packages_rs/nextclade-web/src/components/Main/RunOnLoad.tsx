import React from 'react'
import { AlgorithmInputUrl } from 'src/io/AlgorithmInput'
import { useQuerySeqInputs } from 'src/state/inputs.state'
import { useRunAnalysis } from 'src/hooks/useRunAnalysis'

export function RunOnLoad() {
  const { qryInputs, addQryInputs } = useQuerySeqInputs()
  const run = useRunAnalysis()

  const url = new URL(window.location.href)
  const params = url.searchParams
  const fastaParam = params.get('fasta')
  if (typeof fastaParam !== 'string') {
    return <div />
  }
  const fastaUrl: string = fastaParam
  console.log(fastaUrl) // eslint-disable-line no-console
  const ai = new AlgorithmInputUrl(fastaUrl)
  console.log(ai) // eslint-disable-line no-console

  console.log(qryInputs) // eslint-disable-line no-console
  if (!qryInputs.some((element) => element.type === 'Url' && element.name === fastaUrl)) {
    addQryInputs([ai])
    run()
  }

  return <div />
}
