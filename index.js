const fs = require("fs-extra");

const projectsRoot = "../_www"; // Path to all your projects
const keybaseRoot = "../keybase"; // Path to Keybase directory

const findKeybase = (folder) => {
  let contents = fs.readdirSync(folder);
  if (contents.includes(".keybase")) return `${folder}/.keybase`;
  return contents
    .map((path) => {
      let newPath = `${folder}/${path}`;
      if (!fs.lstatSync(newPath).isDirectory()) return null;
      return findKeybase(newPath);
    })
    .flat()
    .filter((e) => e);
};

const getDotKeybaseFile = (file) => {
  const content = fs
    .readFileSync(file, "utf-8")
    .split("\n")
    .filter((e) => e)
    .filter((e) => e.charAt(0) !== "#");
  content.push(".keybase");
  content.forEach((e) => {
    let destination = `${keybaseRoot}${file.split(projectsRoot)[1]}`.replace(
      "/.keybase",
      `/${e}`
    );
    let source = file.replace("/.keybase", `/${e}`);
    fs.copySync(source, destination);
  });
};

findKeybase(projectsRoot).forEach((file) => getDotKeybaseFile(file));
