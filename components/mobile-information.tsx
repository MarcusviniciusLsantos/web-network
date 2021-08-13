import { kebabCase } from "lodash";
import { useState } from "react";
import { Modal } from "react-bootstrap";

export default function MobileInformation() {
  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      <Modal
        centered
        aria-labelledby={`${kebabCase("WebThreeDialog")}-modal`}
        aria-describedby={`${kebabCase("WebThreeDialog")}-modal`}
        show={true}
      >
        <Modal.Header>
          <Modal.Title>I</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column align-items-center">
            <p className="p mb-0 mt-4 text-center">
              Our web application currently does not support a mobile version.
            </p>
            <p className="p mb-0 mt-4 text-center">
              If you want to use it you must connect to our web application via
              desktop.
            </p>
            <p className="p mb-0 mt-4 text-center">Stay updated on</p>
            <a href="">@bepronet</a>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}
