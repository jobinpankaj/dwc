import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  TablePagination,
  tablePaginationClasses as classes,
} from "@mui/base/TablePagination";
import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Sidebar from "../../../CommonComponents/Sidebar/sidebar";
import Header from "../../../CommonComponents/Header/header";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/scss/dashboard.scss";
import useAuthInterceptor from "../../../utils/apis";
import LoadingOverlay from "react-loading-overlay";
import { Button } from "react-admin";




toast.configure();

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

const Requests = () => {
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem("supplier_accessToken");
  const [requestList, setRequestList] = useState("");
  const [updateList, setUpdateList] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true)
  const [openModal, setModalopen] = useState(false)
  const apis = useAuthInterceptor();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAction = (action, target) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        permission: "retailer-view",
      },
    };

    const bodyData = {
      action: action,
    };

    apis
      .post(`/supplier/retailerRequests/${target}/action`, bodyData, config)
      .then((res) => {
        setUpdateList(!updateList);
        if (res.data.success === true) {
          let message;
          if (action == "1") {
            message = "Request Accepted";
          } else {
            message = "Request Rejected";
          }
          toast.success(message, {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        } else {
          toast.error("Could not take action. Please try again later.", {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      })
      .catch((error) => {
        if (error.message !== "revoke") {
          toast.error("Could not take action. Please try again later.", {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      });
  };

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        permission: "retailer-view",
      },
    };

    apis
      .get("/supplier/retailerRequests", config)
      .then((res) => {
        setLoading(false)
        if (res.data.success === true) {
          setRequestList(res.data.data);
        } else {
          toast.error("Could not fetch request list. Please try again later.", {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      })
      .catch((error) => {
        setLoading(false)
        if (error.message !== "revoke") {
          toast.error("Could not fetch request list. Please try again later.", {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      });
  }, [updateList]);

  let data;
  if (rowsPerPage > 0) {
    data = requestList.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  } else {
    data = requestList;
  }

  return (
    <div className="container-fluid page-wrap order-manage">
      <div className="row height-inherit">
        <Sidebar userType={"supplier"} />

        <div className="col main p-0">
          <Header title={t("supplier.request.list.title")} />
          <LoadingOverlay
            active={loading}
            spinner
            styles={{
              overlay: (base) => ({
                ...base,
                background: '#fefefe',
                width: '100%',
                '& svg circle': {
                  stroke: 'black'
                }
              })
            }}
          >
            <div className="container-fluid page-content-box px-3 px-sm-4">
              <div className="row mb-3">
                <div className="col" style={{ display: "hidden" }}>
                  <div
                    className="filter-row page-top-filter"
                    style={{ display: "hidden" }}
                  >
                    <div className="filter-box"></div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="card user-card height-100">
                    <div className="card-body p-0">
                      <div className="row">
                        <div className="col">
                          <div className="table-responsive">
                            <table className="table table-striped m-0">
                              <thead>
                                <tr>
                                  <th>{t("supplier.request.list.table_col1")}</th>
                                  <th>{t("supplier.request.list.table_col2")}</th>
                                  <th>{t("supplier.request.list.table_col3")}</th>
                                  <th>{t("supplier.request.list.table_col4")}</th>
                                  <th>{t("supplier.request.list.table_col5")}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data && data.length > 0 ? (
                                  data.map((ele) => {
                                    let createdAtdt = new Date(ele.created_at);
                                    let createdAtDateBreak = createdAtdt
                                      .toString()
                                      .split(" ");
                                    let createdAt = `${createdAtDateBreak[2]}-${createdAtDateBreak[1]}-${createdAtDateBreak[3]} @ ${createdAtDateBreak[4]}`;
                                    let statusTag;
                                    if (ele.status === "2") {
                                      statusTag = (
                                        <span className="badge text-bg-orange">
                                          PENDING
                                        </span>
                                      );
                                    } else if (ele.status === "1") {
                                      statusTag = (
                                        <span className="badge text-bg-green">
                                          ACCEPTED
                                        </span>
                                      );
                                    } else {
                                      statusTag = (
                                        <span className="badge text-bg-red">
                                          REJECTED
                                        </span>
                                      );
                                    }
                                    return (
                                      <tr>
                                        <td>
                                          {ele.retailer_information.user_profile ? ele.retailer_information.user_profile.business_name ? ele.retailer_information.user_profile.business_name : "N/A" : "N/A"}
                                        </td>
                                        <td>{ele.request_note}</td>
                                        <td>{createdAt}</td>
                                        <td>{statusTag}</td>
                                        <td>
                                          {ele.status === "2" ? (
                                            <>

                                              <span className="m-r-8px " onClick={() => setModalopen(true)}>
                                                <i class="fa-solid fa-eye-slash" style={{ color: 'blue', fontSize: '20px', cursor:'pointer' }}></i>
                                              </span>


                                              {
                                                openModal ? (
                                                  <div className="main_container">
                                                    <div className="header12"  >
                                                      <span></span>
                                                      <span className="">
                                                        <i className="fa fa-eye" aria-hidden="true"></i>
                                                      </span>
                                                      <span onClick={() => setModalopen(false)}  >
                                                        <i className="fa fa-times" aria-hidden="true"></i>
                                                      </span>
                                                    </div>

                                                    <div className="address mt-2">
                                                      <FontAwesomeIcon icon="fa-solid fa-store" />
                                                      &nbsp;<span>This is the Store name</span>
                                                    </div>

                                                    <div className="mx-3 mt-2 custom-list">
                                                      <div className="text-center group-n">Group Name: <span>Rockbrand</span></div>
                                                      <ul className="mt-2">
                                                        <li>
                                                          <i className="fa fa-phone" aria-hidden="true"></i>
                                                          <span>Phone Number</span>
                                                        </li>
                                                        <li>
                                                          <i class="fa-regular fa-envelope"></i>
                                                          <span>Email address</span>

                                                        </li>
                                                        <li>
                                                          <i class="fa-regular fa-envelope-open"></i>
                                                          <span>This is the first line of address, state name Uttar Pradesh</span>
                                                        </li>
                                                      </ul>
                                                      <p>Postal code: <span>201309</span></p>
                                                      <p>Country name: <span>India</span></p>

                                                      <p>Alcohol permit: <span>74209209389</span></p>
                                                      <p>Category: <span>CAD</span></p>
                                                      <p>Tax Number: <span>72309409</span></p>
                                                      <p>QST number: <span>72342734942</span></p>
                                                    
                                                    </div>

                                                    <div className="footer mt-3">
                                                      <button className="content" onClick={() => handleAction("1", ele.id)}>
                                                        <i className="fa fa-check" style={{ fontSize: '20px', color: '#27C26C' }} aria-hidden="true"  ></i>
                                                      </button>
                                                      <button onClick={() => handleAction("0", ele.id)}>
                                                        <i className="fa fa-times" style={{ fontSize: '20px', color: 'red' }} aria-hidden="true"  ></i>
                                                      </button>
                                                    </div>
                                                  </div>) : null
                                              }


                                              &emsp;<span
                                                className="badge action"
                                                onClick={() =>
                                                  handleAction("1", ele.id)
                                                } style={{ color: '#27c26c' }}
                                              >
                                                <i
                                                  className="fa fa-check"
                                                  aria-hidden="true"
                                                ></i>
                                              </span>{" "}
                                              &emsp;<span
                                                className="badge action text-bg-red"
                                                onClick={() =>
                                                  handleAction("0", ele.id)
                                                }
                                              >
                                                <FontAwesomeIcon icon="fa-solid fa-circle-xmark" />
                                              </span>
                                            </>
                                          ) : (
                                            "N/A"
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <>No data to show</>
                                )}
                              </tbody>
                              <tfoot>
                                <tr>
                                  {data.length > 0 ? (
                                    <CustomTablePagination
                                      rowsPerPageOptions={[
                                        5,
                                        10,
                                        15,
                                        { label: "All", value: -1 },
                                      ]}
                                      labelRowsPerPage={t(
                                        "admin.supplier_management.list.pagination_text"
                                      )}
                                      colSpan={11}
                                      count={requestList.length}
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
          </LoadingOverlay>

        </div>
      </div>
    </div>
  );
};

export default Requests;
