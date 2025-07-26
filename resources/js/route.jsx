import { useAPI } from "./component/contexts/ApiContext";
import React from "react";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./layout/AuthLayout";
import MainLayout from "./layout/MainLayout";
import AdminLayout from "./layout/AdminLayout";
import Login from "./pages/Login";

import Home from "./pages/user/Home";
import Transparency from "./pages/user/Transparency";
import FAQs from "./pages/user/FAQs";
import About from "./pages/user/About";
import Events from "./pages/user/Events";
import News from "./pages/user/News";
import Membership from "./pages/user/Membership";
import MembershipRegistration from "./pages/user/MembershipRegistration";
import ErrorPage from "./pages/ErrorPage";
import NewsDetail from "./pages/user/NewsDetail";
import AnnouncementDetail from "./pages/user/AnnouncementDetail";
import EventDetail from "./pages/user/EventDetail";
import EventRegistration from "./pages/user/EventRegistration";

import Dashboard from "./pages/admin/Dashboard";
import MembershipManagement from "./pages/admin/MembershipManagement";
import NewsManagement from "./pages/admin/NewsManagement";
import AnnouncementsManagement from "./pages/admin/AnnouncementsManagement";
import TransparencyManagement from "./pages/admin/TransparencyManagement";
import Settings from "./pages/admin/Settings";
import EventsManagement from "./pages/admin/EventsManagement";
import EventsParticipantsManagement from "./pages/admin/EventsParticipantsManagement";
import ServicesManagement from "./pages/admin/ServicesManagement";
import ServicesComputerManagement from "./pages/admin/ServicesComputerManagement";
import ServicesPrintingManagement from "./pages/admin/ServicesPrintingManagement";
import NewsCreate from "./pages/admin/NewsCreate";
import NewsDrafts from "./pages/admin/NewsDrafts";
import AnnouncementsCreate from "./pages/admin/AnnouncementsCreate";
import AnnouncementsDrafts from "./pages/admin/AnnouncementsDrafts";
import PrivateRoute from "./pages/PrivateRoute";
import EventsCreate from "./pages/admin/EventsCreate";
import EventsDrafts from "./pages/admin/EventsDrafts";
import ResourceReservationServiceForm from "./component/forms/ResourceReservationServiceForm";
import FacilityReservationServiceForm from "./component/forms/FacilityReservationServiceForm";
import VolunteerManagementServiceForm from "./component/forms/VolunteerManagementServiceForm";
import ResourceLendingServiceForm from "./component/forms/ResourceLendingServiceForm";
import EventRegistrationServiceForm from "./component/forms/EventRegistrationServiceForm";
import NewsEdit from "./pages/admin/NewsEdit";
import AnnouncementsEdit from "./pages/admin/AnnouncementsEdit";
import ServicesLayout from "./layout/ServicesLayout";
import ComputerServices from "./pages/user/ComputerServices";
import PrintingServices from "./pages/user/PrintingServices";
import OtherServices from "./pages/user/OtherServices";
import PrintingServicesReservation from "./pages/user/PrintingServicesReservation";
import EventsEdit from "./pages/admin/EventsEdit";
import ParticipantsTable from "./component/tables/ParticipantsTable";
import ServicesComputerManagementWeeklyReport from "./pages/admin/ServicesComputerManagementWeeklyReport";
import ServicesOtherManagement from "./pages/admin/ServicesOtherManagement";
import ServicesPrintingManagementWeeklyReport from "./pages/admin/ServicesPrintingManagementWeeklyReport";

