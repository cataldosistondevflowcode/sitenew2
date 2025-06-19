
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

export const CookieBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const accepted = localStorage.getItem('cookiesAccepted');
    if (accepted === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-secondary text-white p-4 flex justify-between items-center z-50 flex-wrap gap-4">
      <p className="flex-1">
        Conforme nossa <a href="#" className="text-primary underline">política de privacidade</a> este site faz uso de cookies.
      </p>
      <Button onClick={handleAccept} className="bg-primary hover:bg-primary/90 text-white">
        Entendido
      </Button>
    </div>
  );
};
