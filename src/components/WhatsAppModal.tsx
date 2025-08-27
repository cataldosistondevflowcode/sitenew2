import React from 'react';
import WhatsAppScheduleModal from './WhatsAppScheduleModal';



interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl?: string;
}

const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ isOpen, onClose, currentUrl }) => {
  return (
    <WhatsAppScheduleModal 
      isOpen={isOpen} 
      onClose={onClose} 
      currentUrl={currentUrl}
    />
  );
};

export default WhatsAppModal; 