function route() {
  const { getData } = useAPI();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const serviceRequests = [
      { endpoint: "rrs", path: "/resource-reservation" },
      { endpoint: "frs", path: "/facilities-reservation" },
      { endpoint: "ers", path: "/event-registration" },
      { endpoint: "rls", path: "/resource-lending" },
      { endpoint: "vs", path: "/volunteer" },
    ];

    serviceRequests.forEach(({ endpoint, path }) => {
      getData(
        endpoint,
        (newData) => {
          const updatedServices = newData.map((service) => ({
            ...service,
            path: `${path}/${service.id}`,
          }));

          setServices((prevServices) => {
            const allServices = [...prevServices, ...updatedServices];
            const serviceMap = new Map();
            allServices.forEach((service) => {
              serviceMap.set(service.service_name, service);
            });
            return Array.from(serviceMap.values());
          });
        },
        setLoading,
        setError
      );
    });
  }, [getData]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/announcements/:id" element={<AnnouncementDetail />} />
        <Route path="/membership" element={<Membership />} />
        <Route
          path="/membership/registration"
          element={<MembershipRegistration />}
        />

        <Route element={<ServicesLayout />}>
          {/* {services.map((service, index) => {
            const slug = service.service_name
              .replace(/\s+/g, "-")
              .toLowerCase();

            let userElement = null;

            if (service.id === 1) {
              userElement = <ComputerServices />;
            } else if (service.id === 2) {
              userElement = <PrintingServices />;
            } else {
              userElement = <OtherServices />;
            }

            return (
              <Route
                key={`user-${index}`}
                path={`/services/${slug}`}
                element={userElement}
              />
            );
          })} */}

          <Route path="/services/computer" element={<ComputerServices />} />
          <Route path="/services/printing" element={<PrintingServices />} />
          <Route path="/services/:slug" element={<OtherServices />} />

          <Route
            path="/services/printing/reservation"
            element={<PrintingServicesReservation />}
          />
        </Route>

        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/registration/:id" element={<EventRegistration />} />
        <Route path="/about" element={<About />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/transparency" element={<Transparency />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Private Admin Routes */}
      <Route element={<PrivateRoute element={<AdminLayout />} />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/membership" element={<MembershipManagement />} />
        <Route path="/admin/news" element={<NewsManagement />} />
        <Route path="/admin/news/create" element={<NewsCreate />} />
        <Route path="/admin/news/edit/:id" element={<NewsEdit />} />
        <Route path="/admin/news/drafts" element={<NewsDrafts />} />
        <Route
          path="/admin/announcements"
          element={<AnnouncementsManagement />}
        />
        <Route
          path="/admin/announcements/create"
          element={<AnnouncementsCreate />}
        />
        <Route
          path="/admin/announcements/edit/:id"
          element={<AnnouncementsEdit />}
        />
        <Route
          path="/admin/announcements/drafts"
          element={<AnnouncementsDrafts />}
        />
        <Route
          path="/admin/transparency"
          element={<TransparencyManagement />}
        />
        <Route path="/admin/settings" element={<Settings />} />
        {/* Events Management Routes */}
        <Route path="/admin/events" element={<Navigate to={"manage"} />} />
        <Route path="/admin/events/manage" element={<EventsManagement />} />
        <Route path="/admin/events/edit/:id" element={<EventsEdit />} />
        <Route path="/admin/events/create" element={<EventsCreate />} />
        <Route path="/admin/events/drafts" element={<EventsDrafts />} />
        <Route
          path="/admin/events/participants"
          element={<EventsParticipantsManagement />}
        />
        <Route
          path="/admin/events/participants/:id"
          element={<ParticipantsTable />}
        />
        <Route path="/admin/services" element={<Navigate to={"manage"} />} />
        <Route path="/admin/services/manage" element={<ServicesManagement />} />

        <Route
          path="/admin/services/computer"
          element={<ServicesComputerManagement />}
        />
        <Route
          path="/admin/services/computer/weekly-report"
          element={<ServicesComputerManagementWeeklyReport />}
        />
        <Route
          path="/admin/services/printing"
          element={<ServicesPrintingManagement />}
        />
        <Route
          path="/admin/services/printing/weekly-report"
          element={<ServicesPrintingManagementWeeklyReport />}
        />
        <Route
          path="/admin/services/:slug"
          element={<ServicesOtherManagement />}
        />

        <Route
          path="/admin/services/resource-reservation"
          element={<ResourceReservationServiceForm />}
        />
        <Route
          path="/admin/services/facility-reservation"
          element={<FacilityReservationServiceForm />}
        />
        <Route
          path="/admin/services/event-registration"
          element={<EventRegistrationServiceForm />}
        />
        <Route
          path="/admin/services/resource-lending"
          element={<ResourceLendingServiceForm />}
        />
        <Route
          path="/admin/services/volunteer-management"
          element={<VolunteerManagementServiceForm />}
        />
      </Route>

      {/* Catch-all Route for 404 */}
      <Route path="*" element={<ErrorPage statusCode={404} />} />
    </Routes>
  );
}

export default route;
