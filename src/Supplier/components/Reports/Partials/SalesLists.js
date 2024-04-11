import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";
import useAuthInterceptor from "../../../../utils/apis";
import Loader from "../../UI/Loader";
import { hasPermission } from "../../../../CommonComponents/commonMethods";
import { REPORTS_VIEW, REPORTS_EDIT } from "../../../../Constants/constant";
import Card from "react-bootstrap/Card";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReportsTable from "../../../../CommonComponents/UI/ReportsTable";
// define needed URLs here
const postFormDataUrl = "/supplier/PostSuperSalesReports";
const getFormDataUrl = "/supplier/getSuperSalesReports";

const getFormDataSuppliername = "/supplier/reportSuppliername";
const getFormDataproductType = "/supplier/reportFormdataProducttype";
const getFormDataproductFormat = "/supplier/reportFormdataProductformat";
const getFormDataSupplierUrl = "/supplier/reportFormdataSuppliersList";
const getFormDataRetailerUrl = "/supplier/reportFormdataRetailer";
const getFormDataRetailersList = "/supplier/reportFormdataRetailersList";
const getFormDataDistributorList = "/supplier/reportFormdataDistributorList";
const getFormDataUsersList = "/supplier/reportFormdataUsersList";

const SalesLists = ({ img, token }) => {
  // config for api call
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      permission: "reports-view",
    },
  };

  const apis = useAuthInterceptor();

  // modal, formData, loading states
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    by_user: "",
    supplier: "",
    retailer: "",
    from_date: "",
    product_type: "",
    product_format: "",
    to_date: "",
    language: "",
    file_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [getTableDataLoading, setGetTableDataLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const [DistributorData, setDistributorData] = useState([]);
  const [Suppliername, setSupplierData] = useState([]);
  const [SupplierData, setSuppliersData] = useState([]);
  const [RetailerData, setRetailerData] = useState([]);
  const [ProductTypeData, setProductTypeData] = useState([]); // testing values for table
  const [ProductFormatData, setProductFormatData] = useState([]);
  const [UserFormatData, setUserFormatData] = useState([]);

  // testing values for table
  // {
  //   created_at: "123",
  //   file_path: "www.google.com",
  //   file_type: "pdf",
  // },

  // handle change : sets formData
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // from submit
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    // form valid ?
    if (form.checkValidity() === true) {
      setLoading(true);

      // add permissions based on URL
      config.headers.permission = "reports-view";

      //console.log("form submit", { formData }, { config });
      console.log("form submit", { formData });
      apis
        .post(postFormDataUrl, formData, config)
        //  .post(postFormDataUrl, formData)
        .then((res) => {
          console.log("response", { res });

          if (res.status === 200) {
            toast.success("Profile Information saved!", {
              autoClose: 1000,
              position: toast.POSITION.TOP_CENTER,
            });
            setLoading(false);

            fetchFormData();
          } else {
            toast.error(res.data.message, {
              autoClose: 3000,
              position: toast.POSITION.TOP_CENTER,
            });
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log({ error });

          if (error) {
            toast.error("Something went wrong. Please try again later.", {
              autoClose: 3000,
              position: toast.POSITION.TOP_CENTER,
            });
          }
          setLoading(false);
        });
    }
    setValidated(true);
  };

  // fetch saved form data from db
  const fetchFormData = () => {
    // add permissions based on URL
    config.headers.permission = "reports-view";
    setGetTableDataLoading(true);
    apis
      .get(getFormDataUrl, config)
      //.get(getFormDataUrl)
      .then((res) => {
        if (res.status === 200) {
          console.log("response table data", { res });

          setTableData(res.data.data);
          setGetTableDataLoading(false);
        }
      })
      .catch((error) => {
        console.log({ error });
        setGetTableDataLoading(false);
        if (error) {
          console.log({ error });
        }
      });
    setGetTableDataLoading(false);
  };

  useEffect(() => {
    fetchFormData();
  }, []);

  // fetch saved form city data from db
  const fetchFormSuppliersData = () => {
    // add permissions based on URL
    config.headers.permission = "reports-view";
    setGetTableDataLoading(true);
    apis
      .get(getFormDataSupplierUrl, config)
      //.get(getFormDataUrl)
      .then((res) => {
        if (res.status === 200) {
          console.log("response Suppliers data", { res });
          setSuppliersData(res.data.data);
          setGetTableDataLoading(false);
        }
      })
      .catch((error) => {
        console.log({ error });
        setGetTableDataLoading(false);
        if (error) {
          console.log({ error });
        }
      });
    setGetTableDataLoading(false);
  };

  useEffect(() => {
    fetchFormSuppliersData();
  }, []);

  // fetch saved form city data from db
  const fetchFormDistributorData = () => {
    // add permissions based on URL
    config.headers.permission = "reports-view";
    setGetTableDataLoading(true);
    apis
      .get(getFormDataDistributorList, config)
      //.get(getFormDataUrl)
      .then((res) => {
        if (res.status === 200) {
          console.log("response Distributor data", { res });
          setDistributorData(res.data.data);
          setGetTableDataLoading(false);
        }
      })
      .catch((error) => {
        console.log({ error });
        setGetTableDataLoading(false);
        if (error) {
          console.log({ error });
        }
      });
    setGetTableDataLoading(false);
  };

  useEffect(() => {
    fetchFormDistributorData();
  }, []);

  // fetch saved form city data from db
  const fetchFormRetailersData = () => {
    // add permissions based on URL
    config.headers.permission = "reports-view";
    setGetTableDataLoading(true);
    apis
      .get(getFormDataRetailersList, config)
      //.get(getFormDataUrl)
      .then((res) => {
        if (res.status === 200) {
          console.log("response Retailers data", { res });
          setRetailerData(res.data.data);
          setGetTableDataLoading(false);
        }
      })
      .catch((error) => {
        console.log({ error });
        setGetTableDataLoading(false);
        if (error) {
          console.log({ error });
        }
      });
    setGetTableDataLoading(false);
  };

  useEffect(() => {
    fetchFormRetailersData();
  }, []);
  // fetch saved form city data from db
  const fetchFormSupplierData = () => {
    // add permissions based on URL
    config.headers.permission = "reports-view";
    setGetTableDataLoading(true);
    apis
      .get(getFormDataSuppliername, config)
      //.get(getFormDataUrl)
      .then((res) => {
        if (res.status === 200) {
          console.log("response Distributor data", { res });
          setSupplierData(res.data.data);
          setGetTableDataLoading(false);
        }
      })
      .catch((error) => {
        console.log({ error });
        setGetTableDataLoading(false);
        if (error) {
          console.log({ error });
        }
      });
    setGetTableDataLoading(false);
  };

  useEffect(() => {
    fetchFormSupplierData();
  }, []);

  // fetch saved form Product type data from db
  const fetchProductTypeData = () => {
    // add permissions based on URL
    config.headers.permission = "reports-view";
    setGetTableDataLoading(true);
    apis
      .get(getFormDataproductType, config)
      //.get(getFormDataUrl)
      .then((res) => {
        if (res.status === 200) {
          console.log("response Product type data", { res });
          setProductTypeData(res.data.data);
          setGetTableDataLoading(false);
        }
      })
      .catch((error) => {
        console.log({ error });
        setGetTableDataLoading(false);
        if (error) {
          console.log({ error });
        }
      });
    setGetTableDataLoading(false);
  };

  useEffect(() => {
    fetchProductTypeData();
  }, []);

  // fetch saved form Product Style data from db
  const fetchProductFormatData = () => {
    // add permissions based on URL
    config.headers.permission = "reports-view";
    setGetTableDataLoading(true);
    apis
      .get(getFormDataproductFormat, config)
      //.get(getFormDataUrl)
      .then((res) => {
        if (res.status === 200) {
          console.log("response Product format data", { res });
          setProductFormatData(res.data.data);
          setGetTableDataLoading(false);
        }
      })
      .catch((error) => {
        console.log({ error });
        setGetTableDataLoading(false);
        if (error) {
          console.log({ error });
        }
      });
    setGetTableDataLoading(false);
  };

  useEffect(() => {
    fetchProductFormatData();
  }, []);
  // fetch saved form Users data from db
  const fetchUserFormatData = () => {
    // add permissions based on URL
    config.headers.permission = "reports-view";
    setGetTableDataLoading(true);
    apis
      .get(getFormDataUsersList, config)
      //.get(getFormDataUrl)
      .then((res) => {
        if (res.status === 200) {
          console.log("response Warehouse data", { res });
          setUserFormatData(res.data.data);
          setGetTableDataLoading(false);
        }
      })
      .catch((error) => {
        console.log({ error });
        setGetTableDataLoading(false);
        if (error) {
          console.log({ error });
        }
      });
    setGetTableDataLoading(false);
  };

  useEffect(() => {
    fetchUserFormatData();
  }, []);

  return (
    <>
      <div className="col-12 d-flex">
        <Card className="reports reports3" style={{ width: "9rem" }}>
          <Card.Body>
            <FontAwesomeIcon icon="fa-solid fa-list-ul" />
            <Card.Title></Card.Title>
            <Card.Text>Sales</Card.Text>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <FontAwesomeIcon icon="fa-solid fa-eye" />
            </Button>
          </Card.Body>
        </Card>
      </div>

      <Modal
        className="modal fade"
        show={showModal}
        fullscreen={true}
        centered
        onHide={() => setShowModal(false)}
      >
        <Modal.Header>
          <Modal.Title>List of Sales</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col className="report-img">
                <img src={img} alt="" />
              </Col>

              <Col>
                {Suppliername.map((values) => (
                  <h5>{values?.company_name} </h5>
                ))}
                List of Sales
                <br />
                Category
                <br />
                Find out Sales Lists
              </Col>
              <Col xs={6}></Col>
            </Row>

            <hr />
            <Row className="mb-3">
              <Form.Group as={Col} controlId="from_date">
                <Form.Label>From</Form.Label>
                <Form.Control
                  type="date"
                  name="from_date"
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  From date is required.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="to_date">
                <Form.Label>To</Form.Label>
                <Form.Control
                  type="date"
                  name="to_date"
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  To date is required.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="supplier">
                <Form.Label>By Supplier</Form.Label>
                <Form.Control
                  as="select"
                  required
                  name="supplier"
                  onChange={(e) => handleChange(e)}
                >
                  <option value="">Choose...</option>
                  {SupplierData.map((values) => (
                    <option value={values?.user_id}>
                      {values?.company_name}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback className="error-label" type="invalid">
                  Supplier is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            {/*}
            <Row className="mb-3">
              <Form.Group as={Col} controlId="product-type">
                <Form.Label>By Frequency</Form.Label>
                <Form.Control
                  as="select"
                  name="product_type"
                  required
                  onChange={(e) => handleChange(e)}
                >
                  <option value="">Choose...</option>
                </Form.Control>
                <Form.Control.Feedback className="error-label" type="invalid">
                  Frequency is required.
                </Form.Control.Feedback>
              </Form.Group>
            <Form.Group as={Col} controlId="product-type">
            <Form.Label>Select</Form.Label>
              {['checkbox'].map((type) => (
              <div key={`inline-${type}`} className="mb-3">
                <Form.Check
             inline
             label="QTY Boxes"
             name="group1"
             type={type}
             id={`inline-${type}-1`}
           />
           <Form.Check
             inline
             label="Revenue"
             name="group1"
             type={type}
             id={`inline-${type}-2`}
           />
           <Form.Check
             inline
             label="Discount"
             type={type}
             id={`inline-${type}-3`}
           />
           <Form.Check
           inline
           label="Rank"
           name="group1"
           type={type}
           id={`inline-${type}-4`}
         />
         <Form.Check
           inline
           label="Revenue"
           name="group1"
           type={type}
           id={`inline-${type}-5`}
         />
         <Form.Check
           inline
           label="Last order"
           type={type}
           id={`inline-${type}-6`}
         />
         <Form.Check
           inline
           label="Avarage order value"
           type={type}
           id={`inline-${type}-7`}
         />
         </div>
            ))}
                </Form.Group>
            </Row>*/}
            <Row className="mb-3">
              <Form.Group as={Col} controlId="by-user">
                <Form.Label>By user</Form.Label>
                <Form.Control
                  as="select"
                  required
                  name="by_user"
                  onChange={(e) => handleChange(e)}
                >
                  <option value="">Choose...</option>
                  <option value="all">All</option>
                  {UserFormatData.map((values) => (
                    <option value={values?.id}>
                      {values?.first_name} {values?.last_name}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback className="error-label" type="invalid">
                  User is required.
                </Form.Control.Feedback>
              </Form.Group>
              {/*}          <Form.Group as={Col} controlId="product-type">
            <Form.Label>Select</Form.Label>
              {['checkbox'].map((type) => (
              <div key={`inline-${type}`} className="mb-3">
                <Form.Check
             inline
             label="Trend"
             name="group1"
             type={type}
             id={`inline-${type}-1`}
           />
           <Form.Check
             inline
             label="Action"
             name="group1"
             type={type}
             id={`inline-${type}-2`}
           />
           <Form.Check
             inline
             label="City"
             type={type}
             id={`inline-${type}-3`}
           />
           <Form.Check
           inline
           label="All"
           name="group1"
           type={type}
           id={`inline-${type}-4`}
         />
         </div>
            ))}
                </Form.Group> */}
              <Form.Group as={Col} controlId="retailer">
                <Form.Label>By Retailer</Form.Label>
                <Form.Control
                  as="select"
                  name="retailer"
                  onChange={(e) => handleChange(e)}
                >
                  {" "}
                  <option value="">Choose...</option>
                  {RetailerData.map((values) => (
                    <option value={values?.user_id}>
                      {values?.business_name}
                    </option>
                  ))}
                </Form.Control>
                {/* <Form.Control.Feedback className="error-label" type="invalid">
                    Please select an option.
                  </Form.Control.Feedback> */}
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="Product_type">
                <Form.Label>Product type</Form.Label>
                <Form.Control
                  as="select"
                  name="product_type"
                  onChange={(e) => handleChange(e)}
                >
                  {" "}
                  <option value="">Choose...</option>
                  {ProductTypeData.map((values) => (
                    <option value={values?.product_type}>
                      {values?.product_type}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="Product-format">
                <Form.Label>Product format</Form.Label>
                <Form.Control
                  as="select"
                  name="product_format"
                  onChange={(e) => handleChange(e)}
                >
                  {" "}
                  <option value="">Choose...</option>
                  {ProductFormatData.map((values) => (
                    <option value={values?.name}>{values?.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="file-type">
                <Form.Label>File Type</Form.Label>
                <Form.Control
                  as="select"
                  name="file_type"
                  onChange={(e) => handleChange(e)}
                >
                  {" "}
                  <option value="">Choose...</option>
                  <option value="xlsx">XLSX</option>
                  <option value="csv">CSV</option>
                  <option value="pdf">PDF</option>
                </Form.Control>
                {/* <Form.Control.Feedback className="error-label" type="invalid">
                  Please select an option.
                </Form.Control.Feedback> */}
              </Form.Group>
              <Form.Group as={Col} controlId="language">
                <Form.Label>Language</Form.Label>
                <Form.Control
                  as="select"
                  name="language"
                  onChange={(e) => handleChange(e)}
                >
                  {" "}
                  <option value="">Choose...</option>
                  <option value="CAeng"> ENG </option>
                  <option value="CAfr"> FRA </option>
                </Form.Control>
              </Form.Group>
            </Row>

            <button
              type="submit"
              class="btn btn-success w-auto"
              disabled={loading}
            >
              Generate List
            </button>
          </Form>
          <hr />
          {!!getTableDataLoading && <Loader />}
          {!getTableDataLoading && (
            // <Table responsive striped bordered hover>
            //   <thead>
            //     <tr>
            //       <th>Created At</th>
            //       <th>Download</th>
            //       <th>File Type</th>
            //     </tr>
            //   </thead>
            //   <tbody>
            //     {tableData.map((values) => (
            //       <tr>
            //         <td>{new Date(values?.created_at)?.toLocaleDateString('en-GB').replace(new RegExp("/", 'g'),"-")}</td>
            //         <td>
            //           <a class="btn btn-success" target="_blank" href={`${values?.file_path}/${values?.filename}`}>
            //             Download - {values?.file_type}
            //           </a>
            //         </td>
            //         <td>{values?.file_type}</td>
            //       </tr>
            //     ))}
            //   </tbody>
            // </Table>
            <ReportsTable
              tableData={tableData}
              headings={["Created At", "File Type", "Download"]}
              className=""
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            variant="warning"
            className="btn btn-danger"
            data-bs-dismiss="modal"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SalesLists;
