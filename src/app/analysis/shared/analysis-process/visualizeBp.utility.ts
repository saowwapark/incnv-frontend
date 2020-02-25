export const filterDataInRegion = (
  inData: any[], //  inData[0] must have startBp and endBp property
  regionStartBp: number,
  regionEndBp: number
) => {
  const outData: any[] = [];
  for (const inDatum of inData) {
    // choose data in region
    if (
      (inDatum.startBp >= regionStartBp && inDatum.startBp <= regionEndBp) ||
      (inDatum.endBp >= regionStartBp && inDatum.endBp <= regionEndBp)
    ) {
      const { chosenStartBp, chosenEndBp } = chooseBasepair(
        inDatum,
        regionStartBp,
        regionEndBp
      );
      inDatum.startBpOnRegion = chosenStartBp;
      inDatum.endBpOnRegion = chosenEndBp;
      outData.push(inDatum);
    }
  }
  return outData;
};

export const chooseBasepair = (
  inDatum: any,
  regionStartBp: number,
  regionEndBp: number
) => {
  let chosenStartBp: number;
  let chosenEndBp: number;

  const diffStart = inDatum.startBp - regionStartBp;
  const diffEnd = inDatum.endBp - regionEndBp;
  const diffEndStart = inDatum.endBp - regionStartBp;
  const diffStartEnd = inDatum.startBp - regionEndBp;
  // choose cnv in region
  // left region
  if (diffEndStart > 0 && diffStart <= 0) {
    chosenStartBp = regionStartBp;
    chosenEndBp = inDatum.endBp;
  } else if (
    (diffEndStart === 0 && diffStart < 0) ||
    (inDatum.startBp === inDatum.endBp && inDatum.startBp === regionStartBp)
  ) {
    chosenStartBp = regionStartBp;
    chosenEndBp = regionStartBp;
  }
  // right region
  else if (diffEnd >= 0 && diffStartEnd < 0) {
    chosenStartBp = inDatum.startBp;
    chosenEndBp = regionEndBp;
  } else if (
    diffStartEnd === 0 &&
    diffEnd > 0 &&
    inDatum.startBp === inDatum.endBp &&
    inDatum.startBp === regionEndBp
  ) {
    chosenStartBp = regionEndBp;
    chosenEndBp = regionEndBp;
  }
  // within region
  else if (diffStart > 0 && diffEnd < 0) {
    chosenStartBp = inDatum.startBp;
    chosenEndBp = inDatum.endBp;
  }
  // over region
  else if (
    (diffStart === 0 && diffEnd === 0) ||
    (diffStart < 0 && diffEnd > 0)
  ) {
    chosenStartBp = regionStartBp;
    chosenEndBp = regionEndBp;
  }
  return { chosenStartBp: chosenStartBp, chosenEndBp: chosenEndBp };
};
