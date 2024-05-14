import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoDark from "../../assets/images/logo-dark.svg";
import newOrder from "../../assets/images/new-order.png";
import delivery from "../../assets/images/order-delivery.svg";
import shipment from "../../assets/images/order-shipment.svg";
import orderSuccess from "../../assets/images/order-tick.svg";
import calender from "../../assets/images/calender.png";
import viewfile from "../../assets/images/view-file.png";
import pdf from "../../assets/images/pdf.png";
import useAuthInterceptor from "../../../utils/apis";
import { toast } from "react-toastify";
import Sidebar from "../../../CommonComponents/Sidebar/sidebar";
import Header from "../../../CommonComponents/Header/header";
import "../../assets/scss/dashboard.scss";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import moment from "moment";

// class ComponentToPrint extends React.Component {
// constructor(props) {
//   super(props);
//   this.componentRef = React.createRef(); // Initialize componentRef
// }
//   render() {
//     return (
//       <div>
//         Content that you want to print
//       </div>
//     );
//   }
// }

const OrderDetail = () => {
  const apis = useAuthInterceptor();
  const token = localStorage.getItem("supplier_accessToken");
  const { t, i18n } = useTranslation();
  const { order_id } = useParams();
  const [orderDetail, setOrderDetail] = useState("");

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        permission: "order-view",
      },
    };

    apis
      .get(`/supplier/orderDetail/${order_id}`, config)
      .then((res) => {
        if (res.data.success === true) {
          setOrderDetail(res.data.data);
        } else {
          toast.error(
            "Could not fetch order details. Please try again later.",
            { autoClose: 3000, position: toast.POSITION.TOP_CENTER }
          );
        }
      })
      .catch((error) => {
        if(error.message !== "revoke"){
          toast.error("Could not fetch order details. Please try again later.", {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      });

  };
  // const sumitHandler = ()  => {
  //   //api calling for upadte the quantity of item
  //   const config2 ={
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       permission: "order-edit",
  //     }
  //   }
  //   const data ={
  //     "quantity":`${eachItemQuantity}`
  //   }
  //   apis
  //   .post(`/supplier/order/${order_id}/${masterEditForID}/updateQuantity`, data, config2)
  //   .then((res) => {
  //     if (res) {
  //       fetchOrderDetail();
  //       toast.success(
  //         "Order update Sucessfully .",
  //         { autoClose: 3000, position: toast.POSITION.TOP_CENTER }
  //       );
  //     } else {
  //       toast.error(
  //         "Could not update order . Please try again later.",
  //         { autoClose: 3000, position: toast.POSITION.TOP_CENTER }
  //       );
  //     }
  //   })
  //   .catch((error) => {
  //     if (error.message !== "revoke") {
  //       toast.error(
  //         "Could not update order . Please try again later.",
  //         {
  //           autoClose: 3000,
  //           position: toast.POSITION.TOP_CENTER,
  //         }
  //       );
  //     }
  //   });

  //   setMasterEditForID(null)
  //   setEditFunctionality(true)
  // }
  //Changing Functionality 6th May :)
  const sumitHandler = () => {
    //api calling for upadte the quantity of item
    const config2 = {
      headers: {
        Authorization: `Bearer ${token}`,
        permission: "order-edit",
      },
    };
    const data = {
      order_id: order_id,
      id: masterEditForID,
      quantity: `${eachItemQuantity}`,
    };
    apis
      .post(`/supplier/order/updatequantity`, data, config2)
      .then((res) => {
        if (res) {
          fetchOrderDetail();
          toast.success("Order update Sucessfully .", {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        } else {
          toast.error("Could not update order . Please try again later.", {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      })
      .catch((error) => {
        if (error.message !== "revoke") {
          toast.error("Could not update order . Please try again later.", {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      });

    setMasterEditForID(null);
    setEditFunctionality(true);
  };

  const handleAttachFile = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        permission: `order-view`,
        "Content-Type": "multipart/form-data",
      },
    };
    if (selectedFile) {
      // and use callback to return the data which you get.
      function getBase64(selectedFile, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = function () {
          cb(reader.result);
        };
        reader.onerror = function (error) {
          console.log("Error: ", error);
        };
      }

      getBase64(selectedFile, (idCardBase64) => {
        console.log("Base64 data:", idCardBase64);

        const formData = new FormData();
        formData.append("file", idCardBase64); // Append base64 data instead of selectedFile
        formData.append("order_id", params.order_id);
        console.log("FormData:", formData);

        apis
          .post("/retailer/uploadOrderFile", formData, config)
          .then((res) => {
            console.log("File Uploaded");
            setSelectedFile(null);
            toast.success("File update Sucessfully .", {
              autoClose: 3000,
              position: toast.POSITION.TOP_CENTER,
            });
          })
          .catch((err) => {
            if (err.message !== "revoke") {
              toast.error("Could not update order . Please try again later.", {
                autoClose: 3000,
                position: toast.POSITION.TOP_CENTER,
              });
            }
            console.log("Error uploading file", err);
          });
      });
    } else {
      console.log("No file selected");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("supplier_accessToken");
    // Check if token exists
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          permission: "order-view",
        },
      };

      apis
        .get(`/supplier/getUploadFileList/${params.order_id}`, config)
        .then((res) => {
          if (res.data.success === true) {
            setPdfUrls(res.data.data);
            console.log("<<<", res.data.data);
            // setSupplierId(res.data.data.supplier_id);
          } else {
            console.log("No files available for this supplier.");
          }
        })
        .catch((error) => console.error("Error fetching PDF URLs:", error));
    } else {
      // Handle case when token is missing or invalid
      console.error("Access token not found or invalid");
      // Optionally, redirect to login page or display an error message
    }
  }, []);
  return (
    <div class="container-fluid page-wrap order-details">
      <div class="row height-inherit">
        <Sidebar userType={"supplier"} />

        <div class="col main p-0">
          <Header title={t("supplier.order_management.view_order.title")} />
          <div class="container-fluid page-content-box px-3 px-sm-4">
            <div className="card">
              <div className="card-body">
                <div class="tab-link-row">
                  <ul class="nav nav-tabs mb-3" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                      <button
                        class="nav-link active"
                        id="value-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#details-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="value-tab-pane"
                        aria-selected="true"
                      >
                        {t("supplier.order_management.view_order.detail")}
                      </button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button
                        class="nav-link"
                        id="order-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#history-msg-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="order-tab-pane"
                        aria-selected="false"
                      >
                        {t("supplier.order_management.view_order.history")}
                      </button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button
                        class="nav-link"
                        id="order-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#document-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="order-tab-pane"
                        aria-selected="false"
                      >
                        {t("supplier.order_management.view_order.document")}
                      </button>
                    </li>
                  </ul>
                </div>

                <div class="tab-content" id="myTabContent">
                  {/* [Details Tab] */}
                  <div
                    class="tab-pane fade show active"
                    id="details-tab-pane"
                    role="tabpanel"
                    aria-labelledby="value-tab"
                    tabindex="0"
                  >
                    <div class="row mb-3">
                      <div class="col">
                        <div class="card shadow-none">
                          <div class="card-body p-0">
                            <div class="row m-0">
                              <div class="col-sm-3 d-flex justify-content-center align-items-center p-5 border-end">
                                <img src={logoDark} className="img-fluid" />
                              </div>
                              <div class="col-sm-9 p-0">
                                {/* [Form 1] */}
                                <div className="row m-0">
                                  <div className="col p-3">
                                    <form>
                                      <div className="form-head">
                                        {t(
                                          "supplier.order_management.view_order.supplier"
                                        )}
                                      </div>
                                      <div className="row mb-3">
                                        <div className="col-sm-4">
                                          <label className="form-label">
                                            {t(
                                              "supplier.order_management.view_order.name"
                                            )}
                                          </label>
                                          <input
                                            type="text"
                                            value={
                                              orderDetail && orderDetail.supplier_information.user_profile
                                                ? orderDetail.supplier_information.user_profile.company_name
                                                ? orderDetail.supplier_information.user_profile.company_name
                                                : "N/A"
                                                : "N/A"
                                            }
                                            className="form-control"
                                            disabled
                                          />
                                        </div>
                                        <div className="col-sm-4">
                                          <label className="form-label">
                                            {t(
                                              "supplier.order_management.view_order.creation"
                                            )}
                                          </label>
                                          <input
                                            type="text"
                                            value={orderDetail.order_date}
                                            className="form-control"
                                            disabled
                                          />
                                        </div>
                                        <div className="col-sm-4">
                                          <label className="form-label">
                                            {t(
                                              "supplier.order_management.view_order.status"
                                            )}
                                          </label>
                                          <input
                                            type="text"
                                            value={orderDetail.status}
                                            className="form-control"
                                            disabled
                                          />
                                        </div>
                                        <div className="w-100 mb-3"></div>
                                        {orderDetail.delivery_date ? (
                                          <div className="col-sm-4">
                                            <label className="form-label">
                                              Expected Delivery Date
                                            </label>
                                            <input
                                              type="date"
                                              value="20 March, 2021"
                                              className="form-control"
                                            />
                                          </div>
                                        ) : (
                                          <></>
                                        )}
                                        <div className="col-sm-8">
                                          <label className="form-label">
                                            {t(
                                              "supplier.order_management.view_order.invoice"
                                            )}
                                          </label>
                                          <input
                                            type="test"
                                            className="form-control"
                                            value="TBD"
                                            disabled
                                          />
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                                {/* [/Form 1] */}

                                {/* [Form 2] */}
                                <div className="row m-0 bg-light py-4 border-top">
                                  <div className="col p-3">
                                    <form>
                                      <div className="form-head">
                                        {t(
                                          "supplier.order_management.view_order.retailer"
                                        )}
                                      </div>
                                      <div className="row mb-3">
                                        <div className="col-6 col-sm-3">
                                          <label className="form-label">
                                            {t(
                                              "supplier.order_management.view_order.name"
                                            )}
                                          </label>
                                          <input
                                            type="text"
                                            value={
                                              orderDetail && orderDetail.retailer_information.user_profile
                                                ? orderDetail.retailer_information.user_profile.business_name
                                                ? orderDetail.retailer_information.user_profile.business_name
                                                : "N/A"
                                                : "N/A"
                                            }
                                            className="form-control"
                                            disabled
                                          />
                                        </div>
                                        <div className="col-6 col-sm-3">
                                          <label className="form-label">
                                            {t(
                                              "supplier.order_management.view_order.phone_number"
                                            )}
                                          </label>
                                          <input
                                            type="text"
                                            value={
                                              orderDetail
                                                ? orderDetail
                                                    .retailer_information
                                                    .phone_number
                                                : "N/A"
                                            }
                                            className="form-control"
                                            disabled
                                          />
                                        </div>
                                        <div className="col-6 col-sm-3">
                                          <label className="form-label">
                                            {t(
                                              "supplier.order_management.view_order.contact_email"
                                            )}
                                          </label>
                                          <input
                                            type="text"
                                            value={
                                              orderDetail
                                                ? orderDetail
                                                    .retailer_information.email
                                                : "N/A"
                                            }
                                            className="form-control"
                                            disabled
                                          />
                                        </div>
                                        <div className="col-6 col-sm-3">
                                          <label className="form-label">
                                            {t(
                                              "supplier.order_management.view_order.consumption"
                                            )}
                                          </label>
                                          <input
                                            type="text"
                                            value={
                                              orderDetail &&
                                              orderDetail.retailer_information
                                                ? orderDetail
                                                    .retailer_information
                                                    .user_profile.opc_status ===
                                                  "1"
                                                  ? "On-site"
                                                  : "N/A"
                                                : "N/A"
                                            }
                                            className="form-control"
                                            disabled
                                          />
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                                {/* [/Form 2] */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div class="col">
                        <div class="card shadow-none height-100">
                          <div class="card-body p-0">
                            <div className="table-responsive">
                              <table class="table m-0">
                                <thead>
                                  <tr>
                                    <th scope="col">
                                      {t(
                                        "supplier.order_management.view_order.table_col1"
                                      )}
                                    </th>
                                    <th scope="col">
                                      {t(
                                        "supplier.order_management.view_order.table_col2"
                                      )}
                                    </th>
                                    <th scope="col">
                                      {t(
                                        "supplier.order_management.view_order.table_col3"
                                      )}
                                    </th>
                                    <th scope="col">
                                      {t(
                                        "supplier.order_management.view_order.table_col4"
                                      )}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {orderDetail &&
                                  orderDetail.items.length > 0 ? (
                                    orderDetail.items.map((ele) => {
                                      return (
                                        <tr>
                                          <td>
                                            <div class="prodInfo d-flex">
                                              <div class="prod-img p-2">
                                                <img
                                                  src={
                                                    ele.product.product_image
                                                  }
                                                  className="img-fluid"
                                                />
                                              </div>
                                              <div class="desc d-flex flex-column align-items-start">
                                                <div className="proName">
                                                  {ele.product.product_name}
                                                </div>
                                                <div className="prodMeta badge text-bg-light rounded-pill">
                                                  {
                                                    ele.product.product_format
                                                      .name
                                                  }
                                                </div>
                                              </div>
                                            </div>
                                          </td>
                                          <td class="">
                                            <div className="price-box ">
                                              <div className="mrp">
                                                {"$ " + ele.price}
                                              </div>
                                              {/* <div className="old-price">
                                                                                <span className="price-cut d-inline-block me-2">
                                                                                    $50.00
                                                                                </span>
                                                                                <span className="discount badge bg-purple rounded-pill d-inline-block">
                                                                                    -12%
                                                                                </span>
                                                                            </div> */}
                                            </div>
                                          </td>
                                          <td className="qty">
                                            {ele.quantity}
                                          </td>
                                          <td class="">
                                            <div className="price-box">
                                              <div className="mrp">
                                                {"$ " + ele.sub_total}
                                              </div>
                                              {/* <div className="old-price">
                                                                                <span className="price-cut d-inline-block me-2">
                                                                                    $50.00
                                                                                </span>
                                                                                <span className="discount badge bg-purple rounded-pill d-inline-block">
                                                                                    -12%
                                                                                </span>
                                                                            </div> */}
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })
                                  ) : (
                                    <tr>
                                      <td>No data to show</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row justify-content-end">
                      <div className="col-sm-3">
                        <div className="card shadow-none order-subtotal-box">
                          <div className="card-body p-3">
                            <div className="price-breakage mb-2 d-flex justify-content-between">
                              <label>4 Products (22.704L):</label>
                              <span>$178.89</span>
                            </div>
                            <div className="price-breakage mb-2 d-flex justify-content-between">
                              <label>Deposits:</label>
                              <span>$9</span>
                            </div>
                            <div className="price-breakage-sum mb-2 d-flex justify-content-between">
                              <label>Subtotal</label>
                              <span>$188.19</span>
                            </div>
                            <hr />
                            <div className="price-addon mb-2 d-flex justify-content-between">
                              <label>GST (5%) on $178.89</label>
                              <span>$8.93</span>
                            </div>
                            <div className="price-addon d-flex justify-content-between">
                              <label>QST (9.975%) on $178.89</label>
                              <span>$17.75</span>
                            </div>
                          </div>
                          <div class="card-footer total-sum d-flex justify-content-between">
                            <label>Total</label>
                            <span>$188.19</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-sm-5 mt-4 bottom-btn ">
                      {/* <div class="col-12  d-flex gap-4 justify-content-sm-end justify-content-center"> */}
                      <div className="col-md-8 d-flex justify-content-between">
                        <div className="">
                          <button
                            className="btn btn-outline-black"
                            title="Edit"
                          >
                            <i
                              class="fa-solid fa-pen-to-square"
                              style={{ color: "blue" }}
                            ></i>
                          </button>
                          <button
                            className="btn btn-outline-black mx-2"
                            title="Print"
                          >
                            <i
                              class="fa-solid fa-print"
                              style={{ color: "#ffa500" }}
                            ></i>
                          </button>
                          <button
                            className="btn btn-outline-black mx-2"
                            title="Cancel"
                          >
                            <i
                              class="fa-solid fa-ban"
                              style={{ color: "red" }}
                            ></i>
                          </button>
                        </div>
                        <div>
                          <button
                            className="btn btn-outline-black mx-2"
                            title="Download"
                          >
                            <i
                              class="fa-solid fa-download"
                              style={{ color: "#20c152" }}
                            ></i>
                          </button>

                          <button
                            className="btn btn-outline-black mx-2"
                            title="PDF"
                          >
                            <i
                              class="fa-solid fa-file-pdf"
                              style={{ color: "red" }}
                            ></i>
                          </button>
                          <button
                            className="btn btn-outline-black mx-2"
                            title="CSV"
                          >
                            <i
                              class="fa-solid fa-file-csv"
                              style={{ color: "black" }}
                            ></i>
                          </button>
                          <button
                            className="btn btn-outline-black mx-2"
                            title="EXCEL"
                          >
                            <i
                              class="fa-solid fa-file-excel"
                              style={{ color: "green" }}
                            ></i>
                          </button>
                        </div>
                      </div>
                      <div className="col-md-4 text-end">
                        <button class="btn btn-purple" title="New Order">
                          <i class="fa-solid fa-plus"></i>
                        </button>
                        <button
                          class="btn btn-outline-secondary mx-2"
                          title="Save"
                        >
                          <i
                            class="fa-solid fa-file-arrow-down"
                            style={{ color: "#fff" }}
                          ></i>
                        </button>
                        <button class="btn btn-outline-success" title="Accept">
                          <i
                            class="fa-solid fa-check"
                            style={{ color: "#fff" }}
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* [/Details Tab] */}

                  {/* [History Tab] */}
                  <div
                    class="tab-pane fade"
                    id="history-msg-tab-pane"
                    role="tabpanel"
                    aria-labelledby="order-tab"
                    tabindex="0"
                  >
                    <div className="card shadow-none">
                      <div className="card-body">
                        <div className="row mb-3">
                          {/* [Steps List] */}
                          <div className="col-12 order-progress-list">
                            {/* [Step 1] */}
                            <div className="order-progress-step d-flex mb-3 align-items-center">
                              <div className="progress-inner d-flex align-items-center">
                                <img src={newOrder} className="me-3" />
                                <div className="stepMeta d-flex align-items-start flex-column">
                                  <div className="stepName">New Order</div>
                                  <span class="badge text-bg-orange">
                                    PENDING
                                  </span>
                                </div>
                              </div>
                              <div className="progress-info">
                                <div className="date">
                                  <img src={calender} />
                                  20 March 2023
                                </div>
                                <div className="badge rounded-pill">
                                  felicia.reid@example.com
                                </div>
                              </div>
                            </div>
                            {/* [/Step 1] */}

                            {/* [Step 2] */}
                            <div className="order-progress-step d-flex mb-3 align-items-center disabled">
                              <div className="progress-inner d-flex align-items-center">
                                <img src={delivery} className="me-3" />
                                <div className="stepMeta d-flex align-items-start flex-column">
                                  <div className="stepName">
                                    Estimated Delivery at
                                  </div>
                                  <p className="m-0">20 March 2021</p>
                                </div>
                              </div>
                            </div>
                            {/* [/Step 2] */}

                            {/* [Step 3] */}
                            <div className="order-progress-step d-flex mb-3 align-items-center disabled">
                              <div className="progress-inner d-flex align-items-center">
                                <img src={shipment} className="me-3" />
                                <div className="stepMeta d-flex align-items-start flex-column">
                                  <div className="stepName">
                                    Added to Shipment
                                  </div>
                                  <p className="m-0">
                                    #1610-Buckle Disrtibution
                                  </p>
                                </div>
                              </div>
                            </div>
                            {/* [/Step 3] */}

                            {/* [Step 4] */}
                            <div className="order-progress-step d-flex mb-3 align-items-center disabled">
                              <div className="progress-inner d-flex align-items-center">
                                <img src={delivery} className="me-3" />
                                <div className="stepMeta d-flex align-items-start flex-column">
                                  <div className="stepName">
                                    Estimated Delivery at
                                  </div>
                                  <p className="m-0">20 March 2021</p>
                                </div>
                              </div>
                            </div>
                            {/* [/Step 4] */}

                            {/* [Step 5] */}
                            <div className="order-progress-step d-flex mb-3 align-items-center disabled">
                              <div className="progress-inner d-flex align-items-center">
                                <img src={orderSuccess} className="me-3" />
                                <div className="stepMeta d-flex align-items-start flex-column">
                                  <div className="stepName">Status</div>
                                  <span class="badge text-bg-green">
                                    APPROVED
                                  </span>
                                </div>
                              </div>
                            </div>
                            {/* [/Step 5] */}
                          </div>
                          {/* [/Steps List] */}
                        </div>

                        <div className="row">
                          <div className="col msg-for-order">
                            <div className="card shadow-none">
                              <div className="card-body">
                                <form>
                                  <p>Write Message Concerning Order #BW5522</p>
                                  <div className="row mb-3">
                                    <div className="col-md-6">
                                      <h5>Retailer</h5>
                                      <textarea
                                        className="form-control"
                                        placeholder="Write message here..."
                                      ></textarea>
                                    </div>
                                    <div className="col-md-6">
                                      <h5>Distributer</h5>
                                      <textarea
                                        className="form-control"
                                        placeholder="Write message here..."
                                      ></textarea>
                                    </div>
                                  </div>
                                  <button className="btn btn-purple width-auto">
                                    Send
                                  </button>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* [/History Tab] */}

                  {/* [Document Tab] */}
                  <div
                    class="tab-pane fade"
                    id="document-tab-pane"
                    role="tabpanel"
                    aria-labelledby="order-tab"
                    tabindex="0"
                  >
                    <div className="row mb-3">
                      <div className="col">
                        <div className="filter-row page-top-filter">
                          {/* [Page Filter Box] */}
                          <div className="filter-box justify-content-between w-100">
                            <div>
                              {/* <select className="btn btn-outline-black btn-sm text-start">
                                <option>Invoice #BW5522</option>
                                <option>Order #BW5522</option>
                              </select> */}
                            </div>
                            <div>
                              <button
                                className="btn btn-outline-black mx-2"
                                title="PDF"
                              >
                                <i
                                  class="fa-solid fa-file-pdf"
                                  style={{ color: "red" }}
                                ></i>
                              </button>

                              <button
                                className="btn btn-outline-black mx-2"
                                title="CSV"
                              >
                                <i
                                  class="fa-solid fa-file-csv"
                                  style={{ color: "black" }}
                                ></i>
                              </button>

                              <button
                                className="btn btn-outline-black mx-2"
                                title="Excel"
                              >
                                <i
                                  class="
                                  fa-solid fa-file-excel"
                                  style={{ color: "green" }}
                                ></i>
                              </button>

                              <button className="btn btn-outline-black"  type="button" title="Upload Document" data-bs-toggle="modal"  data-bs-target="#uploadFiles">
                                <i class="fa-solid fa-upload" style={{color: 'blue'}}></i>
                                </button>
                            </div>
                          </div>
                          {/* [/Page Filter Box] */}
                        </div>
                      </div>
                    </div>

                    {/* [Card] */}
                    <div className="card user-card height-100">
                      <div className="card-body p-0">
                      { pdfUrls.length==0?<>"No such data found</>:
                       <>
                       <div className="pdf-download mt-4">
                          
                          <div className="row">
                            { pdfUrls.map((ele, index) => {
                              let path = ele.file_path;
                              // let pathId= path.slice('/')
                              const filename = path.substring(
                                path.lastIndexOf("/") + 1
                              );
                              console.log(
                                "-------------------------",
                                filename
                              );
                              return (
                                <div className="col-md-3">
                                  <div class="card-pdf">
                                    <span class="file-type">
                                      <i
                                        class="fa-solid fa-file-pdf"
                                        style={{
                                          color: "red",
                                          fontSize: "25px",
                                        }}
                                      ></i>
                                    </span>
                                    <p class="file-name m-0">
                                      Invoice #{filename}
                                    </p>
                                    <p class="file-size"></p>
                                    <span class="lock-icon">
                                      <a href={path} download={path}>
                                        <i class="fa-solid fa-download"></i>
                                      </a>
                                    </span>
                                  </div>
                                </div> 
                              );
                            }) }
                        <div className="row">
                          <div className="col">
                            <div className="pdfBox">
                              <div className="pdfList">
                                <img src={pdf} />
                              </div>
                              <div className="pdfList">
                                <img src={pdf} />
                              </div>
                            </div>
                          </div>
                        </div>
                       </>
                       }
                      </div>
                    </div>
                    {/* [/Card] */}
                  </div>
                  {/* [/Document Tab] */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* [Modal] */}
      <div
        class="modal fade"
        id="uploadFiles"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-hidden="true"
        se
      >
        <div class="modal-dialog modal-dialog-centered modal-md">
          <div class="modal-content p-3">
            <div class="modal-header justify-content-start">
              <h6 class="modal-title">Upload Files</h6>
              <hr />
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <h6>Attach invoice form here</h6>
              <div className="dropFile rounded-2">
                <p>
                  Drag and Drop files here or{" "}
                  <a href="#" className="text-purpel">
                    Browse
                  </a>
                </p>
              </div>

              <h6>Upload Files</h6>
              <div className="dropFile rounded-2 border-0 p-3">
                <img src={viewfile} />
                <p className="opacity-50 mt-2">
                  The files you’ll upload <br /> will appear here
                </p>
              </div>
            </div>
            <div class="modal-footer border-0 justify-content-center">
              <button
                type="button"
                class="btn btn-outline-black width-auto"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              &nbsp;&nbsp;
              <button type="button" class="btn btn-purple width-auto">
                Attach File
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* [/Modal] */}
    </div>
  );
};

export default OrderDetail;
