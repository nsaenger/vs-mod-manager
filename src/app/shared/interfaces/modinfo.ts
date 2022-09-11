export interface Modinfo {
  type: string;
  name: string;
  modid: string;
  version: string;
  description: string;
}

export interface ModRelease {
  created: Date;
  downloads: number;
  fileid: number;
  filename: string;
  mainfile: string;
  modidstr: string;
  modversion: string;
  releaseid: string
  tags: string[];
}

export interface DetailedModInfo {
  assetid: number;
  author: string;
  comments: number;
  created: Date;
  downloads: number;
  follows: number;
  homepageurl: string;
  issuetrackerurl: string;
  lastmodified: Date;
  logofilename: string;
  modid: number;
  name: string;
  releases: ModRelease[];
  side: string;
  sourcecodeurl: string;
  tags: string[];
  text: string;
  trailervideourl: string;
  wikiurl: string;
}
