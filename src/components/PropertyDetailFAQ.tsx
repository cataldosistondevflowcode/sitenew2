import React, { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export const PropertyDetailFAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    if (openItems.includes(id)) {
      setOpenItems(openItems.filter(item => item !== id));
    } else {
      setOpenItems([...openItems, id]);
    }
  };

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: "Como posso ter a posse do imóvel arrematado?",
      answer: "Após a arrematação e o pagamento do valor devido, você receberá a Carta de Arrematação. Com este documento, deve proceder ao registro da propriedade no cartório competente. Se o imóvel estiver ocupado, será necessário entrar com uma ação de imissão na posse para obter a desocupação legal do bem."
    },
    {
      id: 2,
      question: "Como é feito o pagamento no leilão judicial?",
      answer: "O pagamento em leilão judicial é feito em duas etapas: 20% do valor da arrematação deve ser pago no ato (à vista), e os 80% restantes devem ser quitados em até 30 dias após a arrematação. O pagamento pode ser feito através de depósito judicial ou conforme especificado no edital do leilão."
    },
    {
      id: 3,
      question: "Dinheiro de leilão pode ser usado para quitar condomínio após arremate?",
      answer: "Sim, o valor pago no leilão pode ser usado para quitar débitos condominiais pendentes do imóvel. É importante verificar no edital se há débitos de condomínio e IPTU, pois estes geralmente são de responsabilidade do arrematante após a aquisição."
    },
    {
      id: 4,
      question: "Imóvel arrematado com hipoteca. O que fazer?",
      answer: "Quando um imóvel é arrematado em leilão judicial, as hipotecas e ônus anteriores são automaticamente extintos com a arrematação, desde que o processo judicial tenha sido conduzido corretamente. A Carta de Arrematação garante a propriedade livre e desembaraçada do bem."
    },
    {
      id: 5,
      question: "Quem é responsável pelos débitos de IPTU do imóvel leiloado?",
      answer: "Em leilões judiciais, os débitos de IPTU anteriores à arrematação são de responsabilidade do antigo proprietário. Porém, é fundamental verificar no edital se há alguma cláusula específica sobre este assunto, pois em alguns casos o arrematante pode assumir estes débitos."
    },
    {
      id: 6,
      question: "É seguro arrematar imóveis em leilão?",
      answer: "Arrematar imóveis em leilão pode ser seguro quando feito com a devida assessoria jurídica especializada. É essencial fazer um estudo prévio do processo, verificar a documentação do imóvel, analisar possíveis riscos e contar com acompanhamento profissional durante todo o procedimento."
    },
    {
      id: 7,
      question: "Qual é o valor utilizado como base de cálculo do ITBI?",
      answer: "O ITBI (Imposto sobre Transmissão de Bens Imóveis) em arrematações judiciais é calculado sobre o valor da arrematação, ou seja, o valor pelo qual o imóvel foi adquirido no leilão. A alíquota varia conforme o município, geralmente entre 2% a 3% do valor de arrematação."
    },
    {
      id: 8,
      question: "Vale a pena comprar imóvel em leilão?",
      answer: "Pode valer a pena comprar imóvel em leilão devido aos preços abaixo do mercado, que podem representar descontos significativos. Porém, é fundamental contar com assessoria jurídica especializada, fazer um estudo detalhado do processo e estar preparado para possíveis riscos como imóveis ocupados ou demoras na regularização."
    }
  ];

  return (
    <section className="py-12 bg-[#191919]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#d68e08]">Dúvidas sobre leilões de imóveis</h2>
        
        <div className="max-w-4xl mx-auto">
          {faqItems.map((item) => (
            <div key={item.id} className="mb-4 border-b border-gray-700 pb-4">
              <button
                className="flex justify-between items-center w-full text-left font-semibold text-lg py-2 text-white"
                onClick={() => toggleItem(item.id)}
                aria-expanded={openItems.includes(item.id)}
              >
                {item.question}
                {openItems.includes(item.id) ? (
                  <span className="text-[#d68e08]">-</span>
                ) : (
                  <span className="text-[#d68e08]">+</span>
                )}
              </button>
              
              {openItems.includes(item.id) && (
                <div className="mt-2 text-gray-400">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <a 
            href="#" 
            className="inline-block bg-[#d68e08] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#b8780a] transition-colors"
          >
            MAIS DÚVIDAS? FALE COM NOSSOS ADVOGADOS
          </a>
        </div>
      </div>
    </section>
  );
};
