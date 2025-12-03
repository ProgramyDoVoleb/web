import { ref } from 'vue'
import { defineStore } from 'pinia'
import elections from './enums/elections'
import towns from './enums/towns'
import obvody from './enums/obvody'
import okresy from './enums/okresy'
import log from './enums/log'

export const useEnums = defineStore('enums', () => {
  const regions = ref(['Praha', 'Středočeský kraj', 'Jihočeský kraj', 'Plzeňský kraj', 'Karlovarský kraj', 'Ústecký kraj', 'Liberecký kraj', 'Královéhradecký kraj', 'Pardubický kraj', 'Vysočina', 'Jihomoravský kraj', 'Olomoucký kraj', 'Zlínský kraj', 'Moravskoslezský kraj']);
  const regions6 = ref(['Praze', 'Středočeském kraji', 'Jihočeském kraji', 'Plzeňském kraji', 'Karlovarském kraji', 'Ústeckém kraji', 'Libereckém kraji', 'Královéhradeckém kraji', 'Pardubickém kraji', 'kraji Vysočina', 'Jihomoravském kraji', 'Olomouckém kraji', 'Zlínském kraji', 'Moravskoslezském kraji']);
  const regionsShort = ref(['Praha', 'STK', 'JCK', 'PLK', 'KVK', 'ÚLK', 'LBK', 'KHK', 'PAK', 'VYS', 'JMK', 'OLK', 'ZLK', 'MSK']);
  // const elections = ref(electionsData);
  // const towns = ref(townsData);
  const status = ['neznámé', 'v přípravě', 'již brzy', 'ukončeny'];
  const editace = ['není dostupná', 'otevřena', 'uzavřena', 'nespuštěna'];

  return { elections, towns, regions, regions6, regionsShort, status, editace, obvody, okresy, log }
})