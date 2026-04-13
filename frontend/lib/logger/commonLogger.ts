import { getPinoLogger } from "@/lib/logger/pinoLogger"
import SendSlackAlert from "@/helpers/alerts/sendSlackAlert";

export function CommonLogger(level: 'fatal' | 'error' | 'warn' | 'info' | 'debug', message: string, type: 'full' | 'pino' | 'slack'):void {
  const logger = getPinoLogger();
  if (type === 'full') {
    logger[level](message)
    SendSlackAlert(message)
  } else if (type === 'pino') {
    logger[level](message)
  } else if (type === 'slack') {
    SendSlackAlert(message)
  }
}
