import { NextApiRequest, NextApiResponse } from "next";

export const getAnim = (id: string, episode: string) => {
  return new Promise<any>((resolve, reject)=> {
    fetch("http://www.dmh8.com/player/" + id + "-0-" + episode + ".html").then((response) => {
      return response.text();
    }).then((data) => {
      const episodeData = data.match(/<div id="playlist1" class="tab-pane fade in active clearfix">([\s\S]*?)<\/div>/)[1];
      resolve({
        src: data.match(/},"url":"([\s\S]*?)"/)[1].replaceAll('\\', ''),
        allEpisodes: episodeData.match(/<li class="col-lg-10 col-md-8 col-sm-6 col-xs-4">([\s\S]*?)<\/li>/g).length
      });
    }).catch((err) => {
      console.log(err);
      reject();
    });
  });
}

export default function anime(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    try {
      fetch("http://www.dmh8.com/search.asp?searchword=" + req.query.q).then((response) => {
        return response.text();
      }).then((data) => {
        const searchData = data.match(/<li class="clearfix">([\s\S]*?)<\/li>/g);
        res.status(200).json((searchData || []).map((item) => {
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
        resolve();
      }).catch((err) => {
        console.log(err);
        res.statusCode = 403;
        res.end();
        reject();
      });
    }
    catch (ex) {
      console.log(ex.stack);
      res.statusCode = 403;
      res.end();
      reject();
    }
  });
}