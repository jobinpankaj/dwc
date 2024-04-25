import React from "react";
import calendar from "../../assets/images/calender.png";
import filter from "../../assets/images/filter-icon.png";
import downloadPDF from "../../assets/images/download-pdf.png";
import approveTick from "../../assets/images/approveTick(1).png";
import Transit from "../../assets/images/Transit(1).png";
// import Transit from "../../assets/images/Transit.png";
// import delivered from "../../assets/images/delivered.png";
import delivered from "../../assets/images/delivered(1).png";
import Sidebar from "../../../CommonComponents/Sidebar/sidebar";
import Header from "../../../CommonComponents/Header/header";
import "../../assets/scss/dashboard.scss";
import { useState } from "react";
import { useEffect } from "react";
import useAuthInterceptor from "../../../utils/apis";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";
import {
  TablePagination,
  tablePaginationClasses as classes,
} from "@mui/base/TablePagination";
const CustomTablePagination = styled(TablePagination)`
  & .${classes.toolbar} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }

  & .${classes.selectLabel} {
    margin: 0;
  }

  & .${classes.displayedRows} {
    margin: 0;

    @media (min-width: 768px) {
      margin-left: auto;
    }
  }

  & .${classes.spacer} {
    display: none;
  }

  & .${classes.actions} {
    display: flex;
    gap: 0.25rem;
  }
`;
const OrderManagement = () => {
  const apis = useAuthInterceptor();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const token = localStorage.getItem("retailer_accessToken");


  const sigma = "\u03A3";

  function MyComponent() {
    return <div>{sigma}</div>;
  }


  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        permission: `order-view`,
      },
    };
    apis
      .get("retailer/orderListing", config)
      .then((res) => {
        if (res.data) {
          // console.log(object)
          setOrders(res.data.data);
        }
      })
      .catch((err) => {
        if (err.message !== "revoke") {
          toast.error(err.response.data.message, {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  let data;
  if (rowsPerPage > 0) {
    data = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  } else {
    data = orders;
  }

  const totalPrice = (arr) => {
    let total = 0
    // if (arr.length) {
      total = arr.reduce((accumulator, currentValue) => {
        // const accumulatorTotal =
        //   accumulator?.product?.pricing?.unit_price * accumulator?.quantity ||
        //   0;
        const currentValueTotal =
          currentValue?.product?.pricing?.unit_price * currentValue?.quantity ||
          0;
        return accumulator + currentValueTotal;
      },0);
      return total?.toFixed(2);
    // } else {
      // return "0.00"; // or any default value if cartItems is empty
    // }
  };

  return (
    <div className="container-fluid page-wrap order-manage">
      <div className="row height-inherit">
        <Sidebar userType={"retailer"} />

        <div className="col main p-0">
          <Header title={t("retailer.order_management.listing.title")} />
          <div className="container-fluid page-content-box px-3 px-sm-4">
            <div className="row mb-3">
              <div className="col">
                <div className="filter-row page-top-filter justify-content-end">
                  {/* Right Filter */}
                  <div class="dropdown right-filter">
                    <button
                      type="button"
                      class="btn dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      data-bs-auto-close="outside"
                    >
                      <img src={filter} />{" "}
                      {t("retailer.order_management.listing.filter_button")}
                    </button>
                    <form class="dropdown-menu p-3 ">
                      <div class="mb-3">
                        <label class="form-label">
                          {t("retailer.order_management.listing.order_status")}
                        </label>
                        <select className="form-select">
                          <option selected disabled>
                            {t(
                              "retailer.order_management.listing.choose_status"
                            )}
                          </option>
                          <option value="">
                            {t("retailer.order_management.listing.approved")}
                          </option>
                          <option value="">
                            {t("retailer.order_management.listing.cancelled")}
                          </option>
                          <option value="">
                            {t("retailer.order_management.listing.delivered")}
                          </option>
                          <option value="">
                            {t("retailer.order_management.listing.payment")}
                          </option>
                          <option value="">
                            {t("retailer.order_management.listing.on_hold")}
                          </option>
                          <option value="">
                            {t("retailer.order_management.listing.pending")}
                          </option>
                          <option value="">
                            {t("retailer.order_management.listing.shipped")}
                          </option>
                        </select>
                      </div>
                      <div class="mb-3">
                        <label class="form-label">
                          {t("retailer.order_management.listing.supplier")}
                        </label>
                        <select className="form-select">
                          <option selected disabled>
                            {t(
                              "retailer.order_management.listing.choose_supplier"
                            )}
                          </option>
                          <option value="">Supplier 1</option>
                          <option value="">Supplier 2</option>
                          <option value="">Supplier 3</option>
                        </select>
                      </div>
                      <div class="mb-3">
                        <div class="form-check form-check-inline">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="inlineCheckbox1"
                            value="Invoiced"
                          />
                          <label class="form-check-label" for="inlineCheckbox1">
                            {t("retailer.order_management.listing.invoiced")}
                          </label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="inlineCheckbox2"
                            value="Expired"
                          />
                          <label class="form-check-label" for="inlineCheckbox2">
                            {t("retailer.order_management.listing.expired")}
                          </label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="inlineCheckbox3"
                            value="Paid"
                          />
                          <label class="form-check-label" for="inlineCheckbox3">
                            {t("retailer.order_management.listing.paid")}
                          </label>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          type="button"
                          class="btn btn-purple width-auto me-2"
                        >
                          {t("retailer.order_management.listing.apply")}
                        </button>
                        <input
                          type="reset"
                          class="btn btn-outline-black width-auto"
                          value="Clear"
                        />
                      </div>
                    </form>
                  </div>
                  {/* Right Filter */}
                </div>
              </div>
            </div>

 {/* ------Commandes----- */}
 <div className="card user-card my-2 height-100">
              <div className="cmd-data">
                <table>
                  <tr>
                    <td>
                      {sigma}
                      <span>1000</span>
                    </td>
                    <td>
                      <i class="fa-regular fa-clock"></i>
                      <span>60</span>
                    </td>
                    <td>
                      <i class="fa-solid fa-check"></i>
                      <span>990</span>
                    </td>
                    <td>
                      <i class="fa-solid fa-xmark"></i>
                      <span>40</span>
                    </td>
                    <td>
                      <i class="fa-solid fa-sack-dollar"></i>
                      <span>800</span>
                    </td>
                    <td>
                      <i class="fa-solid fa-sack-dollar cancel"></i>
                      <i class="fa-solid fa-ban"></i>
                      <span className="count-cnl">100</span>
                    </td>
                    <td>
                      <i class="fa-solid fa-triangle-exclamation"></i>
                      <span>35</span>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            {/* ----end----- */}

            <div className="row">
              <div className="col">
                {/* [Card] */}
                <div className="card user-card height-100">
                  <div className="card-body p-0">
                    <div className="row">
                      <div className="col">
                        <div className="card-top-filter-box p-3">
                          {/* [Table Search] */}
                          <div className="search-table">
                            <div className="form-group">
                              <input
                                type="text"
                                className="search-input"
                              ></input>
                            </div>
                          </div>
                          {/* [/Table Search] */}

                          {/* [Right Filter] */}
                          <div className="filter-row text-end">
                            {/* [Page Filter Box] */}
                            <div className="filter-box">
                              <a
                                href="#"
                                className="btn btn-outline-black btn-sm"
                              >
                                PDF <img src={downloadPDF} />
                              </a>
                            </div>
                            {/* [/Page Filter Box] */}
                          </div>
                          {/* [/Right Filter] */}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="table-responsive">
                          <table className="table table-striped m-0">
                            <thead>
                              <tr>
                                <th></th>
                                <th>
                                  {t(
                                    "retailer.order_management.listing.order_number"
                                  )}
                                </th>
                                <th>
                                  {t("retailer.order_management.listing.date")}
                                </th>
                                <th className="text-uppercase">
                                  {t(
                                    "retailer.order_management.listing.supplier"
                                  )}
                                </th>
                                <th className="text-center text-uppercase">
                                  {t(
                                    "retailer.order_management.listing.groups"
                                  )}
                                </th>
                                <th className="text-center text-uppercase">
                                  {t(
                                    "retailer.order_management.listing.order_status"
                                  )}
                                </th>
                                <th>
                                  {t(
                                    "retailer.order_management.listing.quantity"
                                  )}
                                </th>
                                <th>
                                  {t("retailer.order_management.listing.price")}
                                </th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {data?.map((order) => (
                                <tr>
                                  <td>
                                    <input type="checkbox" name="" id="" />{" "}
                                  </td>
                                  <td>
                                    <strong>{order?.order_reference}</strong>
                                  </td>
                                  <td>
                                    <div className="dateTimeBox">
                                      <div className="dateRow">
                                        {new Date(order?.created_at)
                                          .toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                          })
                                          .replace(
                                            /(\d+)\/(\d+)\/(\d+), (\d+):(\d+) (AM|PM)/,
                                            "$3-$1-$2 | $4:$5 $6"
                                          )}{" "}
                                        <br />
                                      </div>
                                      <div className="daysCount">{`${Math.floor(
                                        (new Date() -
                                          new Date(order?.created_at)) /
                                          (1000 * 60 * 60 * 24)
                                      )} Days ago`}</div>
                                    </div>
                                  </td>
                                  <td>
                                    <strong>
                                      {
                                        order?.supplier_information
                                          ?.user_profile?.company_name
                                      }
                                    </strong>
                                  </td>
                                  <td>
                                    <div className="order-group-box">
                                      <ul class="list-group list-group-horizontal">
                                        <li
                                          class={`list-group-item border-0 text-center ${
                                            order.status === "Approved" &&
                                            "active"
                                          }`}
                                        >
                                          <span className="d-inline-flex align-items-center justify-content-center">
                                            <img src={approveTick} alt="" />
                                          </span>
                                          <p>
                                            {t(
                                              "retailer.order_management.listing.approved"
                                            )}
                                          </p>
                                        </li>
                                        <li
                                          class={`list-group-item border-0 text-center ${
                                            order.status === "Transit" &&
                                            "active"
                                          }`}
                                        >
                                          <span className="d-inline-flex align-items-center justify-content-center">
                                            <img src={Transit} alt="" />
                                          </span>
                                          <p>
                                            {t(
                                              "retailer.order_management.listing.transit"
                                            )}
                                          </p>
                                        </li>
                                        <li
                                          class={`list-group-item border-0 text-center ${
                                            order.status === "Delivered" &&
                                            "active"
                                          }`}
                                        >
                                          <span className="d-inline-flex align-items-center justify-content-center">
                                            <img src={delivered} alt="" />
                                          </span>
                                          <p>
                                            {t(
                                              "retailer.order_management.listing.delivered"
                                            )}
                                          </p>
                                        </li>

                                        <li
                                          class={`list-group-item border-0 text-center ${order.status === "Payment" &&
                                            "active"
                                            }`}
                                        >
                                          <span className="d-inline-flex align-items-center justify-content-center">
                                            {/* <img src={payment} alt="" /> */}
                                            <i class="fa-solid fa-sack-dollar" style={{color: '#bababa'}}></i>
                                          </span>
                                          <p>
                                            {t(
                                              "retailer.order_management.listing.payment"
                                            )}
                                          </p>
                                        </li>

                                      </ul>
                                    </div>
                                  </td>
                                  <td>
                                    <span className="badge text-bg-purple text-uppercase">
                                      {t(
                                        "retailer.order_management.listing.invoiced"
                                      )}
                                    </span>
                                    &nbsp;&nbsp;
                                    <span className="badge text-bg-green text-uppercase">
                                      {t(
                                        "retailer.order_management.listing.paid"
                                      )}
                                    </span>
                                  </td>
                                  <td>
                                    {order?.items.reduce(
                                      (acc, item) => acc + item?.quantity,
                                      0
                                    )}
                                  </td>
                                  <td>
                                    {totalPrice(order?.items)}
                                    {/* ${(order?.items[0]?.quantity*order?.items[0]?.product?.pricing?.total_price).toFixed(2)} */}
                                    {/* {order.items.reduce(
                                      (acc, item) =>
                                        acc +
                                        Number(item.quantity) *
                                          Number(
                                            item?.pricing?.total_price ||
                                              item.price
                                          ),
                                      0
                                    ).toFixed(2)} */}
                                  </td>
                                  <td>
                                    <div class="btn-group dropstart table-action">
                                      <button
                                        type="button"
                                        class="dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <span></span>
                                      </button>
                                      <ul class="dropdown-menu">
                                        <li className="text-center">
                                          <a
                                            onClick={() =>
                                              navigate(
                                                `/retailer/order-detail/${order.id}`
                                              )
                                            }
                                            className="dropdown-item"
                                          >
                                            <i class="fa-solid fa-eye" style={{ color: 'blue' }}></i>

                                            {/* {t(
                                              "retailer.order_management.listing.view_details"
                                            )} */}
                                          </a>
                                        </li>
                                        <li className="seperator d-flex">
                                          <a className="dropdown-item">
                                            <i class="fa-solid fa-file-pdf" style={{ color: 'red' }}></i>
                                          </a>
                                          <a className="dropdown-item">
                                            <i class="fa-solid fa-file-csv" style={{ color: 'black' }}></i>
                                          </a>
                                          <a className="dropdown-item">
                                            <i class="fa-solid fa-file-excel" style={{ color: 'green' }}></i>
                                          </a>
                                          <i class=""></i>
                                        </li>
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                {orders.length > 5 ? (
                                  <CustomTablePagination
                                    rowsPerPageOptions={[
                                      5,
                                      10,
                                      15,
                                      {
                                        label: t(
                                          "distributor.product_management.all"
                                        ),
                                        value: -1,
                                      },
                                    ]}
                                    labelRowsPerPage={t(
                                      "distributor.product_management.rows_per_page"
                                    )}
                                    colSpan={11}
                                    count={orders.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    size="small"
                                    slotProps={{
                                      select: {
                                        "aria-label": "rows per page",
                                      },
                                      actions: {
                                        showFirstButton: true,
                                        showLastButton: true,
                                      },
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={
                                      handleChangeRowsPerPage
                                    }
                                    sx={{
                                      ".MuiTablePagination-toolbar button": {
                                        backgroundColor: "#623ead",
                                        borderColor: "#623ead",
                                        borderRadius: "25px",
                                        color: "#fefefe",
                                      },

                                      ".MuiTablePagination-toolbar span": {
                                        fontSize: "12px",
                                      },
                                    }}
                                  />
                                ) : (
                                  <></>
                                )}
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* [/Card] */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* [Modal] */}
      <div
        class="modal fade"
        id="assignToShipment"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-hidden="true"
        se
      >
        <div class="modal-dialog modal-dialog-centered modal-sm">
          <div class="modal-content p-3">
            <div class="modal-header justify-content-start">
              <h6 class="modal-title">Assign to shipment</h6>
              <hr />
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p>Assign 1 Order to shipment</p>
              <div className="routeInfo mb-3">Route 1:5 Orders</div>
              <div className="border-purple p-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="radio1"
                  />
                  <label class="form-check-label" for="radio1">
                    New Shipment
                  </label>
                </div>
                <div className="mt-2">
                  <label>Delivery Date</label>
                  <div className="input-group">
                    <input
                      type="date"
                      placeholder=""
                      className="form-control rounded-pill"
                    />
                  </div>
                </div>
              </div>
              <div className="border-purple p-3 mt-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="radio2"
                  />
                  <label class="form-check-label" for="radio2">
                    Existing Shipment
                  </label>
                </div>
                <div className="mt-2">
                  <div className="input-group">
                    <select className="form-select rounded-pill">
                      <option selected disabled>
                        Supplier
                      </option>
                      <option>Supplier 1</option>
                      <option>Supplier 2</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button
                type="button"
                class="btn btn-outline-black width-auto"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              &nbsp;&nbsp;
              <button type="button" class="btn btn-purple width-auto">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* [/Modal] */}
    </div>
  );
};

export default OrderManagement;
