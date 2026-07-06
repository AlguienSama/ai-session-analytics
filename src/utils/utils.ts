import path from "node:path";
import { Session } from "./session";

export const getFormattedDate = () => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;
}

export const isCurrentPathSession = (session: Session): boolean => {
  return path.normalize(path.resolve()).toLowerCase() === path.normalize(session.path).toLowerCase();
}