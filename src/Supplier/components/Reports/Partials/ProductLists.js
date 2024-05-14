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
import { productList } from "../../../../Constants/data";

// define needed URLs here
const postFormDataUrl = "/PostReportProductList";
const getFormDataUrl = "/supplier/getsalesReport";
const getFormDataproductGroup = "/supplier/reportFormdataProductgroup";
const getProductListData = "/GetFullDist_model";
const ProductLists = ({ img, token, supplierName }) => {
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
    supplier: "",
    retailer: "",
    cad: "",
    product_name: "",
    product_type: "",
    product_style: "",
    product_format: "",
    order_state: "",
    invoice_state: "",
    group: "",
    language: "",
    file_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [getTableDataLoading, setGetTableDataLoading] = useState(false);
  const [fullProductListDataLoading, setFullProductListDataLoading] =
    useState(true);
  const [tableData, setTableData] = useState([]);
  const [ProductGroupData, setProductGroupData] = useState([]);
  const [fullProductListData, setFullProductListData] = useState([]);
  const [productCadData, setProductCadData] = useState([]);
  const [productNameData, setProductNameData] = useState([]);
  const [productTypeData, setProductTypeData] = useState([]);
  const [productStyleData, setProductStyleData] = useState([]);
  const [productFormatData, setProductFormatData] = useState([]);

  // handle change : sets formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    // get data-key value
    const dataKey = e.target.options
      ? e.target.options[e.target.selectedIndex].getAttribute("data-key") ??
        null
      : null;

    let newFormData = [];
    let newProductCadData = [];
    let newProductNameData = [];
    let newProductTypeData = [];
    let newProductStyleData = [];
    let newProductFormatData = [];
    // if dataKey
    // code inside finds values with common user_id
    if (dataKey) {
      newFormData = fullProductListData?.map((data) =>
        data?.find((value) => value?.user_id == dataKey)
      );

      newProductCadData = fullProductListData[2]?.filter(
        (data) => data?.user_id == dataKey
      );
      newProductNameData = fullProductListData[3]?.filter(
        (data) => data?.user_id == dataKey
      );
      newProductTypeData = fullProductListData[4]?.filter(
        (data) => data?.user_id == dataKey
      );
      newProductStyleData = fullProductListData[5]?.filter(
        (data) => data?.user_id == dataKey
      );
      newProductFormatData = fullProductListData[6]?.filter(
        (data) => data?.user_id == dataKey
      );
    }

    const notEligible = newFormData.some((item) => item === undefined);
    if (notEligible) {
      toast.error("Report cannot be processed!", {
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER,
      });
    }

    setProductCadData(newProductCadData);
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
        supplier: newFormData[0]?.company_name ?? "",
        retailer: newFormData[1]?.business_name ?? "",
        cad: newFormData[2]?.name ?? "",
        product_name: newFormData[3]?.product_name ?? "",
        product_type: newFormData[4]?.product_type ?? "",
        product_style: newFormData[5]?.name ?? "",
        product_format: newFormData[6]?.name ?? "",
      }));
    }

    // update formData for values without dataKey
    // these include date, hardcoded data
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  console.log("form Data : ", formData);

  // from submit
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    // form valid ?
    if (form.checkValidity() === true) {
      setLoading(true);

      // add permissions based on URL
      config.headers.permission = "reports-view";

      apis
        .post(postFormDataUrl, formData, config)
        //  .post(postFormDataUrl, formData)
        .then((res) => {
          console.log("response", { res });

          if (res.status === 200) {
            toast.success("Invoice Generated Successfully!", {
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
            toast.error("Invoice not available. Please try again later.", {
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
          console.log("Response Sales table data", { res });
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

  // fetch saved form Product Style data from db
  const fetchProductGroupData = () => {
    // add permissions based on URL
    config.headers.permission = "reports-view";
    apis
      .get(getFormDataproductGroup, config)
      //.get(getFormDataUrl)
      .then((res) => {
        if (res.status === 200) {
          console.log("response Group data", { res });
          setProductGroupData(res.data.data);
        }
      })
      .catch((error) => {
        console.log({ error });
        if (error) {
          console.log({ error });
        }
      });
  };

  // fetch saved form Product Style data from db
  const fetchProductListData = async (payload = {}) => {
    // add permissions based on URL
    config.headers.permission = "reports-view";
    await apis
      .get(getProductListData, config.headers, payload)
      .then((res) => {
        if (res.status === 200) {
          setFullProductListData(res?.data?.data);
          setProductCadData(res?.data?.data[2]);
          setProductNameData(res?.data?.data[3]);
          setProductTypeData(res?.data?.data[4]);
          setProductStyleData(res?.data?.data[5]);
          setProductFormatData(res?.data?.data[6]);
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
      fetchProductListData();
      fetchFormData();
      fetchProductGroupData();
      setFullProductListDataLoading(true);
    }
  }, [showModal]);

  return (
    <>
      <Card className="reports reports1">
        <Card.Body>
          <FontAwesomeIcon icon="fa-solid fa-list-check" />
          <Card.Title></Card.Title>
          <Card.Text>Distribution</Card.Text>
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
          <Modal.Title>Distribution</Modal.Title>
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
                    Products Distributions
                    <br />
                    Find out where your products have been delivered.
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
                      value={formData?.supplier}
                    >
                      <option value="">Choose...</option>
                      {fullProductListData &&
                        fullProductListData[0]?.map((values) => (
                          <option
                            value={values?.company_name}
                            data-key={values?.user_id}
                          >
                            {values?.company_name}
                          </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback
                      className="error-label"
                      type="invalid"
                    >
                      Supplier is required.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="retailer">
                    <Form.Label>By Retailer</Form.Label>
                    <Form.Control
                      as="select"
                      name="retailer"
                      required
                      onChange={(e) => handleChange(e)}
                      value={formData?.retailer}
                    >
                      <option value="">Choose...</option>
                      <option value="all">All</option>
                      {fullProductListData &&
                        fullProductListData[1]?.map((values) => (
                          <option
                            value={values?.business_name}
                            data-key={values?.user_id}
                          >
                            {values?.business_name}
                          </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback
                      className="error-label"
                      type="invalid"
                    >
                      Retailer type is required.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="cad">
                    <Form.Label>CSP/CAD</Form.Label>
                    <Form.Control
                      as="select"
                      name="cad"
                      required
                      onChange={(e) => handleChange(e)}
                      value={formData?.cad}
                    >
                      <option value="">Choose...</option>
                      <option value="all">All</option>
                      {productCadData?.map((values) => (
                        <option value={values?.name} data-key={values?.user_id}>
                          {values?.name}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback
                      className="error-label"
                      type="invalid"
                    >
                      CSP/CAD type is required.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="product-name">
                    <Form.Label>Product name</Form.Label>
                    <Form.Control
                      as="select"
                      name="product_name"
                      required
                      onChange={(e) => handleChange(e)}
                      value={formData?.product_name}
                    >
                      <option value="">Choose...</option>
                      {productNameData?.map((values) => (
                        <option
                          value={values?.product_name}
                          data-key={values?.user_id}
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
                  <Form.Group as={Col} controlId="product-type">
                    <Form.Label>Product Type</Form.Label>
                    <Form.Control
                      as="select"
                      name="product_type"
                      required
                      onChange={(e) => handleChange(e)}
                      value={formData?.product_type}
                    >
                      <option value="">Choose...</option>
                      {productTypeData?.map((values) => (
                        <option
                          value={values?.product_type}
                          data-key={values?.user_id}
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
                      name="product_style"
                      required
                      onChange={(e) => handleChange(e)}
                      value={formData?.product_style}
                    >
                      <option value="">Choose...</option>
                      {productStyleData?.map((values) => (
                        <option value={values?.name} data-key={values?.user_id}>
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
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="product-format">
                    <Form.Label>Product format</Form.Label>
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
                          key={values?.id}
                          value={values?.name}
                          data-key={values?.user_id}
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
                  <Form.Group as={Col} controlId="order-state">
                    <Form.Label>Order status </Form.Label>
                    <Form.Control
                      as="select"
                      required
                      name="order_state"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="">Choose...</option>
                      <option value="all">All</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Control>
                    <Form.Control.Feedback
                      className="error-label"
                      type="invalid"
                    >
                      Order state is required.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="invoice-state">
                    <Form.Label>Invoices Status</Form.Label>
                    <Form.Control
                      as="select"
                      required
                      name="invoice_state"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="">Choose...</option>
                      <option value="All">All</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="overdue">Overdue</option>
                      <option value="closed">Closed</option>
                      <option value="collect">Collect</option>
                    </Form.Control>
                    <Form.Control.Feedback
                      className="error-label"
                      type="invalid"
                    >
                      Invoice status is required.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="group">
                    <Form.Label>Group</Form.Label>
                    <Form.Control
                      as="select"
                      required
                      name="group"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="">Choose...</option>
                      {ProductGroupData.map((values) => (
                        <option value={values?.name}>{values?.name}</option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback
                      className="error-label"
                      type="invalid"
                    >
                      Group is required.
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

export default ProductLists;
