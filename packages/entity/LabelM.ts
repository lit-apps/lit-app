export interface LabelUI {
  /**
   * The title of the label
 */
	title: string
	description?: StringConstructor
  /**
   * starred labels have priority
   */
  starred?: boolean
  /**
   * background color of the label
   */
	color?: string
}

export interface LabelI extends LabelUI {
}


