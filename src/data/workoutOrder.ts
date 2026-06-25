type PositionedRecord = {
  id: number;
  position: number;
};

export function renumberPositions<T extends PositionedRecord>(records: T[]): Array<T & { position: number }> {
  return [...records]
    .sort((left, right) => left.position - right.position || left.id - right.id)
    .map((record, index) => ({ ...record, position: index + 1 }));
}
