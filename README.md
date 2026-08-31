# AnthraCore Insights

I've uploaded 3 sample documents (sample_doc_1_production_report.jpg, sample_doc_2_spreadsheet.jpg, sample_doc_3_historical_archive.jpg). On the Upload & Process screen, replace the generic upload button with 3 preset cards: 'CMPDI Production Report (PDF)', 'Production Master Sheet (XLSX)', 'GSI 1998 Archive Scan (PDF)' — each showing a thumbnail of its respective image. Clicking one starts the fake processing animation using that document. When 'CMPDI Production Report' is processed, the extracted table should show a Feb-25 row with Production 5.10 MT and OB Removal 6.55 flagged amber/Needs Review — matching the asterisked provisional figures in the source image. When 'Production Master Sheet' is processed, flag the WCL Umrer Colliery row (0.82 MT, status Under Review) the same way. On the Ask AnthraCore screen, add a preset question chip: 'What is the reserve estimate for Talcher Coalfield?' When clicked, show the answer: 'Approximately 705 million tonnes (indicated + inferred), based on 1997-98 exploratory drilling across BH-101 to BH-149. [Source: GSI Report GSI/TC/1998-99/EX-07]' and make the citation open a modal showing the sample_doc_3_historical_archive.jpg image with the reserve estimate line visually highlighted. Make every source citation pill clickable across all screens. Clicking it opens a modal with the relevant document image (use the 3 uploaded sample docs matched by source name) at readable size, with a caption showing the doc reference number.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/17f0e79d-c643-4636-8003-e535a571f80e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
