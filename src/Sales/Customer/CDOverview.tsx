import message from "antd/es/message";
import { API_URL } from "../../config";
import axios from "axios";
import { useEffect, useState } from "react";

interface CDOverviewProps {
  id?: string;
}

const CDOverview: React.FC<CDOverviewProps> = ({ id }) => {

  const [customerData, setCustomerData] = useState<any>(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      if (!token) {
        message.error("Please login!");
        return;
      }
      const res = await axios.get(`${API_URL}/api/customer/getById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomerData(res.data.data.customer);
    } catch (error: any) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData()
  }, []);
  return (
    <>
      <div>
        <div className="mb-5">
          <p className="p-14 my-3" style={{ color: "#353535" }}>
            Billing address{" "}
          </p>
          <p style={{ maxWidth: "20%" }} className="p-400">
            {customerData?.billingAddress.organizationAddress}
            <br />
             {customerData?.billingAddress.city}
             <br />
            {customerData?.billingAddress.state} - {customerData?.billingAddress.pincode}
          </p>
        </div>
        <div>
          <p className="p-14 my-3" style={{ color: "#353535" }}>
            Company Detail
          </p>
          <p style={{ maxWidth: "30%" }} className="p-400">
            Company Name : {customerData?.companyDetail.companyName}
          </p>
          <p style={{ maxWidth: "30%" }} className="p-400">
            Company Number : {customerData?.companyDetail.companyNumber}
          </p>
          <p style={{ maxWidth: "30%" }} className="p-400">
            Company Email id : {customerData?.companyDetail.companyEmailId}
          </p>
          <p style={{ maxWidth: "30%" }} className="p-400">
            GST No : {customerData?.companyDetail.gstNumber}
          </p>
        </div>
        <div>
          <p className="p-14 my-3" style={{ color: "#353535" }}>
            Contact Person Detail
          </p>
          <p style={{ maxWidth: "30%" }} className="p-400">
            Name :  {customerData?.contactPersonDetail.ContactName}
          </p>
          <p style={{ maxWidth: "30%" }} className="p-400">
            Phone Number : {customerData?.contactPersonDetail.phoneNumber}
          </p>
          <p style={{ maxWidth: "30%" }} className="p-400">
            Email id :  {customerData?.contactPersonDetail.emialId}
          </p>
        </div>
      </div>
    </>
  );
};

export default CDOverview;
