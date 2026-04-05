import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ContactModalContextType {
  isOpen: boolean;
  openModal: (service?: string) => void;
  closeModal: () => void;
  preselectedService: string;
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState("");

  const openModal = (service: string = "") => {
    setPreselectedService(service);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <ContactModalContext.Provider value={{ isOpen, openModal, closeModal, preselectedService }}>
      {children}
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (context === undefined) {
    throw new Error('useContactModal must be used within a ContactModalProvider');
  }
  return context;
}
