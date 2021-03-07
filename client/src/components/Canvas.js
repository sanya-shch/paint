import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { Modal, Button, InputGroup, FormControl } from "react-bootstrap";
import { useParams } from "react-router-dom";

import canvasState from "../store/canvasState";
import toolState from "../store/toolState";

import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import Eraser from "../tools/Eraser";

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

      canvasState.setSocket(socket);
      canvasState.setSessionId(params.id);

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
          case "draw":
            drawHandler(msg);
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

  const drawHandler = (msg) => {
    const figure = msg.figure;
    console.log(figure.type);
    const ctx = canvasRef.current.getContext("2d");
    switch (figure.type) {
      case "brush":
        Brush.draw(ctx, figure.x, figure.y);
        break;
      case "rect":
        Rect.staticDraw(
          ctx,
          figure.x,
          figure.y,
          figure.width,
          figure.height,
          figure.color
        );
        break;
      case "eraser":
        Eraser.draw(ctx, figure.x, figure.y);
        break;
      case "finish":
        ctx.beginPath();
        break;
    }
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
