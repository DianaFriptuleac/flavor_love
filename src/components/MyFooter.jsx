import { Col, Container, Row } from "react-bootstrap";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";
import { FaRegCopyright } from "react-icons/fa6";
import "../css/MyFooter.css";
const MyFooter = () => {
  return (
    <Container fluid className="myFooter">
      <Row className="justify-content-center align-items-center text-center">
        <Col xs={12} md={2} className="d-flex justify-content-center my-2 ">
          <img
            src="/aglio.webp"
            style={{ width: "90px", height: "70px" }}
            alt="Logo"
          />
        </Col>
        <Col xs={12} md={2} className="text-secondary my-2">
          <div className="d-flex align-items-center">
            <FaFacebookSquare className="me-1" />{" "}
            <p className="mb-0">Facebook</p>
          </div>
          <div className="d-flex align-items-center">
            <FaInstagram className="me-1" /> <p className="mb-0">Instagram</p>
          </div>
          <div className="d-flex align-items-center">
            <FaYoutube className="me-1" /> <p className="mb-0"> YouTube</p>
          </div>
          <div className="d-flex align-items-center">
            <FaTiktok className="me-1" /> <p className="mb-0">TikTok</p>
          </div>
        </Col>
        <Col xs={12} md={2} className="text-secondary my-2">
          <p className="mb-0 d-flex align-items-center">Privacy</p>
          <p className="mb-0 d-flex align-items-center">Cookie Policy</p>
          <p className="mb-0 d-flex align-items-center">
            <FaRegCopyright className="me-1" /> 2024 Flavor Love{" "}
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default MyFooter;
