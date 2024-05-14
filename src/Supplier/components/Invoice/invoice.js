import React, { useEffect, useState } from "react";
import Sidebar from "../../../CommonComponents/Sidebar/sidebar";
import Header from "../../../CommonComponents/Header/header";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from 'react-bootstrap/Card';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from 'react-bootstrap/Container';
import generateReportImage from "../../assets/images/generate-report-icon.svg";
import apis from "../../../CommonComponents/apis";
import { toast } from "react-toastify";
// import ReportsModal from "./Partials/ReportsModal";

const token = localStorage.getItem("supplier_accessToken");
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
    permission: "reports-view",
  },
};
const url = "";

const Invoice = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // call to fetch data
  const fetchData = () => {
    apis
      .get(url, config)
      .then((res) => {
        setLoading(false);
        if (res.data.success === true) {
          setData(res.data.data);
        } else {
          toast.error("Something went wrong. Please try again later.", {
            autoClose: 2000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.message !== "revoke") {
          toast.error("Something went wrong. Please try again later.", {
            autoClose: 2000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      });
  };

  // uncomment to enable api call on loading
  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <>
      <div className="container-fluid page-wrap product-manage">
        <div className="row height-inherit">
          <Sidebar userType={"supplier"} />

          <div className="col main p-0">
            <Header title="Reports" />
            <div className="container-fluid page-content-box px-3 px-sm-4">
              <div className="row">
                <div className="col">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-sm-8 mb-4 mb-sm-0">
                          Products
                          <hr />

                          <Container>
                               <Row>
                                 <Col xs={6} md={4}>
                                 <Card className="row-card1">
                                 <Card.Body>
                                   <Card.Title>Card Title</Card.Title>
                                   <Card.Text>
                                  --
                                   </Card.Text>
                                   <Button variant="primary">Go somewhere</Button>
                                 </Card.Body>
                               </Card>
                                 </Col>
                                 <Col xs={6} md={4}>
                                 <Card className="row-card2">
                                 <Card.Body>
                                   <Card.Title>Card Title</Card.Title>
                                   <Card.Text>
                                  --
                                   </Card.Text>
                                   <Button variant="primary">Go somewhere</Button>
                                 </Card.Body>
                                 </Card>
                                 </Col>
                                 <Col xs={6} md={4}>
                                 <Card className="row-card3">
                                 <Card.Body>
                                   <Card.Title>Card Title</Card.Title>
                                   <Card.Text>
                                --
                                   </Card.Text>
                                   <Button variant="primary">Go somewhere</Button>
                                 </Card.Body>
                                 </Card>
                                 </Col>

                               </Row>
                             </Container>


                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;
