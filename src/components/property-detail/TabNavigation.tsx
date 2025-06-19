"use client";
import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  defaultActiveTab?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  defaultActiveTab
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id);

  return (
    <div className="flex flex-wrap max-w-full text-base font-bold text-center text-white w-[530px]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex gap-2.5 px-8 py-2 whitespace-nowrap max-md:px-5 ${
            activeTab === tab.id ? 'bg-black' : 'bg-transparent text-black'
          }`}
        >
          <img
            src={tab.icon}
            alt=""
            className="object-contain shrink-0 w-8 aspect-square"
          />
          <span className="my-auto">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}; 