import { Button, Switch } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { message, Select } from "antd";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { City, ICity, IState, State } from "country-state-city";
import { API_URL } from "../../config";

const label = { inputProps: { "aria-label": "Switch demo" } };

const AddCustomer = () => {
  const [data, setData] = useState({
    companyDetail: {
      companyName: "",
      companyNumber: "",
      companyEmailId: "",
      gstNumber: "",
    },
    billingAddress: {
      organizationAddress: "",
      city: "",
      state: "",
      pincode: 0,
      sameAddressToggle: false,
    },
    contactPersonDetail: {
      ContactName: "",
      phoneNumber: "",
      emialId: "",
    },
  });

  const navigate = useNavigate();

  const handlecustomerSave = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      if (!token) {
        message.error("Please login!");
        return;
      }
      const res = await axios.post(`${API_URL}/api/customer`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Customer Added successfully!");
      navigate("/sales/customer");
      setData({
        companyDetail: {
          companyName: "",
          companyNumber: "",
          companyEmailId: "",
          gstNumber: "",
        },
        billingAddress: {
          organizationAddress: "",
          city: "",
          state: "",
          pincode: 0,
          sameAddressToggle: false,
        },
        contactPersonDetail: {
          ContactName: "",
          phoneNumber: "",
          emialId: "",
        },
      });
    } catch (error: any) {
      console.log(error);
      message.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  useEffect(() => {
    // Fetch all states of India
    const indianStates = State.getStatesOfCountry("IN");
    setStates(indianStates);
  }, []);

  const handleStateChange = (stateCode: string) => {
    const selected = states.find((state) => state.isoCode === stateCode);

    setData({
      ...data,
      billingAddress: {
        ...data.billingAddress,
        state: selected?.name ? selected?.name : "",
      },
    });
    const cities = City.getCitiesOfState("IN", stateCode);
    setCities(cities);
    setSelectedCity(null);
  };

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    setData({
      ...data,
      billingAddress: {
        ...data.billingAddress,
        city: cityName,
      },
    });
  };

  return (
    <>
      <section>
        <div>
          <h6 className="mb-0 py-2">
            <Link
              to="/sales/customer"
              style={{ textDecoration: "none", color: "#000" }}
            >
              <IoIosArrowBack className="mb-1" />
              Add Customer
            </Link>
          </h6>
          <hr className="m-0" />
        </div>
        <div>
          <div className="row mx-0 py-2">
            <div className="col-lg-6">
              <div>
                <h6>Company Detail</h6>
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Company Name
                </label>
                <span style={{ color: "red" }}>*</span>
                <br />
                <input
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "10px",
                    border: "1px solid black",
                  }}
                  value={data.companyDetail.companyName}
                  onChange={(e) =>
                    setData({
                      ...data,
                      companyDetail: {
                        ...data.companyDetail,
                        companyName: e.target.value,
                      },
                    })
                  }
                />
                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Company Number <span style={{ color: "red" }}>*</span>{" "}
                </label>
                <br />
                <PhoneInput
                  international
                  defaultCountry="IN"
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "10px",
                    border: "1px solid black",
                  }}
                  value={data.companyDetail.companyNumber}
                  onChange={(value) =>
                    setData({
                      ...data,
                      companyDetail: {
                        ...data.companyDetail,
                        companyNumber: String(value),
                      },
                    })
                  }
                />

                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Company Email Id <span style={{ color: "red" }}>*</span>
                </label>
                <br />
                <input
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "10px",
                    border: "1px solid black",
                  }}
                  value={data.companyDetail.companyEmailId}
                  onChange={(e) =>
                    setData({
                      ...data,
                      companyDetail: {
                        ...data.companyDetail,
                        companyEmailId: e.target.value,
                      },
                    })
                  }
                />
                {!/\S+@\S+\.\S+/.test(data.companyDetail.companyEmailId) &&
                  data.companyDetail.companyEmailId.length > 0 && (
                    <span style={{ color: "red" }}>Invalid email format</span>
                  )}
                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  GST Number
                </label>
                <span style={{ color: "red" }}>*</span>
                <br />
                <input
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "10px",
                    border: "1px solid black",
                  }}
                  value={data.companyDetail.gstNumber}
                  onChange={(e) =>
                    setData({
                      ...data,
                      companyDetail: {
                        ...data.companyDetail,
                        gstNumber: e.target.value,
                      },
                    })
                  }
                />
                <br />
              </div>
            </div>
            <div className="col-lg-6">
              <div>
                <h6>Contact Person Detail</h6>
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Name
                </label>
                <span style={{ color: "red" }}>*</span>
                <br />
                <input
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "10px",
                    border: "1px solid black",
                  }}
                  value={data.contactPersonDetail.ContactName}
                  onChange={(e) =>
                    setData({
                      ...data,
                      contactPersonDetail: {
                        ...data.contactPersonDetail,
                        ContactName: e.target.value,
                      },
                    })
                  }
                />
                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Phone Number <span style={{ color: "red" }}>*</span>
                </label>

                <br />
                <PhoneInput
                  international
                  defaultCountry="IN"
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "10px",
                    border: "1px solid black",
                  }}
                  value={data.contactPersonDetail.phoneNumber}
                  onChange={(value) =>
                    setData({
                      ...data,
                      contactPersonDetail: {
                        ...data.contactPersonDetail,
                        phoneNumber: String(value),
                      },
                    })
                  }
                />

                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Email Id <span style={{ color: "red" }}>*</span>
                </label>

                <br />
                <input
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "10px",
                    border: "1px solid black",
                  }}
                  value={data.contactPersonDetail.emialId}
                  onChange={(e) =>
                    setData({
                      ...data,
                      contactPersonDetail: {
                        ...data.contactPersonDetail,
                        emialId: e.target.value,
                      },
                    })
                  }
                />
                {!/\S+@\S+\.\S+/.test(data.contactPersonDetail.emialId) &&
                  data.contactPersonDetail.emialId.length > 0 && (
                    <span style={{ color: "red" }}>Invalid email format</span>
                  )}
                <br />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="row mx-0 py-2">
            <div className="col-lg-6">
              <div>
                <h6>Billing Address</h6>
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Organization Address <span style={{ color: "red" }}>*</span>
                </label>
                
                <br />
                <input
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "10px",
                    border: "1px solid black",
                  }}
                  value={data.billingAddress.organizationAddress}
                  onChange={(e) =>
                    setData({
                      ...data,
                      billingAddress: {
                        ...data.billingAddress,
                        organizationAddress: e.target.value,
                      },
                    })
                  }
                />
                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  City <span style={{ color: "red" }}>*</span>
                </label>

                <br />

                <Select
                  showSearch
                  style={{
                    width: "100%",
                    height: 40,
                    border: "1px solid #000",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                  value={selectedCity || undefined}
                  onChange={handleCityChange}
                  disabled={!cities.length}
                  options={cities.map((city) => ({
                    value: city.name,
                    label: city.name,
                  }))}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />

                <br />
                <div className="pt-3">
                  <span>
                    Shipping address as same as billing address{" "}
                    
                  </span>
                  <Switch
                    {...label}
                    onChange={(e) =>
                      setData({
                        ...data,
                        billingAddress: {
                          ...data.billingAddress,
                          sameAddressToggle: e.target.checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div>
                <h6 style={{ visibility: "hidden" }}>Contact Person Detail</h6>
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  State
                </label>
                <span style={{ color: "red" }}>*</span>
                <br />

                <Select
                  showSearch
                  style={{
                    width: "100%",
                    height: 40,
                    border: "1px solid #000",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                  placeholder="Select a state"
                  onChange={handleStateChange}
                  options={states.map((state) => ({
                    value: state.isoCode,
                    label: state.name,
                  }))}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />

                <br />
                <label
                  className="py-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#666666",
                  }}
                >
                  Pin code
                </label>
                <span style={{ color: "red" }}>*</span>
                <br />
                <input
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "10px",
                    border: "1px solid black",
                  }}
                  value={data.billingAddress.pincode}
                  onChange={(e) =>
                    setData({
                      ...data,
                      billingAddress: {
                        ...data.billingAddress,
                        pincode: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mx-3 py-4">
            <Link to="/sales/customer" style={{ color: "black" }}>
              Cancel
            </Link>
            <Button
              variant="contained"
              className="nextBtn"
              onClick={handlecustomerSave}
            >
              Save
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddCustomer;
