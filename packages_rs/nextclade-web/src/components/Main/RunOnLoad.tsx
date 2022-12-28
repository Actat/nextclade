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
  const pathogenId = params.get('dataset')
  const fastaParam = params.get('fasta')
  if (typeof pathogenId !== 'string' || typeof fastaParam !== 'string') {
    return <div />
  }

  if (typeof datasets === 'undefined') {
    return <div />
  }

  const pathogen: Dataset | undefined = datasets.find((data) => {
    return data.attributes.name.value === pathogenId
  })
  if (pathogen !== datasetCurrent) {
    setDatasetHighlighted(pathogen)
    setDatasetCurrent(datasetHighlighted)
  }

  const fastaUrl: string = fastaParam
  const ai = new AlgorithmInputUrl(fastaUrl)
  if (!qryInputs.some((element) => element.type === 'Url' && element.name === fastaUrl)) {
    addQryInputs([ai])
  }

  if (typeof datasetCurrent !== 'undefined') {
    run()
  }
  return <div />
}
