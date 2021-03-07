import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { Modal, Button, InputGroup, FormControl } from "react-bootstrap";
import { useParams } from "react-router-dom";

import canvasState from "../store/canvasState";
import toolState from "../store/toolState";

import "../style/canvas.scss";

const Canvas = observer(() => {
  const canvasRef = useRef();
  const usernameRef = useRef();

  const [modal, setModal] = useState(true);

  const params = useParams();

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
  }, []);

  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket(`ws://localhost:5000/`);

      socket.onopen = () => {
        console.log("Подключение установлено");
        socket.send(
          JSON.stringify({
            id: params.id,
            username: canvasState.username,
            method: "connection",
          })
        );
      };
      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        switch (msg.method) {
          case "connection":
            console.log(`пользователь ${msg.username} присоединился`);
            break;
        }
      };
    }
  }, [canvasState.username]);

  const mouseDownHandler = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL());
  };

  const connectHandler = () => {
    canvasState.setUsername(usernameRef.current.value);
    setModal(false);
  };

  return (
    <div className="canvas">
      <Modal show={modal} onHide={() => {}}>
        <Modal.Header>
          <Modal.Title>Введите ваше имя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
              ref={usernameRef}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => connectHandler()}>
            Войти
          </Button>
        </Modal.Footer>
      </Modal>

      <canvas
        onMouseDown={() => mouseDownHandler()}
        ref={canvasRef}
        width={600}
        height={400}
      />
    </div>
  );
});

export default Canvas;
