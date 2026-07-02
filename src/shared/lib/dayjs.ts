import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import tlPh from 'dayjs/locale/tl-ph'
import 'dayjs/locale/de'
import 'dayjs/locale/es'
import 'dayjs/locale/fr'
import 'dayjs/locale/hi'
import 'dayjs/locale/ja'
import 'dayjs/locale/ko'
import 'dayjs/locale/pt'
import 'dayjs/locale/ru'
import 'dayjs/locale/zh'
import 'dayjs/locale/uk'
import 'dayjs/locale/it'
import 'dayjs/locale/pl'
import 'dayjs/locale/id'
import 'dayjs/locale/vi'
import 'dayjs/locale/th'

dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)

// dayjs no trae locale 'fil'; se registra el tagalo (tl-ph) bajo ese nombre.
// Tercer argumento true = solo registrar, sin cambiar el locale global.
dayjs.locale('fil', { ...tlPh, name: 'fil' }, true)

export default dayjs
