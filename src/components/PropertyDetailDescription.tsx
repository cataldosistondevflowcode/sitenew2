import { Home, Maximize, Car, Bed, Bath } from "lucide-react";

interface PropertyDetailDescriptionProps {
  property: {
    description: string;
    propertyType: string;
    area: string;
    parkingSpots: string;
    bedrooms: number;
    bathrooms: number;
  };
}

export const PropertyDetailDescription = ({ property }: PropertyDetailDescriptionProps) => {
  return (
    <section className="py-8">
      <h2 className="text-3xl font-bold mb-6 text-[#d68e08]">Descrição</h2>
      
      <div className="bg-[#222] rounded-lg p-6 shadow-sm">
        <p className="text-lg mb-4">
          {property.description || `Imóvel localizado em excelente localização. ${property.propertyType} com ${property.area} de área, ${property.bedrooms} quartos, ${property.bathrooms} banheiros e ${property.parkingSpots} vaga(s) de garagem.`}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <Home className="mr-2 text-[#d68e08]" size={18} />
              <h3 className="text-gray-400">Tipo</h3>
            </div>
            <p className="font-semibold">{property.propertyType}</p>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <Maximize className="mr-2 text-[#d68e08]" size={18} />
              <h3 className="text-gray-400">Área Edificada</h3>
            </div>
            <p className="font-semibold">{property.area}</p>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <Car className="mr-2 text-[#d68e08]" size={18} />
              <h3 className="text-gray-400">Vagas</h3>
            </div>
            <p className="font-semibold">{property.parkingSpots}</p>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <Bed className="mr-2 text-[#d68e08]" size={18} />
              <h3 className="text-gray-400">Quartos</h3>
            </div>
            <p className="font-semibold">{property.bedrooms}</p>
          </div>
        </div>
        
        <div className="mt-10 p-4 bg-[#333] border-l-4 border-[#d68e08] rounded">
          <p className="text-lg">
            O imóvel em leilão acima não foi objeto de análise jurídica prévia.
            Entenda como funciona o nosso <strong>estudo de viabilidade jurídica</strong> clicando <a href="#" className="text-[#d68e08] hover:underline">aqui</a> ou entre em contato conosco.
          </p>
        </div>
      </div>
    </section>
  );
};
