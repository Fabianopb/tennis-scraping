import axios from 'axios';
import moment from 'moment';

export const logFreeTapiolaSlots = (date: string, freeSlots: string[][]) => {
  console.log(`\n::(${moment().format('L LT')}):: Slots for ${date} in Tapiola`);
  console.log(freeSlots, '\n');
}

export const shouldNotifyFreeSlotsInTapiola = async (date: string, skipTimes: string[]) => {
  const response = await axios.get<string>(`https://vj.slsystems.fi/tennispuisto/ftpages/ft-varaus-table-01.php?laji=1&pvm=${date}&goto=0`);
  const freeSlotElements = response.data.match(/Te\d+<br>\d+:\d+/g);
  const freeSlots = (freeSlotElements || []).map(el => el.split('<br>'));
  const filteredSlots = freeSlots.filter(slot => 
    !(skipTimes || []).some(skipTime => 
      skipTime.split('T')[0] === date && skipTime.split('T')[1] === slot[1]
    ));
  
  const nineSlots = filteredSlots.filter(slot => slot[1] === '09:00').length;
  const tenSlots = filteredSlots.filter(slot => slot[1] === '10:00').length;

  if (tenSlots >= 1 || nineSlots >= 1) {
    console.log('Found available courts! Closing process...');
      logFreeTapiolaSlots(moment(date).format('L'), filteredSlots);
      return true;
  }
  console.log(`no free slots for ${date}`);
  return false;
}