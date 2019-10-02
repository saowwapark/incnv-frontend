import { IdAndName } from './../types/common';
import { TabFileMapping } from '../cnvtools/tab-file-mapping/tab-file-mapping.model';
export class TabFileMappingsFakeDb {
  public static TAB_MAPPINGS: TabFileMapping[] = [
    {
      id: 1,
      userId: 1, // 0 = admin, 1 = userlevel1
      cnvToolName: 'CODEX2',
      headerField: {
        sampleName: 'sample_name',
        chr: 'chr',
        startBp: 'st_bp',
        endBp: 'ed_bp',
        cnvType: 'cnv'
      },
      dataField: {
        chr22: 'chr22',
        dup: 'dup',
        del: 'del'
      }
    },
    {
      id: 2,
      userId: 1, // 0 = admin, 1 = userlevel1
      cnvToolName: 'CoNIFER',
      headerField: {
        sampleName: 'sampleID',
        chr: 'chromosome',
        startBp: 'start',
        endBp: 'stop',
        cnvType: 'state'
      },
      dataField: {
        chr22: 'chr22',
        dup: 'dup',
        del: 'del'
      }
    },
    {
      id: 3,
      userId: 1, // 0 = admin, 1 = userlevel1
      cnvToolName: 'CONTRA',
      headerField: {
        sampleName: 'Target.Region.ID',
        chr: 'chr',
        startBp: 'OriStrCoordinate',
        endBp: 'OriEndCoordinate',
        cnvType: 'gain.loss'
      },
      dataField: {
        chr22: 'chr22',
        dup: 'gain',
        del: 'loss'
      }
    }
  ];

  public static TAB_MAPPINGS_ID_NAME: IdAndName[] = [
    {
      id: 1,
      name: 'CODEX2'
    },
    {
      id: 2,
      name: 'CoNIFER'
    },
    {
      id: 3,
      name: 'CONTRA'
    }
  ];
}
