import { useParams } from "react-router-dom";
import EmployerProfileSubpage from "./EmployerProfileSubpage";

const EmployerPublicProfilePage = () => {
  const { employerId } = useParams();

  return (
    <div className="min-h-screen bg-[#F4F4F4] font-sans text-[#202020]">
      <EmployerProfileSubpage employerId={employerId} />
    </div>
  );
};

export default EmployerPublicProfilePage;
