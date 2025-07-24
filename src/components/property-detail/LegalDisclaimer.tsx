import React from 'react';

export const LegalDisclaimer: React.FC = () => {
  return (
    <footer className="mt-20 max-md:mt-10">
      <p className="self-center text-lg text-center text-zinc-900 max-md:max-w-full">
        O imóvel em leilão acima não foi objeto de análise jurídica prévia.
      </p>
      <div className="flex flex-wrap gap-1 self-end mt-2.5 text-lg text-center text-zinc-900">
        <span className="grow max-md:max-w-full">
          Entenda como funciona o nosso{" "}
          <span style={{fontWeight: 700}}>estudo de viabilidade jurídica</span>{" "}
          clicando{" "}
        </span>
        <a href="https://leilaodeimoveis-cataldosiston.com/leilao-de-imoveis-importancia-analise-juridica/" className="font-bold text-yellow-600" target="_blank" rel="noopener noreferrer">
          aqui
        </a>
        <span className="my-auto basis-auto">
          {" "}ou entre em contato conosco.
        </span>
      </div>
    </footer>
  );
}; 