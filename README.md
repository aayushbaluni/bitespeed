
# BiteSpeed Assignment

It was an assignment given by Bitespeed team which intended to create an api that can identify multiple same customer based on fields like phone number and email. It consists of multiple secondary and one primary contacts and joins and updation based on them.



## Tech Stack


**Server:** Node, Express, Prisma

**Database:** Postgresql


## API Reference

#### Get all Customer of Given Email or Phone Number.

```http
  POST /identify
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email`   | `string`    | Email Address of Customer|
| `phoneNumber` | `string` | Phone Number of Customer |





## 🔗 Demo

https://bitespeed-2pzb.onrender.com


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`


## Run Locally

Clone the project

```bash
  git clone https://github.com/aayushbaluni/bitespeed.git
```

Go to the project directory

```bash
  cd bitespeed
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node server.js
```


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://portfolio-aayushbalunis-projects.vercel.app/)

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ayush-baluni-1469a4241/)

