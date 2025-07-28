import React, { useState } from 'react';

interface PropertyDetailContactProps {
  onWhatsAppClick?: () => void;
}

export const PropertyDetailContact = ({ onWhatsAppClick }: PropertyDetailContactProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulário enviado:', formData);
    alert('Mensagem enviada com sucesso!');
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <section className="py-12 bg-[#333] text-white bg-opacity-90 bg-blend-multiply" style={{backgroundImage: "url('/assets/images/advogado-imobiliario-rio-de-janeiro-1.jpg')"}}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Podemos ajudar a solucionar o seu caso!</h2>
            <p className="text-xl text-[#d68e08] mb-8">Entre em contato conosco</p>
            
            <div className="flex space-x-4 mt-6">
              <button onClick={onWhatsAppClick} className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 cursor-pointer">
                Whatsapp
              </button>
              <a href="mailto:contato@cataldosiston-adv.com.br" className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600">
                E-mail
              </a>
              <a href="tel:+552131733795" className="bg-[#d68e08] text-white p-3 rounded-full hover:bg-[#b8780a]">
                Telefone
              </a>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block mb-2">Nome*</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nome *" 
                  className="w-full p-3 rounded text-black"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block mb-2">Email*</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email *" 
                  className="w-full p-3 rounded text-black"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block mb-2">Telefone*</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Telefone *" 
                  className="w-full p-3 rounded text-black"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block mb-2">Mensagem</label>
                <textarea 
                  id="message" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Sua mensagem" 
                  className="w-full p-3 rounded text-black"
                  rows={4}
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-[#d68e08] text-white py-3 rounded font-bold hover:bg-[#b8780a] transition-colors"
              >
                ENVIAR
              </button>
            </form>
            
            <p className="text-sm mt-4">
              Prometemos não utilizar suas informações de contato para enviar qualquer tipo de SPAM
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyDetailContact;
