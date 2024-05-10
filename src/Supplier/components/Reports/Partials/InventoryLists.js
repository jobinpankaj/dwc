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
const postFormDataUrl = "/supplier/PostReportInventoryList";
const getFormDataUrl = "/supplier/getinventoryReport";
const getFullInventoriesData = "/GetFullInventory_model";

const InventoryLists = ({ img, token, supplierName, usersData }) => {
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
    from_date: "",
    to_date: "",
    warehouse: "",
    supply: "",
    product_name: "",
    product_type: "",
    product_style: "",
    product_format: "",
    by_user: "",
    language: "",
    file_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [getTableDataLoading, setGetTableDataLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [fullInventoryListData, setFullInventoryListData] = useState([]);
  const [fullProductListDataLoading, setFullProductListDataLoading] =
    useState(true);
  const [productNameData, setProductNameData] = useState([]);
  const [productTypeData, setProductTypeData] = useState([]);
  const [productStyleData, setProductStyleData] = useState([]);
  const [productFormatData, setProductFormatData] = useState([]);

  // testing values for table
  // {
  //   created_at: "123",
  //   file_path: "www.google.com",
  //   file_type: "pdf",
  // },

  // handle change : sets formData
  const handleChange = (e) => {
    const { name, value } = e.target;

    const dataKey = e.target.options
      ? e.target.options[e.target.selectedIndex].getAttribute("data-key") ??
        null
      : null;

    let newFormData = [];
    let newProductNameData = [];
    let newProductTypeData = [];
    let newProductStyleData = [];
    let newProductFormatData = [];

    // if dataKey
    // code inside finds values with common warehouse_id
    if (dataKey) {
      newFormData = fullInventoryListData?.map((data) =>
        data?.find((value) => value?.warehouse_id == dataKey)
      );

      newProductNameData = fullInventoryListData[1]?.filter(
        (data) => data?.warehouse_id == dataKey
      );
      newProductTypeData = fullInventoryListData[2]?.filter(
        (data) => data?.warehouse_id == dataKey
      );
      newProductStyleData = fullInventoryListData[3]?.filter(
        (data) => data?.warehouse_id == dataKey
      );
      newProductFormatData = fullInventoryListData[4]?.filter(
        (data) => data?.warehouse_id == dataKey
      );
    }

    setProductNameData(newProductNameData);
    setProductTypeData(newProductTypeData);
    setProductStyleData(newProductStyleData);
    setProductFormatData(newProductFormatData);

    // check if newFormData is not empty
    // then update formData
    // if no common value then that field won't be updated
    if (newFormData?.length != 0) {
      setFormData((prevData) => ({
        ...prevData,
        warehouse: newFormData[0]?.w_name ?? "",
        product_name: newFormData[1]?.product_name ?? "",
        product_type: newFormData[2]?.product_type ?? "",
        product_style: newFormData[3]?.name ?? "",
        product_format: newFormData[4]?.name ?? "",
        // by_user: "",
        // language: "",
        // file_type: "",
      }));
    }

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
            toast.success("Inventory report generated!", {
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

  // fetch saved form Users data from db
  const fetchFullInventoriesData = async () => {
    // add permissions based on URL
    config.headers.permission = "reports-view";
    await apis
      .get(getFullInventoriesData, config)
      //.get(getFormDataUrl)
      .then((res) => {
        if (res.status === 200) {
          console.log("response Warehouse data", { res });
          setFullInventoryListData(res.data.data);
          setProductNameData(res.data.data[1]);
          setProductTypeData(res.data.data[2]);
          setProductStyleData(res.data.data[3]);
          setProductFormatData(res.data.data[4]);
          setFullProductListDataLoading(false);
        }
      })
      .catch((error) => {
        console.log({ error });
        setFullProductListDataLoading(false);
        if (error) {
          console.log({ error });
        }
      });
    setFullProductListDataLoading(false);
  };

  useEffect(() => {
    if (showModal) {
      fetchFullInventoriesData();
      fetchFormData();
      setFullProductListDataLoading(true);
    }
  }, [showModal]);

  console.log("formData : ", formData);

  return (
    <>
      <Card className="reports reports2">
        <Card.Body>
          <FontAwesomeIcon icon="fa-solid fa-warehouse" />
          <Card.Title></Card.Title>
          <Card.Text>Inventories</Card.Text>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FontAwesomeIcon icon="fa-solid fa-eye" />
          </Button>
        </Card.Body>
      </Card>

      <Modal
        className="modal fade"
        show={showModal}
        fullscreen={true}
        centered
        onHide={() => setShowModal(false)}
      >
        <Modal.Header>
          <Modal.Title>List of Inventories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!!fullProductListDataLoading && <Loader />}
          {!fullProductListDataLoading && (
            <>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                  <Col className="report-img">
                    <img src={img} alt="" />
                  </Col>

                  <Col>
                    <h5>{supplierName} </h5>
                    List of Inventories
                    <br />
                    Category
                    <br />
                    Find out where your products have been Stored
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
                  <Form.Group as={Col} controlId="warehouse">
                    <Form.Label>By warehouse</Form.Label>
                    <Form.Control
                      as="select"
                      required
                      name="warehouse"
                      onChange={(e) => handleChange(e)}
                      value={formData?.warehouse}
                    >
                      <option value="">Choose...</option>
                      {fullInventoryListData &&
                        fullInventoryListData[0]?.map((values) => (
                          <option
                            value={values?.w_name}
                            data-key={values?.warehouse_id}
                          >
                            {values?.w_name}
                          </option>
                        ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} controlId="product-name">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      as="select"
                      required
                      name="product_name"
                      onChange={(e) => handleChange(e)}
                      value={formData?.product_name}
                    >
                      <option value="">Choose...</option>
                      {productNameData?.map((values) => (
                        <option
                          value={values?.product_name}
                          data-key={values?.warehouse_id}
                        >
                          {values?.product_name}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback
                      className="error-label"
                      type="invalid"
                    >
                      Product name is required.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="product-type">
                    <Form.Label>Product type</Form.Label>
                    <Form.Control
                      as="select"
                      required
                      name="product_type"
                      onChange={(e) => handleChange(e)}
                      value={formData?.product_type}
                    >
                      <option value="">Choose...</option>
                      {productTypeData?.map((values) => (
                        <option
                          value={values?.product_type}
                          data-key={values?.warehouse_id}
                        >
                          {values?.product_type}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback
                      className="error-label"
                      type="invalid"
                    >
                      Product type is required.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="product-style">
                    <Form.Label>Product style</Form.Label>
                    <Form.Control
                      as="select"
                      required
                      name="product_style"
                      onChange={(e) => handleChange(e)}
                      value={formData?.product_style}
                    >
                      <option value="">Choose...</option>
                      {productStyleData?.map((values) => (
                        <option
                          value={values?.name}
                          data-key={values?.warehouse_id}
                        >
                          {values?.name}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback
                      className="error-label"
                      type="invalid"
                    >
                      Product style is required.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="product-format">
                    <Form.Label>Product Format</Form.Label>
                    <Form.Control
                      as="select"
                      name="product_format"
                      required
                      onChange={(e) => handleChange(e)}
                      value={formData?.product_format}
                    >
                      <option value="">Choose...</option>
                      {productFormatData?.map((values) => (
                        <option
                          value={values?.name}
                          data-key={values?.warehouse_id}
                        >
                          {values?.name}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback
                      className="error-label"
                      type="invalid"
                    >
                      Product format is required.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="by-user">
                    <Form.Label>By User</Form.Label>
                    <Form.Control
                      as="select"
                      required
                      name="by_user"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="">Choose...</option>
                      <option value="all">All</option>
                      {usersData &&
                        usersData.map((values) => (
                          <option
                            value={values?.id}
                            data-key={values?.warehouse_id}
                          >
                            {values?.first_name} {values?.last_name}
                          </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback
                      className="error-label"
                      type="invalid"
                    >
                      User is required.
                    </Form.Control.Feedback>
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
                      <option value="CAeng">ENG</option>
                      <option value="CAfr">FRA</option>
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
            </>
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

export default InventoryLists;
