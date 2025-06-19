"use client";
import React, { useState } from 'react';
import { Breadcrumb } from './Breadcrumb';
import { PropertyHeader } from './PropertyHeader';
import { PropertyMap } from '../PropertyMap';
import { AuctionInfo } from './AuctionInfo';
import { PropertyDescription } from './PropertyDescription';
import { ContactSidebar } from './ContactSidebar';
import { PropertySpecs } from './PropertySpecs';
import { LegalDisclaimer } from './LegalDisclaimer';

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
    
    if (property.fgts) {
      tags.push({ label: "FGTS", color: "green" as const });
    }
    
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
    <div className="flex justify-center w-full bg-white">
      <article className="flex flex-col pr-7 max-w-[930px] max-md:pr-5 bg-white">
        <div className="w-full max-w-[850px] max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <main className="w-[66%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col items-start w-full max-md:mt-2 max-md:max-w-full">
                <Breadcrumb items={breadcrumbItems} />

                <PropertyHeader
                  title={property.title}
                  address={property.address}
                  locationIcon="https://cdn.builder.io/api/v1/image/assets/TEMP/ee1c5f3efaad98892884165349c5770eb58341b2?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
                />

                <div className="mt-2 w-full">
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

            <div className="ml-5 w-[34%] max-md:ml-0 max-md:w-full">
              <ContactSidebar contactInfo={contactInfo} />
            </div>
          </div>
        </div>

        <PropertySpecs specs={propertySpecs} />

        <LegalDisclaimer />
      </article>
    </div>
  );
}; 