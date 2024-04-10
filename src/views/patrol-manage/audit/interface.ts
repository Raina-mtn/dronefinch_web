export interface DetectTypeList {
  code: string;
  name: string;
  num: number;
}

export interface RecordInfo{
  id: number;
  taskCode: string;
  taskName: string;
  taskType: string;
  taskTypeName: string;
  wayId: number;
  wayName: string;
  airportId: number;
  airportName: string;
  startTime: string;
  endTime: string;
  detectProgress: number;
  taskStatus: string;
  taskStatusName: string;
  responsibleBy: string;
  detectTypeList: DetectTypeList[];
}

export interface StatusItem {
  code: string;
  name: string;
  num: number;
}

export interface Search {
  detectStatusList: StatusItem[];
  detectResultList: StatusItem[];
  reviewStatusList: StatusItem[];
  detectType: string;
}

export interface Image {
  id: number;
  mediaId: number;
  imageUrl: string;
  partsId: number;
  partsName: string;
  towerName: string;
  wayId: number;
  wayName: string;
  detectType: string;
  detectTypeName: string;
  detectStatus: string;
  detectStatusName: string;
  detectResult: string;
  detectResultName: string;
  reviewStatus: string;
  reviewStatusName: string;
}