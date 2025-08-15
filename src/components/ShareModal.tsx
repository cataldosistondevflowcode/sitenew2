import React from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { WhatsAppIcon } from './icons';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyUrl: string;
  propertyTitle: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  propertyUrl,
  propertyTitle,
}) => {
  const fullUrl = `${window.location.origin}${propertyUrl}`;
  
  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/5521977294848?text=${encodeURIComponent(fullUrl)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Confira este imóvel em leilão: ${propertyTitle}`);
    const body = encodeURIComponent(`Olá!\n\nEncontrei este imóvel em leilão que pode te interessar:\n\n${propertyTitle}\n\nVeja mais detalhes: ${fullUrl}\n\nAbraços!`);
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = emailUrl;
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!p-0 !max-w-none !w-auto border-0 shadow-none bg-transparent">
        <div 
          className="share-modal"
          role="dialog" 
          aria-labelledby="share-title"
          style={{
            width: '310px',
            padding: '1.5rem 1.75rem 2rem',
            background: '#fff',
            borderRadius: '10px',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
            fontFamily: '"Helvetica Neue", Arial, sans-serif'
          }}
        >
          <h2 
            id="share-title"
            style={{
              fontSize: '1.25rem',
              margin: '0 0 1.25rem',
              fontWeight: '600',
              color: '#222'
            }}
          >
            Compartilhe
          </h2>

          <div 
            className="share-icons"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.25rem 1.6rem',
              justifyContent: 'flex-start'
            }}
          >
            {/* WhatsApp */}
            <a 
              href="#" 
              aria-label="Compartilhar no WhatsApp" 
              className="icon"
              onClick={(e) => {
                e.preventDefault();
                handleWhatsAppShare();
              }}
              style={{
                width: '40px',
                height: '40px',
                display: 'grid',
                placeItems: 'center',
                color: '#c69200',
                transition: 'transform 0.15s ease, opacity 0.15s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.15)';
                e.currentTarget.style.opacity = '0.85';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.opacity = '1';
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '100%', height: '100%' }}>
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                  fill="currentColor" 
                />
              </svg>
            </a>

            {/* E‑mail */}
            <a 
              href="#" 
              aria-label="Compartilhar por E-mail" 
              className="icon"
              onClick={(e) => {
                e.preventDefault();
                handleEmailShare();
              }}
              style={{
                width: '40px',
                height: '40px',
                display: 'grid',
                placeItems: 'center',
                color: '#c69200',
                transition: 'transform 0.15s ease, opacity 0.15s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.15)';
                e.currentTarget.style.opacity = '0.85';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.opacity = '1';
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '100%', height: '100%' }}>
                <path
                  d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"
                  fill="currentColor" 
                />
              </svg>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 