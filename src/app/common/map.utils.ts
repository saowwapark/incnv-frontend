import { IdAndName } from '../types/common';

export const mapIdToName = (id: number, list: IdAndName[]): string => {
  let name: string;
  list.forEach(element => {
    if (element.id === id) {
      name = element.name;
    }
  });
  return name;
};

export const mapNameToId = (value: string, list: IdAndName[]): number => {
  let id: number;
  list.forEach(element => {
    if (element.name.toLowerCase() === value.toLowerCase()) {
      id = element.id;
    }
  });
  return id;
};

/******** change data ********/
export const turnListToLowerCase = (list: string[]): string[] => {
  const newList: string[] = [];
  list.forEach(element => {
    newList.push(element.toLowerCase());
  });
  return newList;
};

/********** filter *********/
export const filterIncluded = (
  value: string,
  list: IdAndName[]
): IdAndName[] => {
  value = value.toLowerCase();
  return list.filter(option => option.name.toLowerCase().includes(value));
};
