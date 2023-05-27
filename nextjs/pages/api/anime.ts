import { NextApiRequest, NextApiResponse } from "next";

export const getAnim = (id: string, source: number, episode: string) => {
  return new Promise<any>((resolve, reject)=> {
    fetch("https://www.dmttang.com/vodplay/" + id + "-" + source + '-' + episode + ".html").then((response) => {
      return response.text();
    }).then((data) => {
      resolve({
        title: data.match(new RegExp("<a href=\"/voddetail/" + id + ".html\" title=\"([\\s\\S]*?)\">"))[1],
        src: data.match(/<div class="player-wrapper">([\s\S]*?)<\/div>/)[1].match(/url":"([\s\S]*?)"/)[1].replaceAll("\\", ""),
        sources: data.match(/<div class="module-tab-content">([\s\S]*?)<div class="shortcuts-mobile-overlay">/)[1].split("module-tab-item").length - 1,
        episodes: parseInt(data.match(/<div class="module-tab-item tab-item selected"([\s\S]*?)<\/div>/)[1].match(/<small>([\d]*?)<\/small>/)[1]),
      });
    }).catch((err) => {
      console.log(err);
      reject();
    });
  });
}

export const searchAnim = (q: string | string[]) => {
  return new Promise<any>((resolve, reject) => {
    fetch("https://www.dmttang.com/vodsearch.html?wd=" + q).then((response) => {
      return response?.text();
    }).then((data) => {
      const searchData = data.match(/<div class="module-items">([\s\S]*?)<\/main>/g)[0].split("module-search-item");
      resolve((searchData.slice(1)).map((item) => {
        return {
          title: item.match(/alt="([\s\S]*?)"/)[1],
          cover: "https://www.dmttang.com" + item.match(/data-src="([\s\S]*?)"/)[1],
          director: item.match(/导演：<\/span>([\s\S]*?)<\/div>/)[1].match(/target="_blank">([\s\S]*?)<\/a>/)[1],
          star: item.match(/主演：<\/span>([\s\S]*?)<\/div>/)[1].match(/target="_blank">([\s\S]*?)<\/a>/)[1],
          year: item.match(/target="_blank">([\d]*?)<\/a>/)[1],
          id: item.match(/href="\/voddetail\/([\d]*?).html"/)[1],
          intro: item.match(/<div class="video-info-item">([\s\S]*?)<\/div>/)[1]
        };
      }));
    }).catch((err) => {
      console.log(err);
      reject();
    });
  });
}

export default function anime(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    searchAnim(req.query.q).then((data) => {
      res.status(200).json(data);
      resolve();
    }).catch((err) => {
      console.log(err);
      res.statusCode = 403;
      res.end();
      reject();
    });
  });
}