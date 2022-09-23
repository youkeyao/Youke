import React, { CSSProperties, MouseEvent, useEffect, useRef, useState } from 'react';
import styles from '../styles/Gobang.module.css'

const CANVAS_SIZE = 800;
const GRID_NUM = 15;
const GRID_SIZE = CANVAS_SIZE / (GRID_NUM + 1);

const ChessPiece = ({ style, size, x, y, turn }: {
  style?: CSSProperties,
  size: number,
  x: number,
  y: number,
  turn: 'white' | 'black'
}) => {
  return (
    <div className={styles.chesspiece} style={{
      width: size * 2 / 3,
      height: size * 2 / 3,
      top: size * (y + 1),
      left: size * (x + 1),
      background: `radial-gradient(circle at 30% 30%, ${turn === 'white' ? '#fff, #888' : '#444, #000'})`,
      boxShadow: `${size / 25}px ${size / 25}px ${size / 25}px #888`,
      ...style
    }}></div>
  )
}

export default function Gobang() {
  const [nowX, setX] = useState<number>(-2);
  const [nowY, setY] = useState<number>(-2);
  const [size, setSize] = useState<number>(0);
  const [isStart, setIsStart] = useState<boolean>(false);
  const [myTurn, setMyTurn] = useState<'white' | 'black'>('black');
  const [nowTurn, setNowTurn] = useState<'white' | 'black'>('black');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const turnRef = useRef<'white' | 'black'>('black');
  const recordRef = useRef(Array.from(Array(GRID_NUM), _ => Array(GRID_NUM).fill(0)));

  const handleMouseMove = (e: MouseEvent) => {
    if (!isStart) return;
    const offsetX = e.nativeEvent.offsetX;
    const offsetY = e.nativeEvent.offsetY;
    const clientSize = size / (GRID_NUM + 1);
    if (
      clientSize / 2 <= offsetX && offsetX <= size - clientSize / 2 &&
      clientSize / 2 <= offsetY && offsetY <= size - clientSize / 2
    ) {
      const x = ~~((offsetX - clientSize / 2) / clientSize);
      setX(x);
      const y = ~~((offsetY - clientSize / 2) / clientSize);
      setY(y);
    }
    else {
      setX(-2);
      setY(-2);
    }
  };

  const handleClick = () => {
    if (!isStart) return;
    if (turnRef.current === myTurn) {
      if (nextStep(nowX, nowY)) {
        getAction();
      }
    }
  }

  const getAction = () => {
    fetch('/api/gobang', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        turn: turnRef.current === 'white' ? -1 : 1,
        data: recordRef.current
      })
    }).then(res => {
      return res.json();
    }).then(data => {
      if (data.score) {
        setIsStart(false);
      }
      else {
        nextStep(data.x, data.y);
      }
    });
  }

  const nextStep = (x: number, y: number) => {
    if (recordRef.current[x][y]) return false;
    recordRef.current[x][y] = turnRef.current === 'white' ? -1 : 1;
    turnRef.current = turnRef.current === 'white' ? 'black' : 'white';
    setNowTurn(turnRef.current);
    return true;
  }

  const startGame = () => {
    recordRef.current = Array.from(Array(GRID_NUM), _ => Array(GRID_NUM).fill(0));
    setIsStart(true);
    turnRef.current = 'black';
    setNowTurn('black');
    if (myTurn === 'white') getAction();
  }

  useEffect(() => {
    setSize(canvasRef.current.offsetWidth);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#b89971';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      for (let i = 1; i <= GRID_NUM; i ++) {
        ctx.moveTo(i * GRID_SIZE + 0.5, GRID_SIZE + 0.5);
        ctx.lineTo(i * GRID_SIZE + 0.5, ctx.canvas.height - GRID_SIZE + 0.5);
        ctx.stroke();

        ctx.moveTo(GRID_SIZE + 0.5, i * GRID_SIZE + 0.5);
        ctx.lineTo(ctx.canvas.width - GRID_SIZE + 0.5, i * GRID_SIZE + 0.5);
        ctx.stroke();
      }
    }
  }, []);

  return (
    <div className={styles.main}>
      <p className={styles.title}>Gobang</p>
      <div className={styles.chessboard} onClick={handleClick}>
        <canvas
          style={{maxWidth: '100%', maxHeight: '100%'}}
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onMouseMove={handleMouseMove}
        />
        <ChessPiece
          size={size / (GRID_NUM + 1)}
          x={(GRID_NUM - 1) / 2}
          y={-0.5}
          turn={nowTurn}
        />
        <ChessPiece
          style={{opacity: 0.5}}
          size={size / (GRID_NUM + 1)}
          x={nowX}
          y={nowY}
          turn={myTurn}
        />
        {new Array(GRID_NUM * GRID_NUM).fill(0).map((_, index) => {
          const [x, y] = [Math.floor(index / GRID_NUM), index % GRID_NUM];
          if (recordRef.current[x][y] === 1) {
            return <ChessPiece
              key={index}
              size={size / (GRID_NUM + 1)}
              x={x}
              y={y}
              turn={'black'}
            />;
          }
          else if (recordRef.current[x][y] === -1) {
            return <ChessPiece
              key={index}
              size={size / (GRID_NUM + 1)}
              x={x}
              y={y}
              turn={'white'}
            />;
          }
        })}
      </div>
      <div></div>
      {isStart ? null :
        <div className={styles.ui}>
          <a className={styles.button} onClick={startGame}>Start Game</a>
          <a className={styles.button} onClick={() => setMyTurn((turn) => turn === 'white' ? 'black' : 'white')}>
            <ChessPiece
              style={{ position: 'relative', transform: 'translate(0, 0)' }}
              size={size / GRID_NUM}
              x={-1}
              y={-1}
              turn={myTurn}
            />
          </a>
        </div>
      }
    </div>
  )
}