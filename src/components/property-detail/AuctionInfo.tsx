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
    <section className="flex gap-10 mt-7 ml-3.5 text-right max-md:ml-2.5">
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
    </section>
  );
}; 