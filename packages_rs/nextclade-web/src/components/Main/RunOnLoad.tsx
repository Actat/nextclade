import React, { useState } from 'react'
import type { Dataset } from 'src/types'
import { datasetCurrentAtom, datasetsAtom } from 'src/state/dataset.state'
import { useRecoilState, useRecoilValue } from 'recoil'

import { AlgorithmInputUrl } from 'src/io/AlgorithmInput'
import { useQuerySeqInputs } from 'src/state/inputs.state'
import { useRunAnalysis } from 'src/hooks/useRunAnalysis'

export function RunOnLoad() {
  const { datasets } = useRecoilValue(datasetsAtom)
  const [datasetCurrent, setDatasetCurrent] = useRecoilState(datasetCurrentAtom)
  const [datasetHighlighted, setDatasetHighlighted] = useState<Dataset | undefined>(datasetCurrent)

  const { qryInputs, addQryInputs } = useQuerySeqInputs()
  const run = useRunAnalysis()

  const url = new URL(window.location.href)
  const params = url.searchParams
  const pathogenId = params.get('pathogen')
  const fastaParam = params.get('fasta')
  if (typeof pathogenId !== 'string' || typeof fastaParam !== 'string') {
    return <div />
  }

  if (typeof datasets === 'undefined') {
    return <div />
  }

  let pathogen: Dataset | undefined
  for (const data of datasets) {
    for (const [key, value] of Object.entries(data)) {
      if (key === 'id' && value === pathogenId) {
        pathogen = data
        break
      }
    }
    if (typeof pathogen !== 'undefined') {
      break
    }
  }
  if (pathogen !== datasetCurrent) {
    setDatasetHighlighted(pathogen)
    setDatasetCurrent(datasetHighlighted)
  }

  const fastaUrl: string = fastaParam
  console.log(fastaUrl) // eslint-disable-line no-console
  const ai = new AlgorithmInputUrl(fastaUrl)
  console.log(ai) // eslint-disable-line no-console

  console.log(qryInputs) // eslint-disable-line no-console
  if (!qryInputs.some((element) => element.type === 'Url' && element.name === fastaUrl)) {
    addQryInputs([ai])
  }

  console.log('datasetCurrent') // eslint-disable-line no-console
  console.log(datasetCurrent) // eslint-disable-line no-console
  console.log('datasetCurrent') // eslint-disable-line no-console
  if (typeof datasetCurrent !== 'undefined') {
    run()
  }
  return <div />
}
