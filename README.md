# Babelfish

This is a GraphQL gateway to crypto

## Dev instructions

Run
`yarn` to install the dependencies
`yarn dev` to start the graphQL server
`yarn dev:schema` to start the typegen/schema gen

## Docker

### Build
`docker build . -t babelfish`

### Run with docker run
`docker run --rm -p 3000:3000 -it babelfish`

### Run with docker compose
`docker compose up`
