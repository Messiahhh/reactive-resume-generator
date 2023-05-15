#!/usr/bin/env node
import puppeteer from "puppeteer";
import { writeFile } from "fs/promises";
import path from "path";
import { PDFDocument } from "pdf-lib";

// reactive-resume 在线简历地址
const url = process.argv[2];

if (!url) {
  throw new Error(
    `请传入形如https://rxresu.me/zh/akara/resume的reactive-resume在线简历地址`
  );
}

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle0" });
  await page.waitForSelector("html.wf-active");

  const pageFormat = await page.$$eval("[data-page]", (pages) =>
    pages[0].getAttribute("data-format")
  );

  const resumePages = await page.$$eval("[data-page]", (pages) =>
    pages.map((page, index) => ({
      pageNumber: index + 1,
      innerHTML: page.innerHTML,
      height: page.clientHeight,
    }))
  );

  const pdf = await PDFDocument.create();

  for (let index = 0; index < resumePages.length; index++) {
    await page.evaluate(
      (page) => (document.body.innerHTML = page.innerHTML),
      resumePages[index]
    );

    const buffer = await page.pdf({
      printBackground: true,
      height: resumePages[index].height,
      width: pageFormat === "A4" ? "210mm" : "216mm",
    });

    const pageDoc = await PDFDocument.load(buffer);
    const copiedPages = await pdf.copyPages(pageDoc, [0]);

    copiedPages.forEach((copiedPage) => pdf.addPage(copiedPage));
  }

  await page.close();
  const buffer = await pdf.save();
  await writeFile(path.resolve("./resume.pdf"), buffer);
  console.log("生成生成resume.pdf");
  await browser.close();
})();
