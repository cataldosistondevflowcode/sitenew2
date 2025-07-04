import React, { useState, useEffect } from 'react';
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Criar um form invisível para submit para RD Station
    const form = document.createElement('form');
    form.method = 'post';
    form.action = 'https://cta-redirect.rdstation.com/v2/conversions';
    form.style.display = 'none';

    // Adicionar campos ocultos
    const tokenField = document.createElement('input');
    tokenField.type = 'hidden';
    tokenField.name = 'token_rdstation';
    tokenField.value = 'eb5ee2e30e652ab024e478924164239b';
    form.appendChild(tokenField);

    const identifierField = document.createElement('input');
    identifierField.type = 'hidden';
    identifierField.name = 'conversion_identifier';
    identifierField.value = 'inscricao-na-newsletter';
    form.appendChild(identifierField);

    // Adicionar campos do formulário
    const nameField = document.createElement('input');
    nameField.type = 'hidden';
    nameField.name = 'name';
    nameField.value = formData.name;
    form.appendChild(nameField);

    const emailField = document.createElement('input');
    emailField.type = 'hidden';
    emailField.name = 'email';
    emailField.value = formData.email;
    form.appendChild(emailField);

    const phoneField = document.createElement('input');
    phoneField.type = 'hidden';
    phoneField.name = 'personal_phone';
    phoneField.value = formData.phone;
    form.appendChild(phoneField);

    // Adicionar ao DOM e enviar
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    // Fechar o popup após o envio
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <X size={24} />
        </button>

        {/* Conteúdo do popup */}
        <div className="p-6">
          {/* Título */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Oportunidades <span className="text-[#d68e08]">de</span>
            </h2>
            <h2 className="text-2xl font-bold text-[#d68e08]">
              Leilão de Imóveis
            </h2>
          </div>

          {/* Corpo do popup */}
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Coluna esquerda - Imagem */}
            <div className="flex-1 flex justify-center">
              <img
                src="https://d335luupugsy2.cloudfront.net/cms/files/263150/1643135129/$pplwz50ssie"
                alt="Oportunidades de Leilão de Imóveis"
                className="max-w-[300px] w-full h-auto rounded-lg"
              />
            </div>

            {/* Coluna direita - Texto + Formulário */}
            <div className="flex-1">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-700 mb-1">
                  Imóveis com valor até
                </p>
                <p className="text-sm font-bold text-gray-800 mb-1">
                  50% abaixo do mercado.
                </p>
                <p className="text-sm text-gray-700">
                  Confira as oportunidades!
                </p>
              </div>

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nome *"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#d68e08]"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#d68e08]"
                    required
                  />
                </div>
                <div className="flex">
                  <div className="flex items-center justify-center w-12 bg-gray-100 border border-gray-300 rounded-l-md">
                    <img
                      src="https://dk9suync0k2va.cloudfront.net/js/rd/stable/flags/4x3/br.svg"
                      alt="BR"
                      className="w-6 h-4"
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Telefone *"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#d68e08]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#d68e08] text-white font-bold py-3 px-4 rounded-md hover:bg-[#b8790a] transition-colors"
                >
                  Receber Novidades
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