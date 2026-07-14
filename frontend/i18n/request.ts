import {getRequestConfig} from 'next-intl/server';
import {cookies} from 'next/headers';
import { getUserLocale } from './util';
 
export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = await getUserLocale(); // custom should be used to avoid infinite loop (use native getLocale | useLocale elsewhere)
 
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
