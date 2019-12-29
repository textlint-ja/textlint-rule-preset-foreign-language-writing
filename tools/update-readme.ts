// MIT © 2016 azu
"use strict";
import fs from "fs";
import path from "path";

import { getPackages } from "@monorepo-utils/package-utils";
import { PackageResult } from "@monorepo-utils/package-utils/lib/get-packages";

const addMarkdown = require("add-text-to-markdown");
const SectionName = "ルール一覧";
const escapeMarkdown = (text: string) => {
    return text.replace(/([\[])/g, "\\$1");
};
const RootDirectory = path.join(__dirname, "..");
const createPackageList = (item: PackageResult) => {
    const relativePath = path.relative(RootDirectory, item.location);
    return `### [${escapeMarkdown(item.packageJSON["name"])}](${relativePath})

> ${escapeMarkdown(item.packageJSON["description"])}
`;
};
const packagePathList = getPackages(RootDirectory).filter(item => {
    return !/-helper$/.test(item.location);
});
const items = packagePathList.map(item => createPackageList(item)).join("\n\n");
const README_PATH = path.join(__dirname, "..", "README.md");
const README = fs.readFileSync(README_PATH, "utf-8");
const UpdatedREADM = addMarkdown(README, items, SectionName);
fs.writeFileSync(README_PATH, UpdatedREADM, "utf-8");
