# TanjaMarket — Backend

REST API for TanjaMarket, a classified ads platform for Tanger, Morocco.

🔗 **Frontend:** [tanja-market-frontend.vercel.app](https://tanja-market-frontend.vercel.app)  
🔗 **Frontend Repo:** [tanjaMarket-frontend](https://github.com/amine-laouraidi/tanjaMarket-frontend)

---

## Tech

- **Node.js / Express.js**
- **MongoDB / Mongoose**
- **JWT** with refresh tokens
- **Zod** for request validation
- **Cloudinary** for image storage (URLs sent from frontend)

## Security

- `helmet` — HTTP headers protection
- `express-mongo-sanitize` — NoSQL injection prevention
- `xss-clean` — XSS attack prevention
- `cors` — restricted to frontend origin
- `express-rate-limit` — rate limiting on all routes
- `cookie-parser` — secure cookie handling

---

## Run locally

```bash
git clone https://github.com/amine-laouraidi/TanjaMarket-Backend.git
cd TanjaMarket-Backend
npm install
npm run server
```

Create a `.env` file:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:3000
```

---

## API Overview

**Auth** — register, login, logout, refresh token, update profile

**Ads** — create, read, update, delete, get by user

**Categories / Subcategories** — browse ads by category

**Fields** — dynamic field templates per category

**Saved Ads** — save and unsave ads

**Admin** — manage users and ads

---

## Notes

This is a portfolio project — still a work in progress. Feedback is welcome.