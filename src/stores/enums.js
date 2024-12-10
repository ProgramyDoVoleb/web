import { ref } from 'vue'
import { defineStore } from 'pinia'
import elections from './enums/elections'
import towns from './enums/towns'

export const useEnums = defineStore('enums', () => {
  const regions = ref(['Praha', 'Středočeský kraj', 'Jihočeský kraj', 'Plzeňský kraj', 'Karlovarský kraj', 'Ústecký kraj', 'Liberecký kraj', 'Královéhradecký kraj', 'Pardubický kraj', 'Vysočina', 'Jihomoravský kraj', 'Olomoucký kraj', 'Zlínský kraj', 'Moravskoslezský kraj']);
  const regionsShort = ref(['Praha', 'STK', 'JCK', 'PLK', 'KVK', 'ÚLK', 'LBK', 'KHK', 'PAK', 'VYS', 'JMK', 'OLK', 'ZLK', 'MSK']);
  // const elections = ref(electionsData);
  // const towns = ref(townsData);
  const status = ['neznámé', 'v přípravě', 'již brzy', 'ukončeny'];
  const editace = ['není dostupná', 'otevřena', 'uzavřena', 'nespuštěna'];

  return { elections, towns, regions, regionsShort, status, editace }
})