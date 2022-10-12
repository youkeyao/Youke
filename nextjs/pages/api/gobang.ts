import { NextApiRequest, NextApiResponse } from "next";
import GoBang from "../../AI/env";
import Net from '../../AI/net';
import Player from '../../AI/mcts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const game = new GoBang(8, 8, req.body.turn);
  game.obs = req.body.data;
  game.judgeEnd();

  let x = 0, y = 0;
  let end = 0;
  if (!game.isEnd) {
    const net = new Net();
    await net.load(`file://./AI/best-model/model.json`);
    const player = new Player((o) => net.predict(o), 64, 5, 400);
    let [move] = player.getAction(game) as any;
    game.step(move);
    move = JSON.parse(move);
    x = Math.floor(move / 8);
    y = move % 8;
    end = game.isEnd ? 1 : 0;
  }
  else {
    end = 2;
  }
  
  res.status(200).json({ x: x, y: y, end: end, score: game.getScore(req.body.turn) });
}