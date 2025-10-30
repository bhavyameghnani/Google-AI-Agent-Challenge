"use client";


import React, { useState } from 'react';
import { CompanyEditor } from './components/CompanyEditor';
import CompanyList from './components/CompanyList';

function VerificationApp() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
  };

  const handleBack = () => {
    setSelectedCompany(null);
  };

  const handleSave = (updatedCompany) => {
    setCompanies((prev) =>
      prev.map((c) => (c.company_name === updatedCompany.company_name ? updatedCompany : c))
    );
    setSelectedCompany(null);
  };

  // If a company is selected, show the editor
  if (selectedCompany) {
    return <CompanyEditor company={selectedCompany} onBack={handleBack} onSave={handleSave} />;
  }

  // Otherwise, show the list
  return <CompanyList onCompanyClick={handleSelectCompany} />;
}

export default VerificationApp;