import moment from "moment";

export function momentDate(date: string, format: string) {
  return moment(moment.utc(moment.utc(date)).toDate()).format(format);
}
