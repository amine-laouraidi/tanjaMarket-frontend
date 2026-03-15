import AdCard from "./AdCard";

const STATIC_ADS = [
  {
    id: "1",
    title: "iPhone 13 Pro 256GB",
    price: "4 500",
    category: "Téléphones",
    location: "Malabata",
    time: "2h",
    image: null,
  },
  {
    id: "2",
    title: "Dacia Logan 2019",
    price: "85 000",
    category: "Voitures",
    location: "Centre",
    time: "5h",
    image: null,
  },
  {
    id: "3",
    title: "Appartement F3 Mesnana",
    price: "450 000",
    category: "Immobilier",
    location: "Mesnana",
    time: "1j",
    image: null,
  },
  {
    id: "4",
    title: "Samsung S23 Ultra",
    price: "6 200",
    category: "Téléphones",
    location: "Beni Makada",
    time: "3h",
    image: null,
  },
  {
    id: "5",
    title: "Renault Clio 2020",
    price: "95 000",
    category: "Voitures",
    location: "Gzenaya",
    time: "6h",
    image: null,
  },
  {
    id: "6",
    title: "Veste en cuir homme",
    price: "350",
    category: "Vêtements",
    location: "Centre",
    time: "1j",
    image: null,
  },
];

export default async function ListingsGrid({ filters }) {
  const ads = STATIC_ADS.filter((ad) => {
    if (filters?.category && filters.category !== "Tous") {
      if (ad.category !== filters.category) return false;
    }
    if (filters?.query) {
      if (!ad.title.toLowerCase().includes(filters.query.toLowerCase()))
        return false;
    }
    return true;
  });
  // const res = await fetch(`${process.env.BACKEND_URL}/categories`);
  // const json = await res.json();
  // const ads1 = json.data; 
  return (
    <div>
      <p className="text-sm font-medium mb-3">{ads.length} annonces trouvées</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  );
}
