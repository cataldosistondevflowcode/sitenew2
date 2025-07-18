"use client";
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Breadcrumb } from './Breadcrumb';
import { PropertyHeader } from './PropertyHeader';
import { PropertyMap } from '../PropertyMap';
import { AuctionInfo } from './AuctionInfo';
import { PropertyDescription } from './PropertyDescription';
import { ContactSidebar } from './ContactSidebar';
import { PropertySpecs } from './PropertySpecs';

import { AuctionBenefitsSection } from '../AuctionBenefitsSection';
import { FAQSection } from '../FAQSection';

interface PropertyDetailData {
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
  area?: string;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpots?: string;
  propertyType?: string;
  description?: string;
}

interface MainPropertyDetailProps {
  property: PropertyDetailData;
  rawPropertyData?: any;
}

export const MainPropertyDetail: React.FC<MainPropertyDetailProps> = ({ property, rawPropertyData }) => {
  const [searchParams] = useSearchParams();
  const showDebug = searchParams.get('debug') === 'true';
  
  const handleTripleClick = () => {
    // Criar nova URL com debug=true
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('debug', 'true');
    
    console.log('🎯 TRIPLE CLICK DETECTADO! Redirecionando para URL com debug...');
    console.log('URL atual:', window.location.href);
    console.log('Nova URL:', currentUrl.toString());
    
    // Navegar para a nova URL
    window.location.href = currentUrl.toString();
  };

  const breadcrumbItems = [
    { label: "Home", isActive: true },
    { label: "Imóveis em Leilão RJ", isActive: true },
    { label: property.title, isActive: false }
  ];

  const auctionDates = [
    {
      label: "Primeiro Leilão",
      date: property.firstAuctionDate,
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/0c1b9a5c890ea4b9ece72825b12e2078bb3d9f3b?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a",
      isHighlighted: false
    },
    {
      label: "Segundo leilão",
      date: property.secondAuctionDate,
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/de1df9c7b0b25ed2db9b839ae29e8bde83807add?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a",
      isHighlighted: true
    }
  ];

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const auctionPrices = [
    {
      label: "Valor mínimo",
      amount: formatCurrency(property.firstAuctionValue),
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/1daab3191f50d9072b7f6d7fc0ace88cdd3dabb7?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a",
      isHighlighted: false
    },
    {
      label: "Valor mínimo",
      amount: formatCurrency(property.secondAuctionValue),
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/8419ca8147bcc923f27de74f0f17f7b2b23e0c19?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a",
      isHighlighted: true
    }
  ];

  const getPropertyTags = () => {
    const tags = [];
    
    if (property.auctionType === "Judicial") {
      tags.push({ label: "Judicial", color: "yellow" as const });
    } else {
      tags.push({ label: "Extrajudicial", color: "yellow" as const });
    }
    
    // Tag FGTS removida - não é mais necessária
    
    if (property.financiamento) {
      tags.push({ label: "Financiável", color: "green" as const });
    }
    
    tags.push({ label: "À vista", color: "green" as const });
    
    return tags;
  };

  const propertyTags = getPropertyTags();

  const getPropertyDescriptions = () => {
    const descriptions = [];
    
    descriptions.push(property.address);
    
    if (property.description) {
      descriptions.push(property.description);
    }
    
    if (property.area) {
      descriptions.push(`Área de ${property.area}.`);
    }
    
    descriptions.push("Boa localização.");
    
    return descriptions;
  };

  const propertyDescriptions = getPropertyDescriptions();

  const contactInfo = {
    phone: "+55 (21) 3173-3795",
    email: "contato@cataldosiston-adv.com.br",
    phoneIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/a5a6018d625ad3fafa20767bc78a6d23e34f27f7?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a",
    emailIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/dc8f6551c10be70bc9a16b354b633d2e0dc1de35?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a",
    chatIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/18f05f2cf604e67c9699b454d0c25529cc856b1b?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a",
    socialIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/53799ed454dbb9b88c28a4b05438d39df5f803dd?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
  };

  const propertySpecs = [
    { label: "Tipo", value: property.propertyType || "Imóvel" },
    { label: "Área Edificada", value: property.area || "N/A" },
    { label: "Vagas", value: property.parkingSpots || "0" },
    { label: "Quartos", value: property.bedrooms?.toString() || "0" }
  ];

  return (
    <div className="flex justify-center w-full bg-white mb-0 px-4 sm:px-6 lg:px-8">
      <article className="flex flex-col w-full max-w-[930px] bg-white mb-0">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <main className="w-full lg:w-[66%]">
              <div className="flex flex-col items-start w-full">
                <Breadcrumb items={breadcrumbItems} />

                <PropertyHeader
                  title={property.title}
                  address={property.address}
                  locationIcon="https://cdn.builder.io/api/v1/image/assets/TEMP/ee1c5f3efaad98892884165349c5770eb58341b2?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
                />

                <div className="mt-4 w-full">
                  <PropertyMap 
                    property={{
                      image: property.image,
                      title: property.title
                    }}
                    rawPropertyData={rawPropertyData}
                  />
                </div>

                <AuctionInfo dates={auctionDates} prices={auctionPrices} />

                <PropertyDescription
                  tags={propertyTags}
                  descriptions={propertyDescriptions}
                />
              </div>
            </main>

            <aside className="w-full lg:w-[34%] mt-6 lg:mt-0">
              <div className="lg:sticky lg:top-4">
                <ContactSidebar 
                  contactInfo={contactInfo} 
                  onTripleClick={handleTripleClick}
                />
                
                {/* Debug Section */}
                {showDebug && (
                  <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-bold mb-4 text-yellow-400">🐛 DEBUG - Dados do Imóvel</h3>
                    
                    {rawPropertyData && (
                      <div className="mb-6">
                        <h4 className="text-md font-semibold mb-3 text-green-400">📁 Dados Originais da API:</h4>
                        <div className="space-y-2 text-sm bg-gray-900 p-3 rounded max-h-96 overflow-y-auto">
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
                      <div className="space-y-2 text-sm bg-gray-900 p-3 rounded max-h-96 overflow-y-auto">
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
                    
                    <div className="mt-4 p-3 bg-blue-900 rounded">
                      <h4 className="text-md font-semibold mb-2 text-blue-300">ℹ️ URL Info:</h4>
                      <p className="text-xs text-gray-300">
                        <strong>URL atual:</strong> {window.location.href}<br/>
                        <strong>Parâmetros:</strong> {searchParams.toString() || 'Nenhum'}<br/>
                        <strong>Debug ativado:</strong> <span className={showDebug ? "text-green-400" : "text-red-400"}>{showDebug ? 'SIM' : 'NÃO'}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>

        <div className="mt-8 sm:mt-12">
          <PropertySpecs specs={propertySpecs} />
        </div>

        <div className="mt-8 sm:mt-12">
          <AuctionBenefitsSection />
        </div>

        <div>
          <FAQSection />
        </div>
      </article>
    </div>
  );
};  