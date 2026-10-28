# excel-parser-api

Express + MongoDB API that turns spreadsheet data with multi-row (merged) headers into nested JSON, and stores uploaded tables as versioned files.

## What it does

- **Excel → nested JSON.** Takes a sheet as a 2D array of cells. The header rows become a tree: a header cell that has sub-headers underneath it turns into an object key, and the bottom-level headers become keys holding that row's values. Every data row comes out as one nested object (see [src/util/excel-parser](src/util/excel-parser)).
- **Versioned storage.** A *file* holds a list of *versions*. Each version points at its own Mongo collection holding the table rows. You can list files, list a file's versions, read a version's rows, and delete a version or a whole file (its collections are dropped too).

### Example

Input (`data`), where the first two rows are headers:

```json
[
  ["Name", "Phase", ""],
  ["",     "Start", "End"],
  ["Alpha", "Jan",  "Mar"]
]
```

Output:

```json
[{ "Name": "Alpha", "Phase": { "Start": "Jan", "End": "Mar" } }]
```

## API

Base path: `/api/v1/projects`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/` or `/json` | Body `{ "data": [[...], ...] }` → returns the nested JSON |
| GET | `/` | List all files |
| GET | `/:fileId` | List the versions of a file |
| DELETE | `/:fileId` | Delete a file, its versions and their collections |
| GET | `/:fileId/:versionId` | Rows stored for a version |
| DELETE | `/:fileId/:versionId` | Delete a version and its collection |

Errors come back as a JSON message, e.g. `FILE_NOT_FOUND`, `VERSION_NOT_FOUND`.

## Running

Locally (needs MongoDB):

```sh
npm install
npm start
```

With Docker (API on http://localhost:80, Mongo on 27017):

```sh
docker-compose up --build
```

### Configuration

Set through environment variables ([config/default.js](config/default.js)):

| Variable | Default |
|----------|---------|
| `MONGO_URI` | `mongodb://localhost:27017/uploads` |
| `PORT` | `80` |
| `HOST` | `0.0.0.0` |

CORS only allows `http://localhost:4200` (the Angular frontend).
