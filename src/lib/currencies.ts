const displayNames = new Intl.DisplayNames(['en'], { type: 'currency' });

export const CURRENCY_LIST: { code: string; name: string }[] = (() => {
  try {
    return (Intl as any).supportedValuesOf('currency')
      .map((code: string) => {
        try { return { code, name: displayNames.of(code) ?? code }; }
        catch { return { code, name: code }; }
      })
      .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
  } catch {
    const fallback = ['AED','AFN','ALL','AMD','ANG','AOA','ARS','AUD','AWG','AZN','BAM','BBD','BDT','BGN','BHD','BIF','BMD','BND','BOB','BRL','BSD','BTN','BWP','BYR','BZD','CAD','CDF','CHF','CLP','CNY','COP','CRC','CUP','CVE','CZK','DJF','DKK','DOP','DZD','EGP','ERN','ETB','EUR','FJD','GBP','GEL','GHS','GMD','GTQ','GYD','HKD','HNL','HRK','HTG','HUF','IDR','ILS','INR','IQD','IRR','ISK','JMD','JOD','JPY','KES','KGS','KHR','KMF','KRW','KWD','KYD','KZT','LAK','LBP','LKR','LRD','LSL','LYD','MAD','MDL','MGA','MKD','MMK','MNT','MOP','MRO','MUR','MVR','MWK','MXN','MYR','MZN','NAD','NGN','NIO','NOK','NPR','NZD','OMR','PAB','PEN','PGK','PHP','PKR','PLN','PYG','QAR','RON','RSD','RUB','RWF','SAR','SBD','SCR','SDG','SEK','SGD','SHP','SLL','SOS','SRD','STD','SVC','SYP','SZL','THB','TJS','TMT','TND','TOP','TRY','TTD','TWD','TZS','UAH','UGX','USD','UYU','UZS','VEF','VND','VUV','WST','XAF','XCD','XOF','XPF','YER','ZAR','ZMW','ZWL'];
    return fallback.map(code => {
      try { return { code, name: displayNames.of(code) ?? code }; }
      catch { return { code, name: code }; }
    }).sort((a, b) => a.name.localeCompare(b.name));
  }
})();

export function currencyLabel(code: string): string {
  const found = CURRENCY_LIST.find(c => c.code === code);
  return found ? `${code} — ${found.name}` : code;
}
