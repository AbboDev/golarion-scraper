# Golarion Scraper

A Node.js scraper built for golarion.altervista.org

## Requirements

- Node 20
- Git

## Setup

Clone the repo and install the dependencies.

```shell
git clone https://github.com/AbboDev/golarion-scraper.git
cd golarion-scraper
```

```shell
npm install
```

Copy the `.example.env` into `.env` and assign the correct constants.

## Start

To fetch the homepage, launch:

```shell
npm run start
```

Otherwise, to fetch any other page, launch:

```shell
npm run start -- --url <YOUR_URL>
```

For example, to fetch the "Razze" page, you launch:

```shell
npm run start -- --url /Razze
```
