import { Novu } from "@novu/node";

const NOVU_API_KEY = process.env.NOVU_API_KEY;

if (!NOVU_API_KEY) {
  throw new Error("NOVU_API_KEY is not defined");
}

export const novu = new Novu(NOVU_API_KEY);

export enum NovuEvent {
  Claspr = "claspr",
}
