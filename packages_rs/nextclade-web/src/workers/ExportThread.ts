import { CladeNodeAttrDesc } from 'auspice'
import type { AnalysisError, AnalysisResult, ErrorsFromWeb, PhenotypeAttrDesc } from 'src/types'
import type { NextcladeWasmWorker } from 'src/workers/nextcladeWasm.worker'
import { spawn } from 'src/workers/spawn'

export class ExportWorker {
  private thread!: NextcladeWasmWorker
  private static self: ExportWorker | undefined

  private constructor() {}

  public static async get() {
    if (!this.self) {
      this.self = new ExportWorker()
      await this.self.init()
    }
    return this.self
  }

  private async init() {
    this.thread = await spawn<NextcladeWasmWorker>(
      new Worker(new URL('src/workers/nextcladeWasm.worker.ts', import.meta.url)),
    )
  }

  public async serializeResultsJson(
    outputs: AnalysisResult[],
    errors: AnalysisError[],
    cladeNodeAttrsJson: CladeNodeAttrDesc[],
    phenotypeAttrsJson: PhenotypeAttrDesc[],
    nextcladeWebVersion: string,
  ): Promise<string> {
    return this.thread.serializeResultsJson(
      outputs,
      errors,
      cladeNodeAttrsJson,
      phenotypeAttrsJson,
      nextcladeWebVersion,
    )
  }

  public async serializeResultsCsv(
    results: AnalysisResult[],
    errors: AnalysisError[],
    cladeNodeAttrs: CladeNodeAttrDesc[],
    phenotypeAttrs: PhenotypeAttrDesc[],
    delimiter: string,
  ) {
    return this.thread.serializeResultsCsv(results, errors, cladeNodeAttrs, phenotypeAttrs, delimiter)
  }

  public async serializeResultsNdjson(results: AnalysisResult[], errors: AnalysisError[]) {
    return this.thread.serializeResultsNdjson(results, errors)
  }

  public async serializeInsertionsCsv(results: AnalysisResult[], errors: AnalysisError[]) {
    return this.thread.serializeInsertionsCsv(results, errors)
  }

  public async serializeErrorsCsv(errors: ErrorsFromWeb[]) {
    return this.thread.serializeErrorsCsv(errors)
  }

  private async destroy() {
    await this.thread.destroy()
  }

  public static async destroy() {
    await this.self?.destroy()
    this.self = undefined
  }
}
