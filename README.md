# GymPass-style App

This is a GymPass-style application built with **Node.js** for studying and practicing **SOLID principles** in a real-world context.  
It includes features such as:

- User registration and authentication
- Gym search and check-in functionality
- Check-in validation with geolocation rules
- Admin-only gym and check-in validation management
- JWT-based authentication and PostgreSQL data persistence

Perfect for applying clean architecture and solid software design patterns.

## FRs (Functional Requirements)

- [x] It must be possible to register;
- [x] It must be possible to authenticate;
- [ ] It must be possible to retrieve the profile of a logged-in user;
- [ ] It must be possible to retrieve the number of check-ins made by the logged-in user;
- [ ] It must be possible for the user to retrieve their check-in history;
- [ ] It must be possible for the user to search for nearby gyms;
- [ ] It must be possible for the user to search for gyms by name;
- [ ] It must be possible for the user to check in at a gym;
- [ ] It must be possible to validate a user’s check-in;
- [ ] It must be possible to register a gym;

## BRs (Business Rules)

- [x] A user must not be able to register with a duplicate email;
- [ ] A user must not be able to perform more than one check-in per day;
- [ ] A user must not be able to check in unless they are within 100 meters of the gym;
- [ ] A check-in can only be validated within 20 minutes of its creation;
- [ ] Only administrators can validate check-ins;
- [ ] Only administrators can register gyms;

## NFRs (Non-Functional Requirements)

- [x] The user's password must be encrypted;
- [x] The application data must be persisted in a PostgreSQL database;
- [ ] All data listings must be paginated with 20 items per page;
- [ ] The user must be identified via a JWT (JSON Web Token);
