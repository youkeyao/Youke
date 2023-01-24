import { NextApiRequest, NextApiResponse } from "next";

export const getAnim = (id: string, source: number, episode: string) => {
  return new Promise<any>((resolve, reject)=> {
    fetch("http://www.dmh8.me/player/" + id + "-" + source + '-' + episode + ".html").then((response) => {
      return response.text();
    }).then((data) => {
      const sourceData = data.match(/<ul class="nav nav-tabs active">([\s\S]*?)<\/ul>/)[1];
      const episodeData = data.match(new RegExp("<div id=\"playlist" + (source + 1) + "\"([\\s\\S]*?)</div>"))[1];
      resolve({
        title: data.match(new RegExp("<a class=\"text-fff\" href=\"/view/" + id + ".html\">([\\s\\S]*?)</a>"))[1],
        src: data.match(/},"url":"([\s\S]*?)"/)[1].replaceAll('\\', ''),
        sources: sourceData.match(/<li([\s\S]*?)<\/li>/g).map(v => v.match(/<a href="#([\s\S]*?)"/)[1]).sort(),
        episodes: episodeData.match(/<a([\s\S]*?)<\/a>/g).map(v => v.match(/>([\s\S]*?)<\/a>/)[1]),
      });
    }).catch((err) => {
      console.log(err);
      reject();
    });
  });
}

export const searchAnim = (q: string | string[]) => {
  return new Promise<any>((resolve, reject) => {
    fetch("http://www.dmh8.me/search.asp?searchword=" + q).then((response) => {
      return response?.text();
    }).then((data) => {
      const searchData = data.match(/<li class="clearfix">([\s\S]*?)<\/li>/g);
      resolve((searchData || []).map((item) => {
        return {
          title: item.match(/title="([\s\S]*?)"/)[1],
          cover: item.match(/data-original="([\s\S]*?)"/)[1],
          director: item.match(/<p><span class="text-muted">导演：<\/span>([\s\S]*?)<\/p>/)[1],
          star: item.match(/<p><span class="text-muted">主演：<\/span>([\s\S]*?)<\/p>/)[1],
          year: item.match(/<span class="text-muted hidden-xs">年份：<\/span>([\s\S]*?)<\/p>/)[1],
          id: item.match(/<h4 class="title"><a class="searchkey" href="\/view\/([\s\S]*?).html">/)[1],
          intro: item.match(/<span class="text-muted">简介：<\/span>([\s\S]*?)<a/)[1]
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