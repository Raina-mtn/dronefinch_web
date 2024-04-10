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


export interface CurrenCheck {
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
  reviewCommentList: ReviewCommentList[];
  infoList: InfoList[];
}

export interface InfoList {
  id?: number;
  num?: number;
  defectLevel?: string;
  defectLevelName?: string;
  defectType?: string;
  defectTypeName?: string;
  shapeType?: string;
  defectShape?: string;
}

export interface ReviewCommentList {
  num?: number;
  commentPoint?: string;
  commentInfo?: string;
}
