# JobLess

Project developed for the discipline "Software Development Methods" - Faculty of Mathematics and Computer Science, University of Bucharest.

# Teams Members:
- **[Dragomir Daria Nicoleta, grupa 252](https://github.com/dariadragomir)**  

- **[Grigorașcu Andrei Antonio, grupa 251](https://github.com/Antonio-Grigorascu)**  

- **[Jilavu Izabela Maria, grupa 251](https://github.com/izabelamaria24)**  

- **[Soare Alex Antonio, grupa 251](https://github.com/raizojpg)**  

# Description of application:
This is a web application designed to help users organize and track all their job applications in one central place.

**Key Features**:
- Application Tracker: Users can log each job they apply to and update the status (e.g., Applied, Interviewing, Offer).

- Reminders for Deadlines: Get notifications for important dates like application deadlines or interviews.

- Progress Statistics: Visual summaries (charts or progress bars) show how many applications are active, successful, rejected, etc.

- Centralized Information: Store everything in one place—job post link, job description, submitted CV, interview date and time, and any other notes.

**Inspiration**:
A real-life situation that many of us are going through right now—job hunting. It can be chaotic and stressful, so this app aims to bring clarity, structure, and peace of mind to that process.


# **[Demo](https://youtu.be/Q4RYpFnFuus)** 

# **[Documentation](https://github.com/izabelamaria24/JobLess/blob/develop/Documentation.pdf)**

# User Stories:

1. As a user, I want to quickly add applied jobs by filling in fields such as company name, job title, link, and application date, along with progress stages ('Applied,' 'Interview Scheduled,' 'Offer Received,' and 'Rejected').
2. As a user, I want to create a profile so I can save my progress and log in using my email.
3. As a user, I want to receive reminders for application deadlines or upcoming interview stages via email or SMS (e.g., '3 days until OA deadline').
4. As a user, I want to receive example interview questions from a company before an interview, based on my job applications or the technologies listed in the job description.
5. As a user, I want the app to notify me to follow up on a job application after a certain period (e.g., 3 weeks since the last update) to check the status.
6. As a user, I want a visual dashboard with charts displaying my application progress.
7. As a user, I want to see all the events I need to participate in, sorted by the closest deadline. I want to have the feature to filter by event category (OA/Interview/etc).
8. As a user, I want a visual dashboard with statistics including the number of jobs applied, interviews scheduled, and offers received.
9. As a user, I want to upload and manage different versions of my CV and cover letter so I can quickly tailor applications.
10. As a user, I want the app to provide AI-powered resume and cover letter suggestions based on the job description I’m applying to.
11. As a user, I want to receive tips based on my job applications and feedback to strengthen specific skills.
12. As a user, I want to compare salary offers and benefits from multiple companies to make an informed decision.

# Backlog creation - Jira:
We used Jira to plan, track, and manage our project and tasks. This **[link](https://izabelajilavu.atlassian.net/jira/software/projects/JBLS/boards/1)** redirects to our backlog creation.

# Source control: 
All of our project can be accessed on github, **[commits](https://github.com/izabelamaria24/JobLess/commits/develop/)** și **[branches](https://github.com/izabelamaria24/JobLess/branches)** can be found here.

# **[Conceptual diagram](https://github.com/izabelamaria24/JobLess/blob/develop/Diagrams/JobLess.png)**

# **[ER diagram](https://github.com/izabelamaria24/JobLess/blob/develop/Diagrams/JobLessER.png)**

# **[UML diagram](https://github.com/izabelamaria24/JobLess/blob/develop/Diagrams/JobLess_UML.png)**

# Bug reporting: 
Issues 
- **[commit 7f6e2b1](https://explore-flask.readthedocs.io/en/latest/conventions.html)**
- **[commit ae453ae](https://github.com/izabelamaria24/JobLess/commit/ae453aeec54071335681104a5446697b533e927d)**
- **[commit 23eae44](https://github.com/izabelamaria24/JobLess/commit/23eae44d7235a04e0e22aa346eff3b74b19c3e54)**
- **[commit 44853b7](https://github.com/izabelamaria24/JobLess/commit/44853b70063850faeb1a9dff3d16a7599e5e661a)**
- **[commit 78deaf1](https://github.com/izabelamaria24/JobLess/commit/78deaf1a603cf18b109bd81d682f16c284ed5792)**.

# **[AI use process documentation](https://github.com/izabelamaria24/JobLess/blob/develop/AI%20use%20documentation.pdf)**
# Code standards:
**[Backend standard:](https://google.github.io/styleguide/csharp-style.html )** C# at Google Style Guide

**[Frontend standard:](https://react.dev/reference/rules)** Rules of React

# Build Tools: 
C# ASP.NET Core **[MSBuild](https://learn.microsoft.com/en-us/visualstudio/msbuild/msbuild-command-line-reference?view=vs-2022 )** 

Database migrations **[EF Core Command-line Tools](https://learn.microsoft.com/en-us/ef/core/cli/powershell#add-migration )** 

# Design patterns:
RESTful web API *Architectural Pattern* **[Microsoft best practices](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design )** :
  - Resource URI
  - HTTP request methods (GET, POST, PUT, PATCH, DELETE)
  - Asynchronous methods
  - Data transfer objects

Server-side ASP.NET *Framework choice*
  - Models, controllers, DTOs, attributes and services

Client-side React *Component-based UI Pattern*
  - Component Composition, Higher-Order Components (HOC)

LLM integration Flask

Dependency injection *Creational Pattern*

Factory Class *(Creational Pattern)*

# Automated tests:
**[Unit tests](https://github.com/izabelamaria24/JobLess/blob/develop/backend_test.py)**
