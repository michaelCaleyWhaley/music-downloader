import * as fs from "fs";
import youtubedl from "youtube-dl";

class YoutubeDownloader {
  init = (urlList) => {
    this.multiDownloadStarter(urlList);
  };

  multiDownloadStarter = (urlList) => {
    for (let i = 0; i < urlList.length; i += 1) {
      this.downloadMp3(urlList[i]);
    }
  };

  downloadMp3 = ({ artist, name, link }) => {
    const video = youtubedl(link, ["--format=18"], { cwd: __dirname });

    // Will be called when the download starts.
    video.on("info", function (info) {
      console.log("Download started");
      console.log("filename: " + info._filename);
      console.log("size: " + info.size);
    });

    video.pipe(fs.createWriteStream(`./downloads/${artist}-${name}.mp4`));
    // youtubedl.exec(url, ["-x", "--audio-format", "mp3"], {}, function (
    //   err,
    //   output
    // ) {
    //   if (err) throw err;
    //   console.log(output.join("\n"));
    // });
  };
}

export default YoutubeDownloader;
