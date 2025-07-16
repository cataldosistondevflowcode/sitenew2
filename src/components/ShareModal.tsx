import React from 'react';
import { Dialog, DialogContent } from './ui/dialog';

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
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullUrl)}`;
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
                  d="M17.472 14.382c-.297-.149-1.759-.868-2.031-.967-.273-.099-.471-.148-.669.149-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.654-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.373-.025-.522-.075-.148-.669-1.61-.916-2.206-.242-.582-.487-.503-.669-.513l-.571-.01c-.198 0-.52.074-.792.373-.272.298-1.041 1.016-1.041 2.48 0 1.463 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.487.709.306 1.262.489 1.694.626.711.227 1.356.195 1.868.118.57-.085 1.759-.718 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347zM11.945 0C5.345 0 .019 5.327.019 11.925c0 2.103.553 4.148 1.605 5.94L0 24l6.279-1.582A11.92 11.92 0 0 0 11.945 24c6.6 0 11.927-5.327 11.927-11.927C23.872 5.327 18.545 0 11.945 0z"
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