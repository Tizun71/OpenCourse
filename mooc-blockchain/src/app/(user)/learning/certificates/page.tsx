"use client";

import LearningHero from "@/app/components/user/LearningHero";
import CertificatesGallery from "./components/certificateGallery";

const CertificatePage = () => {
  return (
    <div>
      <LearningHero />
      <div className="p-4">
        <CertificatesGallery />
      </div>
    </div>
  );
};

export default CertificatePage;
