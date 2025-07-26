import React, { useEffect } from 'react';
import Header from '../component/Header';
import { Outlet } from 'react-router-dom';
import Footer from '../component/Footer';
import ModalAnnouncement from '../component/modals/ModalAnnouncement';
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min';

function MainLayout() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleAnnouncementModal();
    }, 100); // short delay to ensure modal DOM is mounted

    return () => clearTimeout(timeout); // cleanup on unmount
  }, []);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <ModalAnnouncement />
    </>
  );
}

function handleAnnouncementModal() {
  const announcementModal = document.getElementById('announcement_modal');
  if (announcementModal) {
    const modalInstance = Modal.getOrCreateInstance(announcementModal);
    modalInstance.show();
  }
}

export default MainLayout;
