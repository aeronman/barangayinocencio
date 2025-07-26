import React, { useState, useEffect } from "react";
import Breadcrumb from "../../component/ui/Breadcrumb";
import { useAPI } from "../../component/contexts/ApiContext";
import MembersTable from "../../component/tables/MembersTable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 

function MembershipManagement() {
  const { getData } = useAPI();
  const [membersData, setMembersData] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [filteredMembersData, setFilteredMembersData] = useState([]);

  useEffect(() => {
    getData("members", setMembersData, setLoading, setError);
  }, [getData]);

  useEffect(() => {
    setTotalMembers(filteredMembersData?.length || 0);
  }, [filteredMembersData]);

  const handleDownloadPDF = async () => {
    const doc = new jsPDF();

    const dataToDownload = filteredMembersData?.length > 0 ? filteredMembersData : membersData;

    if (!dataToDownload || dataToDownload.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headerImageUrl = `${window.location.origin}/images/MembersPdfHeader.png`;

    const img = new Image();
    img.src = headerImageUrl;
    img.onload = () => {
      doc.addImage(img, "PNG", 10, 0, 190, 40);

      doc.setFontSize(14);
      doc.text(
        "Alternative Learning System - Early Registration (" + new Date().toISOString().split('T')[0] + ")",
        14,
        50
      );

      doc.setFontSize(12);
      doc.text(`Total Participants: ${dataToDownload.length}`, 14, 60);

      autoTable(doc, {
        head: [["First Name", "Last Name", "Age", "Address", "Contact Number"]],
        body: dataToDownload.map((member) => [
          member.first_name || "-",
          member.last_name || "-",
          member.age ? member.age.toString() : "-",
          member.address || "-",
          member.contact_number || "-",
        ]),
        startY: 70,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save("members.pdf");
    };

    img.onerror = () => {
      console.error("Failed to load header image.");
      alert("Failed to load header image. Cannot generate PDF.");
    };
  };

  return (
    <>
      <Breadcrumb />
      <div className="mb-4">
        <h4 className="fw-bold">Youth Profiling Membership</h4>
        <p className="text-muted">
          An overview of the registered youth members under the Sangguniang Kabataan program.
        </p>
      </div>

      <div className="card shadow rounded-4 mb-5" style={{ width: "300px" }}>
        <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center">
          <h1 className="display-2 fw-bold text-primary">
            {loading ? (
              <div className="spinner-grow text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              totalMembers
            )}
          </h1>
          <p className="text-muted">Registered Members</p>
          <button
            className="btn btn-primary d-flex align-items-center px-4 py-2"
            onClick={handleDownloadPDF}
          >
            <i className="bi bi-download me-2"></i> Download as PDF
          </button>
        </div>
      </div>

      <MembersTable hasActions={true} setFilteredMembersData={setFilteredMembersData} />
    </>
  );
}

export default MembershipManagement;
