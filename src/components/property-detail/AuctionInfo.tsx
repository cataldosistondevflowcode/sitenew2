import React from 'react';

interface AuctionDate {
  label: string;
  date: string;
  icon: string;
  isHighlighted?: boolean;
}

interface AuctionPrice {
  label: string;
  amount: string;
  icon: string;
  isHighlighted?: boolean;
}

interface AuctionInfoProps {
  dates: AuctionDate[];
  prices: AuctionPrice[];
}

export const AuctionInfo: React.FC<AuctionInfoProps> = ({ dates, prices }) => {
  return (
    <section className="w-full mt-7">
      {/* Layout para mobile - stack vertical */}
      <div className="flex flex-col gap-6 sm:hidden">
        {dates.map((dateInfo, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={dateInfo.icon}
                alt=""
                className="object-contain shrink-0 w-6 h-6"
              />
              <div className="text-sm font-medium text-gray-600">
                {dateInfo.label}
              </div>
            </div>
            <div className={`text-lg font-bold ${
              dateInfo.isHighlighted ? 'text-yellow-600' : 'text-neutral-700'
            }`}>
              {dateInfo.date}
            </div>
          </div>
        ))}
      </div>

      {/* Layout para desktop - horizontal */}
      <div className="hidden sm:flex gap-6 lg:gap-10 text-right">
        <div className="flex flex-col">
          {dates.map((dateInfo, index) => (
            <div key={index} className={index > 0 ? "mt-6" : ""}>
              <div className="flex gap-2 items-start">
                <img
                  src={dateInfo.icon}
                  alt=""
                  className="object-contain shrink-0 mt-4 w-8 aspect-square"
                />
                <div>
                  <div className="text-sm text-black">
                    {dateInfo.label}
                  </div>
                  <div className={`mt-3.5 text-lg font-bold ${
                    dateInfo.isHighlighted ? 'text-yellow-600' : 'text-neutral-700'
                  }`}>
                    {dateInfo.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col">
          {prices.map((priceInfo, index) => (
            <div key={index} className={index > 0 ? "mt-6" : ""}>
              <div className="self-end text-sm text-black">
                {priceInfo.label}
              </div>
              <div className="flex gap-2.5 mt-2 text-lg font-bold">
                <img
                  src={priceInfo.icon}
                  alt=""
                  className="object-contain shrink-0 w-8 aspect-square"
                />
                <div className={`grow shrink my-auto ${
                  priceInfo.isHighlighted ? 'text-yellow-600' : 'text-neutral-700'
                }`}>
                  {priceInfo.amount}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 