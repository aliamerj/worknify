<p align="center">
  <img src="https://www.worknify.com/_next/image?url=%2Fworknify_main_logo.svg&w=256&q=75" alt="Worknify Logo" style="background: white; padding: 10px;">
</p>

# Worknify: Open-Source Collaboration and Project Management

## Introduction

**Worknify** is a cutting-edge, open-source platform engineered to transform project management and professional growth. By integrating essential tools for portfolio creation, project execution, and task management within one user-friendly environment, Worknify stands out as an essential service for professionals and teams. Developed with a robust tech stack including Next.js 13, PostgreSQL, AWS, and Docker, Worknify is committed to delivering top-tier performance and scalability.

## Features

### Personalized Portfolio Creation

- **Custom Design**: Utilize an array of design templates and customization options to reflect your unique professional identity.
- **Content Rich**: Embed multimedia content to showcase your projects, papers, certificates, and more.

### Advanced Project Management

- **Comprehensive Control**: Manage your project's lifecycle with detailed tools for planning, tracking, and analyzing progress.
- **Collaboration**: Share your projects, receive feedback, and collaborate with peers or stakeholders in real-time.

### Efficient Task Management

- **Kanban Boards**: Organize your tasks with customizable Kanban boards that adapt to your workflow.
- **Progress Tracking**: Monitor task completion, pending actions, and timelines effortlessly.

## Built With

- **[Next.js 13](https://nextjs.org/)**: A React framework for production, providing excellent features like hybrid static & server rendering, TypeScript support, smart bundling, and more.
- **[PostgreSQL](https://www.postgresql.org/)**: A powerful, open-source object-relational database system with over 30 years of active development.
- **[AWS](https://aws.amazon.com/)**: Offering reliable, scalable, and inexpensive cloud computing services.
- **[Docker](https://www.docker.com/)**: A platform for developing, shipping, and running applications in containers.

## More info in [project page on worknify](https://www.worknify.com/project/view/2)

## Getting Started

Follow these steps to get a local copy up and running.

All tasks and plans for this project listed in this [project page on worknify](https://www.worknify.com/dashboard/2)

### Prerequisites

- Node.js
- PostgreSQL
- Docker
- AWS CLI

### Installation
1. Install docker

2. **Clone the repository:**

   ```bash
   git clone https://github.com/aliamerj/worknify.git
   cd worknify
3. set up .env
   ```bash
   NEXTAUTH_URL= http://localhost:3000
   NEXTAUTH_SECRET= ...
   # google
   GOOGLE_CLIENT_ID= ...
   GOOGLE_CLIENT_SECRET= ...
   # FACEBOOK
   FACEBOOK_CLIENT_ID=...
   FACEBOOK_CLIENT_SECRET=...
   # gitub need to change
   AUTH_GITHUB_ID=...
   AUTH_GITHUB_SECRET=...
   # DATABASE
   DATABASE_URL=...
   PGPASSWORD=...
   S3_NAME=...
   S3_REGIN=...
   IAM_KEY=...
   IAM_SECRET=...
   ```
5. run the app locally with :
   ```bash
   docker compose up
   ```
