/** Shared message catalogue: English ships first, Romanian content can be supplied per key.
 * Educational puzzle content itself remains authored in English until translated and reviewed.
 */
export const messages={
  en:{academy:'Academy',challenges:'Challenges',laboratory:'Laboratory',collection:'Collection',settings:'Settings',continue:'Continue',export:'Export',import:'Import',guest:'Guest Mode',back:'Back'},
  ro:{academy:'Academie',challenges:'Provocări',laboratory:'Laborator',collection:'Colecție',settings:'Setări',continue:'Continuă',export:'Exportă',import:'Importă',guest:'Mod vizitator',back:'Înapoi'}
} as const;
export type Locale=keyof typeof messages;
export type MessageKey=keyof typeof messages.en;
export const t=(locale:Locale,key:MessageKey)=>messages[locale][key]||messages.en[key];
