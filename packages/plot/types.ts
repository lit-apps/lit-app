export type SeriesT = {
  label: string
  key: string
}
/**
 * Options for the plot
 */
export type OptionT = {
  height?: number
  title?: string
  subtitle?: string
  caption?: string
  items: SeriesT[]
}
