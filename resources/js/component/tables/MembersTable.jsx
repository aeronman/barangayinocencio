import React, { useEffect, useState, useMemo } from "react";
import { useAPI } from "../contexts/ApiContext";
import TableComponent from "./TableComponent";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import ModalMemberPreview from "../modals/ModalMemberPreview";

function MembersTable({ hasActions, setFilteredMembersData }) {
  const { getData } = useAPI();
  const [membersData, setMembersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedArea, setSelectedArea] = useState("");

  useEffect(() => {
    getData("members", setMembersData, setLoading, setError);
  }, [getData]);

  const filteredMembers = useMemo(() => {
    if (!selectedArea) return membersData;
    return membersData.filter((member) => member.area === selectedArea);
  }, [membersData, selectedArea]);

  useEffect(() => {
    if (setFilteredMembersData) {
      setFilteredMembersData(filteredMembers);
    }
  }, [filteredMembers, setFilteredMembersData]);

  const membersColumns = [
    { header: "#", cell: ({ row }) => row.index + 1 },
    { header: "First Name", accessorKey: "first_name" },
    { header: "Last Name", accessorKey: "last_name" },
    { header: "Age", accessorKey: "age" },
    { header: "Sex", accessorKey: "sex" },
    { header: "Area", accessorKey: "area" },
    { header: "Email", accessorKey: "masked_email" },
    { header: "Contact Number", accessorKey: "contact_number" },
  ];

  const actions = (id) => [
    {
      label: "View",
      onClick: () => {
        const member = membersData.find((item) => item.id === id);
        setSelectedMember(member);

        setTimeout(() => {
          const modalElement = document.getElementById("memberPreviewModal");
          if (modalElement) {
            const modal = new Modal(modalElement);
            modal.show();
          }
        }, 0);
      },
      className: "btn btn-sm text-light btn-info text-nowrap",
      icon: "bi bi-eye",
    },
  ];

  return (
    <>
      <TableComponent
        topComponent={
          <div className="input-group mb-3" style={{ width: "300px" }}>
            <label
              className="input-group-text bg-primary text-light"
              htmlFor="inputGroupSelectArea"
            >
              Area
            </label>
            <select
              className="form-select"
              id="inputGroupSelectArea"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              <option value="">All Areas</option>
              <option value="Inocencio Proper">Inocencio Proper</option>
              <option value="Tradition Homes Phase 1 and 2">
                Tradition Homes Phase 1 and 2
              </option>
              <option value="Sampaguita Village">Sampaguita Village</option>
              <option value="Regina Ville 2000">Regina Ville 2000</option>
              <option value="BRIA Homes">BRIA Homes</option>
              <option value="South Ville Phase 1A and B">
                South Ville Phase 1A and B
              </option>
            </select>
          </div>
        }
        title="KK Members"
        columns={membersColumns}
        data={filteredMembers}
        loading={loading}
        actions={hasActions ? actions : null}
      />

      <ModalMemberPreview member={selectedMember} id="memberPreviewModal" />
    </>
  );
}

export default MembersTable;
