const isMergeCell = <ROW>(
  signMerge: (row: ROW) => string,
  rows: ROW[],
  indexA: number,
  indexB: number,
) => {
  if (!rows[indexA] || !rows[indexB]) {
    return false;
  }

  return signMerge(rows[indexA]) === signMerge(rows[indexB]);
};

export const getMergeRowsIndexs = <T>(
  index: number,
  rows: T[],
  signMerge: (row: T) => string,
) => {
  let upIndex = index;

  const indexs = [index];

  while (isMergeCell(signMerge, rows, upIndex, upIndex - 1)) {
    indexs.unshift(upIndex - 1);

    upIndex--;
  }

  let downIndex = index;

  while (isMergeCell(signMerge, rows, downIndex, downIndex + 1)) {
    indexs.push(downIndex + 1);

    downIndex++;
  }

  return indexs;
};
