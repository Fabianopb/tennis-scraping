import axios from 'axios';
import { DesiredSlot } from './types';
import { matchFreeAndDesiredSlots } from './utils';

const getSearchUrl = (court: string, date: string) =>
 `https://play.fi/${court}/booking/booking-calendar?BookingCalForm%5Bp_pvm%5D=${date}`

export const scrapePlayFi = async (desiredSlot: DesiredSlot) => {
  const url = getSearchUrl(desiredSlot.court, desiredSlot.day);
  const response = await axios.get<string>(url);
  const freeSlotElements = response.data.match(/T\d+<br>\d+:\d+/g);
  const freeSlots = (freeSlotElements || []).map(el => el.split('<br>')[1]);
  console.log(freeSlots)
  await matchFreeAndDesiredSlots(desiredSlot, freeSlots, url);
}