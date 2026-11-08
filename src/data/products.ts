export interface Product {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  url: string;
  badge?: string;
}

// Produits vendus via Payhip. Ajoutez ici les futurs produits avec leur lien Payhip.
export const PRODUCTS: Product[] = [
  {
    id: 'convertisseur-pdf-kpf',
    name: 'Convertisseur PDF vers KPF',
    description:
      'Transformez facilement vos fichiers PDF en format KPF pour préparer vos livres Kindle.',
    priceLabel: 'Disponible sur Payhip',
    url: 'https://mahfoud.xyz/b/8cbQk',
    badge: 'Application',
  },
];
