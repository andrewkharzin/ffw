// configs/date_util.ts
import { format } from 'date-fns'

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return format(date, 'dd MMMM yy HH:mm')
}
