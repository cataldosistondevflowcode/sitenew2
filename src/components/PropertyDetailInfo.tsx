import { MapPin, Calendar, DollarSign, Facebook, Twitter, Linkedin, MessageCircle, Mail } from "lucide-react";
import { PropertyMap } from "./PropertyMap";
import { useSearchParams } from "react-router-dom";

interface PropertyDetailInfoProps {
  property: {
    id: number;
    title: string;
    address: string;
    location: string;
    image: string;
    firstAuctionDate: string;
    firstAuctionValue: number;
    secondAuctionDate: string;
    secondAuctionValue: number;
    auctionType: string;
    fgts: boolean;
    financiamento: boolean;
    parcelamento?: boolean;
  };
  rawPropertyData?: any;
}

export const PropertyDetailInfo = ({ property, rawPropertyData }: PropertyDetailInfoProps) => {
  const [searchParams] = useSearchParams();
  const showDebug = searchParams.get('debug') === 'true';
  
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  
  const getBadges = () => {
    const badges = [];
    
    if (property.auctionType === "Judicial") {
      badges.push({
        text: "JUDICIAL",
        color: "bg-red-700"
      });
    }
    
    else if (property.auctionType !== "Judicial" && property.financiamento === true) {
      badges.push({
        text: "EXTRAJUDICIAL FINANCIÁVEL",
        color: "bg-purple-600"
      });
    }
    
    else if (property.auctionType !== "Judicial") {
      badges.push({
        text: "EXTRAJUDICIAL",
        color: "bg-orange-600"
      });
    }
    
    if (property.fgts === true) {
      badges.push({
        text: "FGTS",
        color: "bg-[#d68e08]"
      });
    }
    
    return badges;
  };

  const badges = getBadges();
  
  return (
    <section className="py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">{property.title}</h1>
      
      <div className="mb-6 bg-white rounded-lg p-4 shadow-lg">
        <p className="text-lg flex items-start text-gray-900">
          <MapPin className="mr-2 text-orange-500 mt-1 flex-shrink-0" size={20} />
          <strong>{property.address}</strong>
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <PropertyMap property={property} rawPropertyData={rawPropertyData} />
          
          <div className="mt-8 bg-white rounded-lg p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-2 flex items-center text-sm font-medium">
                  <Calendar className="mr-2 text-orange-500" size={16} />
                  Primeiro Leilão
                </p>
                <p className="text-lg font-bold text-gray-900">{property.firstAuctionDate}</p>
                <p className="text-gray-600 text-sm mt-1">Valor mínimo</p>
                <p className="text-xl font-bold text-orange-600">{formatCurrency(property.firstAuctionValue)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-2 flex items-center text-sm font-medium">
                  <Calendar className="mr-2 text-orange-500" size={16} />
                  Segundo leilão
                </p>
                <p className="text-lg font-bold text-gray-900">{property.secondAuctionDate}</p>
                <p className="text-gray-600 text-sm mt-1">Valor mínimo</p>
                <p className="text-xl font-bold text-orange-600">{formatCurrency(property.secondAuctionValue)}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <span 
                key={index}
                className={`inline-block ${badge.color} text-white px-4 py-2 rounded-full text-sm font-semibold`}
              >
                {badge.text}
              </span>
            ))}
          </div>
        </div>
        
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-yellow-500 font-bold text-xs">CATALDO</div>
                  <div className="text-yellow-500 font-bold text-xs">SISTON</div>
                  <div className="text-white text-xs mt-1">ADVOGADOS</div>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">CATALDO SISTON</h2>
            </div>
            
            <div className="space-y-3">
              <a href="tel:+552131733795" className="flex items-center justify-center text-[#d68e08] hover:text-[#b8780a] font-semibold text-sm">
                📞 +55 (21) 3173-3795
              </a>
              <a href="mailto:contato@cataldosiston-adv.com.br" className="flex items-center justify-center text-[#d68e08] hover:text-[#b8780a] font-semibold text-sm break-all">
                ✉️ contato@cataldosiston-adv.com.br
              </a>
              <button className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 font-semibold text-sm transition-colors">
                Fale com nossos advogados
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-bold mb-3 text-gray-900 text-center">COMPARTILHAR</h3>
              <div className="flex justify-center space-x-3">
                <a href="#" className="text-[#d68e08] hover:text-[#b8780a] p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="Facebook">
                  <Facebook size={18} />
                </a>
                <a href="#" className="text-[#d68e08] hover:text-[#b8780a] p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="Twitter">
                  <Twitter size={18} />
                </a>
                <a href="#" className="text-[#d68e08] hover:text-[#b8780a] p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="LinkedIn">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="text-green-600 hover:text-green-700 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="WhatsApp">
                  <MessageCircle size={18} />
                </a>
                <a href="#" className="text-red-500 hover:text-red-600 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="E-mail">
                  <Mail size={18} />
                </a>
              </div>
            </div>
          
            {showDebug && (
              <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-600">
                <h3 className="text-lg font-bold mb-4 text-yellow-400">🐛 DEBUG - Dados do Imóvel</h3>
                
                {rawPropertyData && (
                  <div className="mb-6">
                    <h4 className="text-md font-semibold mb-3 text-green-400">📁 Dados Originais da Api:</h4>
                    <div className="space-y-2 text-sm bg-gray-900 p-3 rounded">
                      {Object.entries(rawPropertyData).map(([key, value]) => (
                        <div key={key} className="flex flex-col sm:flex-row border-b border-gray-700 pb-1">
                          <span className="font-semibold text-[#d68e08] min-w-[180px]">{key}:</span>
                          <span className="text-gray-100 break-all">
                            {value === null ? (
                              <span className="text-red-400">null</span>
                            ) : value === undefined ? (
                              <span className="text-red-400">undefined</span>
                            ) : typeof value === 'object' ? (
                              <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(value, null, 2)}</pre>
                            ) : typeof value === 'boolean' ? (
                              <span className={value ? "text-green-400" : "text-red-400"}>{String(value)}</span>
                            ) : (
                              String(value)
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="text-md font-semibold mb-3 text-orange-400">🔄 Dados Formatados para Exibição:</h4>
                  <div className="space-y-2 text-sm bg-gray-900 p-3 rounded">
                    {Object.entries(property).map(([key, value]) => (
                      <div key={key} className="flex flex-col sm:flex-row border-b border-gray-700 pb-1">
                        <span className="font-semibold text-yellow-300 min-w-[180px]">{key}:</span>
                        <span className="text-gray-100 break-all">
                          {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyDetailInfo;
