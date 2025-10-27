import { Button } from "@mui/material";
import { Input, Radio, UploadProps, Modal, Checkbox } from "antd";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { CiCalendarDate } from "react-icons/ci";
import { IoPersonCircleOutline } from "react-icons/io5";
import { message, Upload } from "antd";
import { useState } from "react";

const { Dragger } = Upload;

const props: UploadProps = {
  name: "file",
  multiple: true,
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  onChange(info: any) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const Jobinfo = ({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) => {
  const [inputListradio, setInputListradio] = useState<
    { id: string; value: string }[]
  >([]);
  const [visible, setVisible] = useState(false);
  const [visibledoc, setVisibledoc] = useState(false);
  const [inputList, setInputList] = useState<string[]>([]);
  const [inputListdoc, setInputListdoc] = useState<string[]>([]);
  // const [inputListradio, setInputListradio] = useState<string[]>([]);
  const [inputListCheckbox, setInputListCheckbox] = useState<string[]>([]);
  const [newInputdoc, setNewInputdoc] = useState("");
  const [newInput, setNewInput] = useState("");
  const [newInputradio, setNewInputradio] = useState("");
  const [visibleradio, setVisibleradio] = useState(false);
  const [radioOptions, setRadioOptions] = useState<string[]>([
    "Work from office",
    "Work from home",
  ]);
  
  const [newRadio, setNewRadio] = useState("");
  const [visibleCheckbox, setVisibleCheckbox] = useState(false);
  const [checkboxOptions, setCheckboxOptions] = useState<string[]>([
    "Option 1",
    "Option 2",
  ]);
  const [newCheckbox, setNewCheckbox] = useState("");
  const [newInputCheckbox, setNewInputCheckbox] = useState("");

  const showModalRadio = () => {
    setVisibleradio(true);
  };

  const showModalCheckbox = () => {
    setVisibleCheckbox(true);
  };

  const handleCancelCheckbox = () => {
    setVisibleCheckbox(false); 
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCheckbox(e.target.value); 
  };

  const handleNewInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewInputCheckbox(e.target.value);
  };

  const addCheckboxOption = () => {
    if (newCheckbox.trim() !== "" && !checkboxOptions.includes(newCheckbox)) {
      setCheckboxOptions([...checkboxOptions, newCheckbox]); 
    }
    setNewCheckbox(""); 
  };

  const handleOkRadio = () => {
    if (
      newInputradio.trim() !== "" &&
      !inputListradio.some((item) => item.value === newInputradio)
    ) {
      const newId = Date.now().toString(); // or use a UUID here
      setInputListradio([
        ...inputListradio,
        { id: newId, value: newInputradio },
      ]); 
    }
    setNewInputradio(""); 
    setVisibleradio(false); 
  };

  const handleOkCheckbox = () => {
    if (
      newInputCheckbox.trim() !== "" &&
      !inputListCheckbox.includes(newInputCheckbox)
    ) {
      setInputListCheckbox([...inputListCheckbox, newInputCheckbox]); 
    }
    setNewInputCheckbox(""); 
    setVisibleCheckbox(false); 
  };

  const handleCancelRadio = () => {
    setVisibleradio(false);
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRadio(e.target.value);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setInputList([...inputList, newInput]);
    setNewInput("");
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewInput(e.target.value);
  };
  const handleChangeradlab = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewInputradio(e.target.value);
  };
  const showModaldoc = () => {
    setVisibledoc(true);
  };

  const handleOkdoc = () => {
    setInputListdoc([...inputListdoc, newInputdoc]);
    setNewInputdoc("");
    setVisibledoc(false);
  };

  const handleCanceldoc = () => {
    setVisibledoc(false);
  };
  const addRadioModal = () => {
    if (newRadio.trim() !== "" && !radioOptions.includes(newRadio)) {
      setRadioOptions([...radioOptions, newRadio]); // Update the list of radio options
    }
 
    setNewRadio(""); // Clear the input field
    setVisibleradio(true); // Open the modal
  };
  const handleChangedoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewInputdoc(e.target.value);
  };

  return (
    <>
      <div>
        <div>
          <h6 className="mb-0">Job Info</h6>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div>
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Resume
              </label>
              <div style={{ width: "400px" }}>
                <Dragger {...props}>
                  <p className="ant-upload-drag-icon mb-0">
                    <AiOutlineCloudUpload style={{ fontSize: "25px" }} />
                  </p>
                  <p className="ant-upload-text">
                    Upload at maximum size of 10 MB{" "}
                  </p>
                </Dragger>
              </div>
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Department
              </label>
              <br />
              <Input className="inp-org" />
              <br />
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Position
              </label>
              <br />
              <Input className="inp-org" />
              <br />

              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Payment type
              </label>
              <br />
              <Radio.Group>
                <Radio value={"Monthly"}>Monthly</Radio>
                <Radio value={"Annually"}>Annually</Radio>
              </Radio.Group>
              <br />
              <Input className="inp-org" />
              <br />
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Work mode
              </label>
              <br />
              <Radio.Group>
                <Radio value={"Work from office"}>Work from office</Radio>
                <Radio value={"Work from home"}>Work from home</Radio>
              </Radio.Group>
              <br />
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Branch
              </label>
              <br />
              <Input className="inp-org" />
              <br />
            </div>
          </div>
          <div className="col-lg-6">
            <div>
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Job Category{" "}
              </label>
              <br />
              <Input className="inp-org" />
              <br />
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Previous salary
              </label>
              <br />
              <Input className="inp-org" />
              <br />
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Overtime(Per hour)
              </label>
              <br />
              <Input className="inp-org" />
              <br />
              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Attendance Location
              </label>
              <br />
              <Input className="inp-org" />
              <br />

              <label
                className="py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Date of joining
              </label>
              <br />
              <Input className="inp-org" />
              <br />
              {inputListradio.map((input, index) => (
                <div key={index}>
                  <label
                    className="py-2"
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#666666",
                    }}
                  >
                    {input.value}
                  </label>
                  <br />
                  <Radio.Group name={`radio-group-${index}`} key={index}>
                    {radioOptions.map((option, optionIndex) => (
                      <Radio
                        key={optionIndex}
                        value={option}
                        id={`radio-${index}-${optionIndex}`}
                      >
                        {option}
                      </Radio>
                    ))}
                    <div style={{ marginTop: "10px" }}></div>
                  </Radio.Group>
                  <br />
                </div>
              ))}

              <div>
                {inputListCheckbox.map((input, index) => (
                  <div key={index}>
                    <label
                      className="py-2"
                      style={{
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#666666",
                      }}
                    >
                      {input}
                    </label>
                    <br />
                    <Checkbox.Group>
                      {checkboxOptions.map((option, index) => (
                        <Checkbox key={index} value={option}>
                          {option}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>

                    <br />
                  </div>
                ))}
              </div>
              <div>
                {inputListdoc.map((input, index) => (
                  <div key={index}>
                    <label
                      className="py-2"
                      style={{
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#666666",
                      }}
                    >
                      {input}
                    </label>
                    <br />

                    <div style={{ width: "400px" }}>
                      <Dragger {...props}>
                        <p className="ant-upload-drag-icon mb-0">
                          <AiOutlineCloudUpload style={{ fontSize: "25px" }} />
                        </p>
                        <p className="ant-upload-text">
                          Upload at maximum size of 10 MB{" "}
                        </p>
                      </Dragger>
                    </div>
                    <br />
                  </div>
                ))}
              </div>
              <div>
                {inputList.map((input, index) => (
                  <div key={index}>
                    <label
                      className="py-5"
                      style={{
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#666666",
                      }}
                    >
                      {input}
                    </label>
                    <br />

                    <Input className="inp-org" />
                    <br />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="add-div d-flex">
          <div>
            <div>
              <label
                className="pt-5"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Add Input{" "}
              </label>
            </div>
            <div className="add-inp" onClick={showModal}>
              <i className="fi fi-ss-add me-2"></i>
            </div>
          </div>
          <div>
            <div>
              <label
                className="pt-5"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Add Document
              </label>
            </div>
            <div className="add-doc" onClick={showModaldoc}>
              <AiOutlineCloudUpload style={{ fontSize: "25px" }} />
            </div>
          </div>
          <div>
            <div>
              <label
                className="pt-5"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                CheckBox
              </label>
            </div>
            <div className="add-checkbox" onClick={showModalCheckbox}>
              <i className="fi fi-ss-add me-2"></i>
            </div>
          </div>
          <div>
            <div>
              <label
                className="pt-5"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                Add Radio Button
              </label>
            </div>
            <div className="add-radio" onClick={showModalRadio}>
              <i className="fi fi-ss-add me-2"></i>
            </div>
          </div>
        </div>
        <div className="py-3 d-flex justify-content-between align-items-center">
                         <a
                           className="skipbtn
                             "
                             onClick={onPrev}
                         >
                           Cancel
                         </a>
                         <div className="d-flex" >
                           <p onClick={onPrev} className="skipbtn-pre">Previous</p>
                         
                        
                         <Button variant="contained" className="nextBtn" onClick={onNext}>
                           Next
                         </Button>
                         </div>
                       </div>
        <Modal
          title="Add Document Field"
          visible={visibledoc}
          onOk={handleOkdoc}
          onCancel={handleCanceldoc}
          okText="Add"
        >
          <Input
            placeholder="Enter Name"
            value={newInputdoc}
            onChange={handleChangedoc}
          />
        </Modal>
        <Modal
          title="Add Input Field"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Add"
        >
          <Input
            placeholder="Enter value"
            value={newInput}
            onChange={handleChange}
          />
        </Modal>
        <Modal
          title="Add Radio Button"
          visible={visibleradio}
          onOk={handleOkRadio}
          onCancel={handleCancelRadio}
          okText="Add"
        >
          {" "}
          <Input
            placeholder="Enter value"
            value={newInputradio}
            onChange={handleChangeradlab}
          />
          <Radio.Group>
            {radioOptions.map((option, index) => (
              <Radio key={index} value={option}>
                {option}
              </Radio>
            ))}
            <div style={{ marginTop: "10px" }}>
              <Input
                type="text"
                placeholder="Add new option"
                value={newRadio}
                onChange={handleRadioChange}
                style={{ width: "100%" }}
              />
              <Button
                onClick={addRadioModal}
                style={{
                  marginTop: "10px",
                  padding: "5px 10px",
                  border: "none",
                  backgroundColor: "#1890ff",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Add Option
              </Button>
            </div>
          </Radio.Group>
        </Modal>
        <Modal
          title="Add Checkbox Options"
          visible={visibleCheckbox}
          onOk={handleOkCheckbox}
          onCancel={handleCancelCheckbox}
        >
          <Input
            placeholder="Enter additional value"
            value={newInputCheckbox}
            onChange={handleNewInputChange}
            style={{ marginBottom: "10px" }}
          />

          <Checkbox.Group>
            {checkboxOptions.map((option, index) => (
              <Checkbox key={index} value={option}>
                {option}
              </Checkbox>
            ))}
          </Checkbox.Group>

          <div style={{ marginTop: "10px" }}>
            <Input
              type="text"
              placeholder="Add new option"
              value={newCheckbox}
              onChange={handleCheckboxChange}
              style={{ width: "100%" }}
            />
            <Button
              onClick={addCheckboxOption}
              style={{
                marginTop: "10px",
                padding: "5px 10px",
                border: "none",
                backgroundColor: "#1890ff",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <i className="fi fi-ss-add me-2"></i>
              Add Option
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Jobinfo;
