import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import { Building2 } from "lucide-react";

const Employers = () => {
  const [employers, setEmployers] = useState([]);

  useEffect(() => {
    api.get("/employers").then((r) => setEmployers(r.data)).catch(() => setEmployers([]));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-display font-bold mb-1">Employers on AgriYuvaa</h1>
      <p className="text-sm text-brand-grey mb-8">Farms, agri-businesses, and organizations hiring young talent</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {employers.map((emp) => (
          <div key={emp._id} className="card p-5 flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-brand-green-light flex items-center justify-center shrink-0">
              <Building2 size={22} className="text-brand-green-dark" />
            </div>
            <div>
              <h3 className="font-display font-semibold">{emp.companyName}</h3>
              <p className="text-xs text-brand-grey mt-1">{emp.sector || "Agriculture"}</p>
              <p className="text-xs text-brand-grey">{emp.location}</p>
            </div>
          </div>
        ))}
        {employers.length === 0 && (
          <p className="text-sm text-brand-grey">No verified employers yet.</p>
        )}
      </div>
    </div>
  );
};

export default Employers;
