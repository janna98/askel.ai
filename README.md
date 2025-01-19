# Askel.ai task

## Running the server

The server run script setups all data necessary and the database should be pre-seeded with necesary data. To run the dev
server:

```shellscript
npm run dev
```

If starting from scratch, the migrations should be run with

```shellscript
npx prisma migrate dev
```

After that, the necessary data is re-seeded when the server is started up.
