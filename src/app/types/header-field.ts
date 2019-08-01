/*************************** Front End *****************************/
/**
 *
 */
export class HeaderField {
  id: number;
  ownerId: number;
  cnvToolName: string;
  sampleName: string;
  chr: string;
  startBp: string;
  stopBp: string;
  cnvType: string;
}




/*************************** Back End *****************************/
/**
 * key-value: fieldName-column
 * tell that each field is on what column number
 */
export interface FieldColumn {
  fieldName: string;
  columnId: number;         // start at 0
}

/**
 * ChosenHeader is object type after each user config header fields
 * primary key = ownerId + cnvToolName
 */
export interface ChosenHeader {
  id: number;
  ownerId: number;
  cnvToolName: string;
  sampleName: FieldColumn;
  chr: FieldColumn;
  startBp: FieldColumn;
  stopBp: FieldColumn;
  cnvType: FieldColumn;
}

export interface CNVtoolMapHeader {
  cnvToolName: string;
  headers: FieldColumn[];
}

