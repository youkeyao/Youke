import { NextApiRequest, NextApiResponse } from "next";
import GoBang from "../../AI/env";
import Net from '../../AI/net';
import Player from '../../AI/mcts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const game = new GoBang(15, 15, req.body.turn);
  game.obs = req.body.data;
  game.judgeEnd();

  let x = 0, y = 0;
  if (!game.isEnd) {
    const net = new Net();
    await net.load(`file://./AI/model-100/model.json`);
    const player = new Player((o) => net.predict(o), 225, 5, 400);
    let [move] = player.getAction(game) as any;
    game.step(move);
    move = JSON.parse(move);
    x = Math.floor(move / 15);
    y = move % 15;
  }
  
  res.status(200).json({ x: x, y: y, end: game.isEnd, score: game.score });
}