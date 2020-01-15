// import { CnvInfo } from '../analysis.model';

// export const filterDataInRegion = (
//   cnvInfos: CnvInfo[],
//   regionStartBp: number,
//   regionEndBp: number
// ) => {
//   const data: CnvInfo[] = [];
//   for (const cnv of cnvInfos) {
//     // choose data in region
//     if (
//       (cnv.startBp >= regionStartBp && cnv.startBp <= regionEndBp) ||
//       (cnv.endBp >= regionStartBp && cnv.endBp <= regionEndBp)
//     ) {
//       const { chosenStartBp, chosenEndBp } = chooseBasepair(
//         cnv,
//         regionStartBp,
//         regionEndBp
//       );
//       cnv.startBpOnRegion = chosenStartBp;
//       cnv.endBpOnRegion = chosenEndBp;
//       data.push(cnv);
//     }
//   }
//   return data;
// };

// export const chooseBasepair = (cnv: CnvInfo, regionStartBp, regionEndBp) => {
//   let chosenStartBp: number;
//   let chosenEndBp: number;

//   const diffStart = cnv.startBp - regionStartBp;
//   const diffEnd = cnv.endBp - regionEndBp;
//   const diffEndStart = cnv.endBp - regionStartBp;
//   const diffStartEnd = cnv.startBp - regionEndBp;
//   // choose cnv in region
//   // left region
//   if (diffEndStart > 0 && diffStart <= 0) {
//     chosenStartBp = regionStartBp;
//     chosenEndBp = cnv.endBp;
//   } else if (
//     (diffEndStart === 0 && diffStart < 0) ||
//     (cnv.startBp === cnv.endBp && cnv.startBp === regionStartBp)
//   ) {
//     chosenStartBp = regionStartBp;
//     chosenEndBp = regionStartBp;
//   }
//   // right region
//   else if (diffEnd >= 0 && diffStartEnd < 0) {
//     chosenStartBp = cnv.startBp;
//     chosenEndBp = regionEndBp;
//   } else if (
//     diffStartEnd === 0 &&
//     diffEnd > 0 &&
//     cnv.startBp === cnv.endBp &&
//     cnv.startBp === regionEndBp
//   ) {
//     chosenStartBp = regionEndBp;
//     chosenEndBp = regionEndBp;
//   }
//   // within region
//   else if (diffStart > 0 && diffEnd < 0) {
//     chosenStartBp = cnv.startBp;
//     chosenEndBp = cnv.endBp;
//   }
//   // over region
//   else if (
//     (diffStart === 0 && diffEnd === 0) ||
//     (diffStart < 0 && diffEnd > 0)
//   ) {
//     chosenStartBp = regionStartBp;
//     chosenEndBp = regionEndBp;
//   }
//   return { chosenStartBp: chosenStartBp, chosenEndBp: chosenEndBp };
// };
