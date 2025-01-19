# Askel.ai task
This approach assumes the dataset is static and given to use beforehand. If it was not, the embeddings could be chunked
and done at demand via an API endpoint.
I also assumed the data would be in the same format across the file.
Saving our data to the database is to avoid re-querying the same data multiple times. This can be a limitation, if no
database option is available. Large data querying can become slow quickly

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

## Improvements

The user input is not cleaned of repeating empty words, same applies for the dataset input. No missing values need to be
handled and like in the case of numerical data, we did not need to find outliers to clean the data.
The approximation of cost of tokens to be used can be calculated and the query token limit set accordingly.
The token limit was chosen arbitrarily. This could be fine-tuned to a better balance between the maximum limit and
costs.
Could use a vector database for embeddings if the content is static enough for better performance.
Further work can be done on our side by querying the API for any keywords or names from a set we have defined, then only
querying those from the database.
If the dataset is too large for simple API queries, RAG could be implemented instead.