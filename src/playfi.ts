import axios from 'axios';
import { DesiredSlot } from './types';
import { matchFreeAndDesiredSlots } from './utils';
import { DateTime } from 'luxon';

const getSearchUrl = (court: string, date: string) =>
 `https://play.fi/${court}/booking/booking-calendar?BookingCalForm%5Bp_pvm%5D=${date}`

export const scrapePlayFi = async (desiredSlot: DesiredSlot) => {
  const url = getSearchUrl(desiredSlot.court, desiredSlot.day);
  const response = await axios.get<string>(url);
  const freeSlotElements = response.data.match(/T\d+<br>\d+:\d+/g);
  const freeSlots = (freeSlotElements || []).map(el => el.split('<br>')[1]);

  const weekdayToday = DateTime.now().setLocale('fi').toLocaleString({ weekday: 'long' });
  const dateToday = DateTime.now().setLocale('fi').toLocaleString({ day: '2-digit', month: '2-digit', year: 'numeric' });
  const today = `${weekdayToday} ${dateToday}`;
  const searchString = today.charAt(0).toUpperCase() + today.slice(1);
  if (response.data.search(searchString) === -1) {
    await matchFreeAndDesiredSlots(desiredSlot, freeSlots, url);
  } else {
    console.log('Date not yet open!');
  }
}