import React from 'react';

export const InterviewSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <div className="aspect-w-16 aspect-h-9 mb-8">
            <iframe
              src="https://www.youtube.com/embed/IssSNAzj4ag"
              title="Entrevista CJC - Leilão de imóveis"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-96 rounded-lg"
            ></iframe>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Confira a entrevista do advogado <strong className="text-[#d68e08]">Raphael Cataldo Siston</strong> sobre leilões de imóveis
          </h2>
          <a 
            href="https://www.youtube.com/channel/UCldbgxJU1D9h3UAVUIRIRYg" 
            className="inline-block bg-[#d68e08] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#b8780a] transition-colors"
          >
            Assista na íntegra
          </a>
        </div>
      </div>
    </section>
  );
};
