# Living Papers Builder

A web-based interface for compiling [Living Papers](https://github.com/uwdata/living-papers) documents. This tool provides a graphical interface for Living Papers compilation instead of command-line operations.

## Installation Guide

Install nvm using Homebrew:

```bash
brew install nvm
```

Install Node.js v18.1.0:

```bash
nvm install v18.1.0
nvm use v18.1.0
```

Install Pandoc v2.18 from the [official release](https://github.com/jgm/pandoc/releases/tag/2.18).

Install R from [CRAN](https://cloud.r-project.org/) and required packages:

```R
install.packages(c("knitr", "tidyverse", "jsonlite", "svglite"))
```

Install LaTeX environment from [MacTeX](https://www.tug.org/mactex/mactex-download.html).

Clone and set up the Living Papers project:

```bash
git clone https://github.com/uwdata/living-papers.git
cd living-papers
npm install
npm run build
npm run test

cd packages/web-server
npm install
cd client && npm install
cd ../server && npm install
```

## Usage

Start the development server from the web-server directory:

```bash
cd living-papers/packages/web-server
npm run dev
```

Access the web interface at http://localhost:5173/ and the server at [http://localhost:3000](http://localhost:3000/).

The web interface allows you to:

- Upload Markdown papers through drag-and-drop or file selection
- Include supplementary files like images and PDFs
- Upload multiple files via zip archives
- Preview and download compiled papers
- Compile papers without using command line

## Project Structure

The web builder is organized within the Living Papers project:

```
living-papers/
└── packages/
    └── web-server/
        ├── client/     # React frontend
        ├── server/     # Node.js backend
        └── package.json
```

## Screenshots

User Interface:

<img src="./img-1.png" alt="img-1" style="zoom:50%;" />

Uploading and Downloading:

<img src="./img-2.png" alt="img-2" style="zoom:50%;" />

# Living Papers

Authoring tools for scholarly communication.
Create interactive web pages or formal research papers from markdown source.
Living Papers is intended to be a "language toolkit" for parsing, transforming, and rendering documents.

To get up and running quickly, use the [Living Papers project template](https://github.com/uwdata/living-papers-template/).
Then take a look at other [example articles](https://github.com/uwdata/living-papers/tree/main/examples).

This repo is a research testbed for Living Papers development. There will be bugs. Contributions (issues, PRs, etc) are welcome!

## Background

For more about Living Papers' motivation and development please see the **[Living Papers UIST'23 paper](https://github.com/uwdata/living-papers-paper)** and **[overview video](https://www.youtube.com/watch?v=5-4wd3dVtEk)**.

To cite Living Papers in research publication, please use the following citation data:

``` bibtex
@inproceedings{heer2023living,
  author = {Heer, Jeffrey and Conlen, Matthew and Devireddy, Vishal and Nguyen, Tu and Horowitz, Joshua},
  title = {Living Papers: A Language Toolkit for Augmented Scholarly Communication},
  year = {2023},
  url = {https://doi.org/10.1145/3586183.3606791},
  doi = {10.1145/3586183.3606791},
  booktitle = {Proceedings of the 36th Annual ACM Symposium on User Interface Software and Technology},
  articleno = {42},
  numpages = {13},
  series = {UIST '23}
}
```

## Setup

### Pre-Requisites

Before working with Living Papers, set up your local environment:

1. Install [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) if you don't have them already. We recommend using a node version manager like [nvm](https://github.com/nvm-sh/nvm). Node v16.17 or higher is recommended.
2. Install [pandoc](https://pandoc.org/installing.html). You should be able to run `pandoc` from the command line. A recent version of Pandoc (v2.18 or higher) is recommended.
3. Install other software packages as needed:
  - To use R code blocks, install [R](https://cloud.r-project.org/) along with the `knitr` package and any other libraries you wish to use.
  - To publish LaTeX / PDF output, install a TeX distribution such as [TeX Live](https://www.tug.org/texlive/). You should be able to run `pdflatex` and `bibtex` from the command line.

### Usage Instructions

To use Living Papers for a new publishing project, you can install the `@living-papers/cli` npm package, which provides the `lpub` utility to convert source to output documents.

That said, we recommend copying the [project template repo](https://github.com/uwdata/living-papers-template/) for a pre-configured authoring setup.

### Developer Instructions

Clone this monorepo, run `npm install` to install JavaScript dependencies.

Once installed, you can:
- Run `npm run build` to build the monorepo package exports.
- Run `npm run test` to run test cases across monorepo packages.
- Run `npm run lint` to lint source code across monorepo packages.
- Run `npx lpub filename.md` to compile a source file in the current directory.

The [`examples`](https://github.com/uwdata/living-papers/tree/main/examples) folder contains example Living Papers articles. Within the folder for each example, run `npm run build` to produce compiled output article(s). Be sure to run `npm run build` at the monorepo level before trying to build examples.

## Package Overview

This repository uses a [monorepo](https://en.wikipedia.org/wiki/Monorepo) organization. Here is an overview of the folder structure:

- [`examples`](https://github.com/uwdata/living-papers/tree/main/examples): Example Living Papers articles
- [`packages`](https://github.com/uwdata/living-papers/tree/main/packages): Primary Living Papers packages
  - [`ast`](https://github.com/uwdata/living-papers/tree/main/packages/ast): Abstract Syntax Tree (AST) manipulation
  - [`cli`](https://github.com/uwdata/living-papers/tree/main/packages/cli): Command line interface programs
  - [`compiler`](https://github.com/uwdata/living-papers/tree/main/packages/compiler): Article parser and compiler
  - [`components`](https://github.com/uwdata/living-papers/tree/main/packages/components): Web components for HTML output
  - [`runtime`](https://github.com/uwdata/living-papers/tree/main/packages/runtime): Reactive runtime for HTML output
  - [`runtime-compiler`](https://github.com/uwdata/living-papers/tree/main/packages/runtime-compiler): JavaScript parser/compiler for the reactive runtime
- [`templates`](https://github.com/uwdata/living-papers/tree/main/templates): Article templates
  - [`html`](https://github.com/uwdata/living-papers/tree/main/templates/html): Built-in templates for HTML output
  - [`latex`](https://github.com/uwdata/living-papers/tree/main/templates/latex): Built-in templates for LaTeX output
