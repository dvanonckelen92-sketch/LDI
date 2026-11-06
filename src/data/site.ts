// Alle bedrijfsgegevens op één plek. NAP moet identiek zijn aan het Google Bedrijfsprofiel.
export const site = {
  name: 'LDI Solutions',
  legalName: 'LDI Solutions BV',
  url: 'https://www.ldisolutions.be',
  owner: 'Lawrence Dirix',
  ownerRole: 'Zaakvoerder en elektricien',
  phone: '0477 73 98 27',
  phoneIntl: '+32477739827',
  email: 'info@ldisolutions.be',
  street: 'Abdijstraat 1G',
  postalCode: '3890',
  locality: 'Kortijs',
  municipality: 'Gingelom',
  region: 'Limburg',
  country: 'BE',
  vat: 'BE 1013.382.952',
  kbo: '1013.382.952',
  founded: '2024-09-10',
  // Link naar het Google Bedrijfsprofiel (de "Delen"-link uit Google Maps). Leeg = wordt niet getoond.
  googleProfile: '',
  // Sociale media. Een lege url wordt niet getoond. Ze komen in de footer, op de contactpagina en in sameAs.
  socials: [
    { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61567547698902' },
    { name: 'Instagram', url: '' },
    { name: 'LinkedIn', url: '' },
  ],
  // Maker van de website
  credit: { name: 'Coop Consult', url: 'https://coopconsult.be/' },
};

export const socials = site.socials.filter((s) => s.url);

export const nav = [
  { href: '/elektriciteitswerken/', label: 'Elektriciteit' },
  { href: '/zonnepanelen/', label: 'Zonnepanelen' },
  { href: '/thuisbatterij/', label: 'Thuisbatterij' },
  { href: '/laadpaal/', label: 'Laadpaal' },
  { href: '/zelfbouw-met-begeleiding/', label: 'Zelfbouw' },
  { href: '/realisaties/', label: 'Realisaties' },
  { href: '/over-ons/', label: 'Over ons' },
];
