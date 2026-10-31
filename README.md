# Internship Job Tracker

A small web app to manage internship applications, based on the supplied project report.

## Features
- Student registration using name and roll number
- Add company, role, location, stipend, applied date, deadline, application link and notes
- Six statuses: Saved, Applied, Online Test, Interview, Offer and Rejected
- Dashboard counts, search and status filter
- Update status and delete an application
- JSON-file persistence in `data/db.json`
- Server-side validation and duplicate prevention

## Requirements
Install Node.js LTS (includes npm): https://nodejs.org/

## Run locally
1. Extract the ZIP.
2. Open the extracted `internship-job-tracker` folder in VS Code.
3. Open Terminal > New Terminal.
4. Run `npm install`.
5. Run `npm start`.
6. Open http://localhost:3000 in your browser. Keep the terminal running while using the app.

Stop the server with Ctrl+C.

## Upload to GitHub using Git
Create an empty repository on GitHub, then open a terminal in this project folder and run:

```bash
git init
git add .
git commit -m "Initial commit: Internship Job Tracker"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/internship-job-tracker.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. You can also upload the extracted files using the repository's Add file > Upload files option. Upload the contents of the folder, not just the ZIP.

## Project structure
```text
internship-job-tracker/
├── data/db.json
├── public/index.html
├── public/tracker.html
├── public/style.css
├── .gitignore
├── package.json
├── README.md
├── server.js
└── statuses.js
```

## Limitations and safety
This is a learning/demo version. It does not have password authentication or verify roll numbers. Anyone who knows a roll number may be able to request that student's records. Do not deploy it with real personal data until proper authentication and access controls are added. GitHub stores your source code; it does not run the Express server or make the site live automatically. JSON storage is suitable for a local demo, not a multi-user production deployment.
