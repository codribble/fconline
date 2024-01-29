import moment from "moment";

export function momentDate(
  date: string,
  format: string = "YYYY-MM-DD HH:mm:ss"
) {
  return moment(moment.utc(moment.utc(date)).toDate()).format(format);
}
