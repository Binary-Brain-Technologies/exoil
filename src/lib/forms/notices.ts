import { legal, PENDING_NOTICE } from "@/data/legal";

/** Client-approved clause when supplied; otherwise the interim notice (launch-check fails while it is used). */
export function orderNotice() {
  return legal.orderFormNotice ?? PENDING_NOTICE;
}
export function contactNotice() {
  return legal.contactFormNotice ?? PENDING_NOTICE;
}
export function recruitmentNotice() {
  return legal.recruitmentNotice ?? PENDING_NOTICE;
}
