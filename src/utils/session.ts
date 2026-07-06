import fs from "node:fs";

export type SessionData = {
  readonly day: string;
  readonly month: string;
  readonly year: string;
  readonly time: string;
  readonly uuid: string;
  readonly path: string;
  readonly filePath: string;
  readonly summary: string;
  readonly jsonContent: { type: string, payload: { type: string, message: string, cwd: string, } }[];
  readonly content: string;
};

export class Session implements SessionData {
  static list: { [key: string]: Session } = {};
  readonly day: string;
  readonly month: string;
  readonly year: string;
  readonly time: string;
  readonly uuid: string;
  readonly path: string;
  readonly filePath: string;
  readonly summary: string;
  readonly jsonContent: { type: string, payload: { type: string, message: string, cwd: string, } }[];
  readonly content: string;

  constructor(sessionData: SessionData) {
    this.day = sessionData.day;
    this.month = sessionData.month;
    this.year = sessionData.year;
    this.time = sessionData.time;
    this.uuid = sessionData.uuid;
    this.filePath = sessionData.filePath;
    this.content = sessionData.content;
    this.jsonContent = sessionData.jsonContent;
    this.summary = sessionData.summary;
    this.path = sessionData.path;
  }
}
