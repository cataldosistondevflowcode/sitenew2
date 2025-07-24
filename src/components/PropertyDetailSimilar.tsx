import React from 'react';
import { createPropertyUrl } from '../utils/slugUtils';

export const PropertyDetailSimilar = () => {
  const similarProperties = [
    {
      id: 2,
      title: "Apartamento em Copacabana",
      location: "Copacabana, Rio de Janeiro/RJ",
      image: "https://via.placeholder.com/400x300/cccccc/666666?text=Apartamento",
      firstAuctionDate: "25/06/2025",
      firstAuctionValue: "R$ 450.000,00",
      secondAuctionDate: "10/07/2025",
      secondAuctionValue: "R$ 380.000,00",
      area: "75 m²",
      parkingSpots: "1"
    },
    {
      id: 3,
      title: "Casa em Jacarepaguá",
      location: "Jacarepaguá, Rio de Janeiro/RJ",
      image: "https://via.placeholder.com/400x300/cccccc/666666?text=Casa",
      firstAuctionDate: "15/06/2025",
      firstAuctionValue: "R$ 320.000,00",
      secondAuctionDate: "30/06/2025",
      secondAuctionValue: "R$ 280.000,00",
      area: "120 m²",
      parkingSpots: "2"
    },
    {
      id: 4,
      title: "Sala Comercial no Centro",
      location: "Centro, Rio de Janeiro/RJ",
      image: "https://via.placeholder.com/400x300/cccccc/666666?text=Sala+Comercial",
      firstAuctionDate: "10/06/2025",
      firstAuctionValue: "R$ 180.000,00",
      secondAuctionDate: "25/06/2025",
      secondAuctionValue: "R$ 150.000,00",
      area: "45 m²",
      parkingSpots: "0"
    }
  ];

  return (
    <section className="py-12 bg-[#222]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#d68e08]">Imóveis Similares</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {similarProperties.map((property) => (
            <div key={property.id} className="bg-[#333] rounded-lg shadow-md overflow-hidden">
              <img 
                src={property.image} 
                alt={property.title} 
                className="w-full h-48 object-cover"
              />
              
              <div className="p-4 text-white">
                <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                <p className="text-gray-400 mb-4">{property.location}</p>
                
                <table className="w-full mb-4 border-collapse">
                  <tbody>
                    <tr>
                      <th className="text-left py-1 text-gray-400">Primeiro leilão</th>
                      <th className="text-left py-1 text-gray-400">Valor Mínimo</th>
                    </tr>
                    <tr>
                      <td className="py-1">{property.firstAuctionDate}</td>
                      <td className="py-1">{property.firstAuctionValue}</td>
                    </tr>
                    <tr>
                      <th className="text-left py-1 text-gray-400">Segundo leilão</th>
                      <th className="text-left py-1 text-gray-400">Valor Mínimo</th>
                    </tr>
                    <tr>
                      <td className="py-1">{property.secondAuctionDate}</td>
                      <td className="py-1">{property.secondAuctionValue}</td>
                    </tr>
                  </tbody>
                </table>
                
                <div className="flex items-center mb-4 text-sm text-gray-400">
                  <span className="mr-4">{property.area}</span>
                  {parseInt(property.parkingSpots) > 0 && <span>{property.parkingSpots} vaga(s)</span>}
                </div>
                
                <div className="flex justify-end mt-4">
                  <a
                    href={createPropertyUrl(property.id, property.location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#d68e08] text-white px-4 py-2 rounded mr-2 hover:bg-[#b8780a]"
                  >
                    Saiba Mais
                  </a>
                  <a
                    href="#"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Fale conosco
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
