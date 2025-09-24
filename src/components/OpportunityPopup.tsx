import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface OpportunityPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const OpportunityPopup: React.FC<OpportunityPopupProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Função para enviar dados - simplificada para evitar conflitos com shortcode3
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      return;
    }

    setIsSubmitting(true);

    // Simula sucesso sem usar RDStationManager para evitar conflitos com shortcode3
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '' });
      setIsSubmitting(false);
      setIsSuccess(true);
      // Fechar popup após sucesso
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de fechar - mais visível */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white text-gray-600 hover:text-gray-800 z-20 rounded-full p-2 shadow-lg border border-gray-300 hover:shadow-xl transition-all"
        >
          <X size={20} />
        </button>

        {/* Conteúdo do popup */}
        <div className="p-3 sm:p-4 pt-10 sm:pt-12">
          {/* Título */}
          <div className="text-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
              Oportunidades <span className="text-[#d68e08]">de</span>
            </h2>
            <h2 className="text-lg sm:text-xl font-bold text-[#d68e08]">
              Leilão de Imóveis
            </h2>
          </div>

          {/* Corpo do popup */}
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center">
            {/* Coluna esquerda - Imagem */}
            <div className="flex justify-center md:flex-1">
              <img
                src="https://d335luupugsy2.cloudfront.net/cms/files/263150/1643135129/$pplwz50ssie"
                alt="Oportunidades de Leilão de Imóveis"
                className="max-w-[150px] sm:max-w-[180px] md:max-w-[250px] w-full h-auto rounded-lg"
              />
            </div>

            {/* Coluna direita - Texto + Formulário */}
            <div className="flex-1 w-full">
              <div className="text-center mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm text-gray-700 mb-1">
                  Imóveis com valor até
                </p>
                <p className="text-xs sm:text-sm font-bold text-gray-800 mb-1">
                  50% abaixo do mercado.
                </p>
                <p className="text-xs sm:text-sm text-gray-700">
                  Confira as oportunidades!
                </p>
              </div>

              {/* Mensagem de sucesso */}
              {isSuccess && (
                <div className="mb-4 p-3 rounded-md text-center text-sm bg-green-100 text-green-800 border border-green-300">
                  ✅ Obrigado! Sua inscrição foi realizada com sucesso!
                </div>
              )}

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="space-y-2.5">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nome *"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#d68e08]"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#d68e08]"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex">
                  <div className="flex items-center justify-center w-10 bg-gray-100 border border-gray-300 rounded-l-md">
                    <img
                      src="https://dk9suync0k2va.cloudfront.net/js/rd/stable/flags/4x3/br.svg"
                      alt="BR"
                      className="w-4 h-3"
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Telefone *"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#d68e08]"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#d68e08] text-white font-bold py-2 px-4 rounded-md hover:bg-[#b8790a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-3"
                >
                  {isSubmitting ? "Enviando..." : "Receber Novidades"}
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityPopup; 